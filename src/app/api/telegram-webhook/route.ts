import { NextResponse } from "next/server";
import { parseCarPost } from "@/lib/telegram-parser";
import { supabase as defaultSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// Get telegram token from env
const BOT_TOKEN = process.env.PARSER_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

// Create admin client if possible
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseClient = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : defaultSupabase;

export async function POST(req: Request) {
  try {
    if (!BOT_TOKEN) {
      console.error("No TELEGRAM_BOT_TOKEN found in env");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const body = await req.json();

    // We only care about channel posts
    const post = body.channel_post;
    if (!post) {
      return NextResponse.json({ status: "ignored - not a channel post" });
    }

    // Try to get text/caption
    const text = post.text || post.caption;
    if (!text) {
      return NextResponse.json({ status: "ignored - no text" });
    }

    // Parse the car details
    const parsedData = parseCarPost(text);
    if (!parsedData) {
      return NextResponse.json({ status: "ignored - could not parse car details" });
    }

    let imageUrl = null;

    // Check if there is a photo
    if (post.photo && Array.isArray(post.photo) && post.photo.length > 0) {
      // Telegram sends multiple sizes. The last one is the largest.
      const largestPhoto = post.photo[post.photo.length - 1];
      const fileId = largestPhoto.file_id;

      try {
        // 1. Get file path
        const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
        const fileData = await fileRes.json();
        
        if (fileData.ok && fileData.result.file_path) {
          const filePath = fileData.result.file_path;
          
          // 2. Download the actual file
          const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
          const imageRes = await fetch(downloadUrl);
          
          if (imageRes.ok) {
            const imageBuffer = await imageRes.arrayBuffer();
            
            // 3. Upload to Supabase Storage
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
              // 4. Get public URL
              const { data: publicUrlData } = supabaseClient.storage
                .from('car-images')
                .getPublicUrl(filename);
              
              imageUrl = publicUrlData.publicUrl;
            }
          }
        }
      } catch (err) {
        console.error("Error processing photo:", err);
        // Continue even if photo fails, we can still insert the car
      }
    }

    // Insert into Supabase cars table
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
          location: 'Под заказ из Европы' // Default location
        }
      ]);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, parsedData });
    
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
