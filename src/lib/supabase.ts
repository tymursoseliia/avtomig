import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isMock = supabaseUrl === 'https://your-project.supabase.co' || !supabaseUrl;

// Локальное хранилище данных для тестирования (в памяти)
const mockStorageFiles: Record<string, string> = {}; // path -> base64 

const mockStorage: Record<string, any[]> = {
  'video_reviews': [
    {
      id: '1',
      created_at: new Date().toISOString(),
      title: 'Пример видео (Youtube)',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'youtube'
    }
  ],
  'photo_reviews': [
    {
      id: '1',
      created_at: new Date().toISOString(),
      name: 'Антон Б.',
      text: 'Отличный сервис! Пригнали машину очень быстро.',
      car_image_url: 'https://loremflickr.com/600/400/cars?random=1',
      platform: 'yandex',
      rating: 5.0
    }
  ],
  'cars': []
};

// Функция создания мок-клиента
const createMockSupabase = () => {
  console.warn('⚠️ Используется локальный MOCK-клиент Supabase. Данные только в памяти!');
  
  return {
    auth: {
      signInWithPassword: async () => ({ data: { user: { id: 'mock-user' } }, error: null }),
      getSession: async () => ({ data: { session: { user: { id: 'mock-user' } } }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: (tableName: string) => ({
      select: () => ({
        order: async () => ({ data: [...(mockStorage[tableName] || [])], error: null }),
      }),
      insert: async (rows: any[]) => {
        if (!mockStorage[tableName]) mockStorage[tableName] = [];
        const newRows = rows.map(r => ({ id: Math.random().toString(), created_at: new Date().toISOString(), ...r }));
        mockStorage[tableName].push(...newRows);
        return { error: null };
      },
      update: (data: any) => ({
        eq: async (field: string, val: string) => {
          const table = mockStorage[tableName] || [];
          const index = table.findIndex(r => r[field] === val);
          if (index !== -1) table[index] = { ...table[index], ...data };
          return { error: null };
        }
      }),
      delete: () => ({
        eq: async (field: string, val: string) => {
          if (mockStorage[tableName]) {
             mockStorage[tableName] = mockStorage[tableName].filter(r => r[field] !== val);
          }
          return { error: null };
        }
      }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => {
          await new Promise(r => setTimeout(r, 200)); // Имитация загрузки
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              mockStorageFiles[path] = reader.result as string;
              resolve({ error: null });
            };
            reader.readAsDataURL(file);
          });
        },
        getPublicUrl: (path: string) => ({ 
          data: { publicUrl: mockStorageFiles[path] || `https://loremflickr.com/600/400/cars?random=${Math.random()}` } 
        })
      })
    }
  } as any;
};

export const supabase = isMock ? createMockSupabase() : createClient(supabaseUrl, supabaseAnonKey);

export type Car = {
  id: string;
  created_at: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  engine_volume?: number; // Объем двигателя в литрах
  drive_type?: string; // Тип привода (передний, задний, полный)
  description: string;
  images: string[];
  status: 'available' | 'sold' | 'reserved';
  location: string;
};

export type VideoReview = {
  id: string;
  created_at: string;
  title: string;
  video_url: string;
  platform: 'rutube' | 'youtube';
  thumbnail_url?: string;
};

export type PhotoReview = {
  id: string;
  created_at: string;
  name: string;
  text: string;
  car_image_url: string;
  platform: '2gis' | 'yandex';
  rating: number;
};
