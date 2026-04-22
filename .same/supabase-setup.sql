-- Создание таблицы для автомобилей
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  mileage INTEGER NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  transmission VARCHAR(50) NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'available',
  location VARCHAR(100) DEFAULT 'Европа'
);

-- Включаем Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Политика: все могут читать
CREATE POLICY "Все могут просматривать автомобили" ON cars
  FOR SELECT USING (true);

-- Политика: только аутентифицированные могут вставлять
CREATE POLICY "Только авторизованные могут добавлять" ON cars
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Политика: только аутентифицированные могут обновлять
CREATE POLICY "Только авторизованные могут обновлять" ON cars
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Политика: только аутентифицированные могут удалять
CREATE POLICY "Только авторизованные могут удалять" ON cars
  FOR DELETE USING (auth.role() = 'authenticated');

-- Создание хранилища для фото автомобилей
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true)
ON CONFLICT DO NOTHING;

-- Политика для загрузки фото
CREATE POLICY "Все могут загружать фото" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'car-images');

-- Политика для просмотра фото
CREATE POLICY "Все могут просматривать фото" ON storage.objects
  FOR SELECT USING (bucket_id = 'car-images');
