import { NextResponse } from "next/server";
import { parseCarPost } from "@/lib/telegram-parser";
import { supabase as defaultSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// Get telegram token from env
const BOT_TOKEN = process.env.TELEGRAM_PARSER_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Create admin client if possible
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseClient = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : defaultSupabase;

async function sendDebugToAdmin(message: string) {
  if (!BOT_TOKEN || !CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });
  } catch (e) {
    console.error("Debug send error", e);
  }
}

// Этап 1: Регистрация вебхука
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('setup') === 'true') {
    if (!BOT_TOKEN) return NextResponse.json({ error: "No token" }, { status: 500 });
    
    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const WEBHOOK_URL = `${protocol}://${host}/api/telegram-webhook`;
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}`);
    const data = await response.json();
    return NextResponse.json({ setup: true, webhook_url: WEBHOOK_URL, telegram_response: data });
  }
  return NextResponse.json({ status: "ok" });
}

export async function POST(req: Request) {
  try {
    if (!BOT_TOKEN) {
      console.error("No TELEGRAM_BOT_TOKEN found in env");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const body = await req.json();

    // Этап 2: Фильтрация мусора и каналов
    const channelPost = body.channel_post || body.edited_channel_post || body.message;
    if (!channelPost) {
      return NextResponse.json({ status: "ignored - not a channel post" });
    }

    const chatUsername = channelPost.chat?.username?.toLowerCase();
    const forwardUsername = channelPost.forward_origin?.chat?.username?.toLowerCase();
    
    const targetChannelsStr = (process.env.TELEGRAM_CHANNEL_USERNAME || 'avtomig').toLowerCase();
    const targetChannels = targetChannelsStr.split(/[\s,]+/).map(c => c.trim().replace('https://t.me/', '').replace('@', '').replace('/', ''));
    
    // We allow either if it matched any of our target channels, or if no target channel is defined (to avoid breaking)
    const isFromOurChannel = 
      (chatUsername && targetChannels.includes(chatUsername)) || 
      (forwardUsername && targetChannels.includes(forwardUsername)) || 
      !process.env.TELEGRAM_CHANNEL_USERNAME;
    
    if (!isFromOurChannel) {
      return NextResponse.json({ status: 'ignored' });
    }

    // Try to get text/caption
    const text = channelPost.text || channelPost.caption;
    if (!text) {
      return NextResponse.json({ status: "ignored - no text" });
    }

    // Этап 3: Парсинг текста
    const parsedData = parseCarPost(text);
    if (!parsedData || !parsedData.price || !parsedData.year) {
      await sendDebugToAdmin(`Я пропустил этот пост, потому что не нашел цену или год (или это не авто).\n\nТекст:\n${text.substring(0, 500)}...`);
      return NextResponse.json({ status: "ignored - could not parse car details" });
    }

    let imageUrl = null;

    // Этап 4: Выкачивание фотографии навсегда
    if (channelPost.photo && Array.isArray(channelPost.photo) && channelPost.photo.length > 0) {
      const largestPhoto = channelPost.photo[channelPost.photo.length - 1];
      const fileId = largestPhoto.file_id;

      try {
        const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
        const fileData = await fileRes.json();
        
        if (fileData.ok && fileData.result.file_path) {
          const filePath = fileData.result.file_path;
          const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
          const imageRes = await fetch(downloadUrl);
          
          if (imageRes.ok) {
            const imageBuffer = await imageRes.arrayBuffer();
            
            // Upload to Supabase Storage
            const filename = `${Date.now()}-${fileId}.jpg`;
            const { error: uploadError } = await supabaseClient.storage
              .from('car-images')
              .upload(filename, imageBuffer, {
                contentType: 'image/jpeg',
                upsert: true
              });

            if (uploadError) {
              console.error("Storage upload error:", uploadError);
            } else {
              const { data: publicUrlData } = supabaseClient.storage
                .from('car-images')
                .getPublicUrl(filename);
              
              imageUrl = publicUrlData.publicUrl;
            }
          }
        }
      } catch (err) {
        console.error("Error processing photo:", err);
      }
    }

    // Этап 5: Запись в БД
    const { error: insertError } = await supabaseClient
      .from('cars')
      .insert([
        {
          brand: parsedData.brand,
          model: parsedData.model,
          year: parsedData.year,
          price: parsedData.price,
          mileage: parsedData.mileage,
          fuel_type: parsedData.fuel_type,
          transmission: parsedData.transmission,
          description: parsedData.description,
          images: imageUrl ? [imageUrl] : [],
          status: 'available',
          location: 'Под заказ из Европы'
        }
      ]);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      await sendDebugToAdmin(`Ошибка записи в БД:\n${insertError.message}`);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, parsedData });
    
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    await sendDebugToAdmin(`Фатальная ошибка вебхука:\n${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
