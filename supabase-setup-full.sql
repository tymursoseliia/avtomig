-- ==========================================
-- ПОЛНАЯ НАСТРОЙКА БАЗЫ ДАННЫХ ДЛЯ ОРЕОН
-- ==========================================

-- 1. Создание таблицы CARS (Автомобили)
create table if not exists public.cars (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  brand text not null,
  model text not null,
  year integer not null,
  price numeric not null,
  mileage integer not null,
  fuel_type text not null,
  transmission text not null,
  engine_volume numeric,
  drive_type text,
  description text not null,
  images text[] not null default '{}',
  status text not null check (status in ('available', 'sold', 'reserved')),
  location text not null
);

alter table public.cars enable row level security;
create policy "Allow public read access" on public.cars for select using (true);
create policy "Allow authenticated modify" on public.cars for all using (auth.role() = 'authenticated');


-- 2. Создание таблицы VIDEO_REVIEWS
create table if not exists public.video_reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  video_url text not null,
  platform text not null check (platform in ('rutube', 'youtube')),
  thumbnail_url text
);

alter table public.video_reviews enable row level security;
create policy "Allow public read access" on public.video_reviews for select using (true);
create policy "Allow authenticated modify" on public.video_reviews for all using (auth.role() = 'authenticated');


-- 3. Создание таблицы PHOTO_REVIEWS
create table if not exists public.photo_reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  text text not null,
  car_image_url text not null,
  platform text not null check (platform in ('2gis', 'yandex')),
  rating numeric not null default 5.0
);

alter table public.photo_reviews enable row level security;
create policy "Allow public read access" on public.photo_reviews for select using (true);
create policy "Allow authenticated modify" on public.photo_reviews for all using (auth.role() = 'authenticated');

-- Добавляем дефолтные отзывы в таблицу
insert into public.photo_reviews (name, text, car_image_url, platform, rating) values
('Павел Д.', 'Все прошло на высшем уровне. Доставили быстро, авто в идеальном состоянии, документы оформлены без задержек. Приятно, когда люди следуют выполненным сроках!', 'https://i.ibb.co/yB7vDp2c/photo-2026-01-14-12-40-23.jpg', '2gis', 5.0),
('Екатерина Л.', 'Приехала на свою новую машину, как только планировала! Довольна качеством и состоянием авто, а также отличным сервисом и четкостью на всех этапах. Все организовано быстро и удобно.', 'https://i.ibb.co/qMSXBdFL/photo-2026-01-14-12-40-43.jpg', '2gis', 4.9),
('Максим Р.', 'Решил купить авто из Европы и не ошибся. Все расходы и этапы были прозрачны, заранее, и автомобиль доставили вовремя. Очень рад, что выбрал вас!', 'https://i.ibb.co/4GYrgJb/photo-2026-01-14-12-40-55.jpg', 'yandex', 5.0),
('Виктор С.', 'Очень рекомендую этот способ покупки! Автомобиль пригнали в отличном виде, документы в порядке. Профессиональная команда, с которой приятно работать.', 'https://i.ibb.co/j9jbH9vJ/photo-2026-01-19-12-55-04.jpg', 'yandex', 5.0),
('Лариса Д.', 'Автомобиль приехал в отличном состоянии. Как и обещали, проверка была быстрой. Весь процесс прошел гладко и без каких-либо сюрпризов.', 'https://i.ibb.co/SDSkFmCB/photo-2026-01-19-13-00-11.jpg', '2gis', 5.0),
('Федор П.', 'Спасибо за честность и профессионализм! Машина соответствует всем заявленным характеристикам. Процесс был прозрачным от начала до конца.', 'https://i.ibb.co/dJfRt4YZ/photo-2026-01-26-17-10-30.jpg', 'yandex', 5.0),
('Дмитрий В.', 'Очень доволен качеством подбора и скоростью доставки. Цена действительно выгоднее, чем у дилеров. Получил именно то, что хотел!', 'https://i.ibb.co/GLyBZ69/photo-2026-01-26-17-33-52.jpg', '2gis', 5.0),
('Сергей М.', 'Отличный сервис! Помогли с выбором, организовали доставку, оформили все документы. Рекомендую всем, кто хочет купить авто из Европы.', 'https://i.ibb.co/sJssx8HP/photo-2026-01-27-15-36-53.jpg', 'yandex', 4.9),
('Алексей Т.', 'Машина пришла в идеальном состоянии! Все как в описании. Спасибо за профессиональную работу и внимание к деталям.', 'https://i.ibb.co/HLsdvDM2/photo-2026-01-30-13-27-51.jpg', '2gis', 5.0),
('Игорь П.', 'Весь процесс занял меньше месяца. Отличная поддержка на всех этапах. Автомобиль полностью соответствует ожиданиям!', 'https://i.ibb.co/TxzYwpTG/photo-2026-01-30-13-27-52.jpg', 'yandex', 5.0),
('Анна В.', 'Качество подбора на высоте, все документы в порядке. Очень довольна сотрудничеством! Автомобиль мечты получен.', 'https://i.ibb.co/JWkRjMk2/photo-2026-02-05-13-08-15-2.jpg', '2gis', 5.0),
('Андрей Л.', 'Профессиональный подход, честные цены, быстрая доставка. Всё на высшем уровне! Буду рекомендовать друзьям.', 'https://i.ibb.co/Q3qS7MMH/photo-2026-02-05-13-08-15.jpg', 'yandex', 4.9),
('Ельвира К.', 'Получила автомобиль точно в срок. Вся информация была предоставлена заранее. Никаких скрытых платежей. Отличная работа!', 'https://i.ibb.co/h1wMxhr0/photo-2026-02-12-13-08-08.jpg', '2gis', 5.0),
('Владимир Б.', 'Очень доволен покупкой! Автомобиль в отличном состоянии, все документы оформлены правильно. Спасибо за качественную работу!', 'https://i.ibb.co/213tpzZq/photo-2026-02-12-13-08-12.jpg', 'yandex', 5.0),
('Константин Д.', 'Приятно удивлен качеством сервиса. Весь процесс был прозрачным и понятным. Автомобиль соответствует всем ожиданиям!', 'https://i.ibb.co/4BKx44M/photo-2026-02-03-13-15-49.jpg', '2gis', 5.0),
('Николай П.', 'Превосходный опыт покупки! Команда профессионалов сделала всё быстро и качественно. Автомобиль мечты теперь у меня!', 'https://i.ibb.co/DDf4dP2V/photo-2026-02-12-13-10-04.jpg', '2gis', 5.0);


-- 4. Хранилище (Storage BUCKETS) для картинок
insert into storage.buckets (id, name, public) 
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

create policy "Allow public read access to storage" 
on storage.objects for select 
using (bucket_id = 'car-images');

create policy "Allow authenticated upload to storage" 
on storage.objects for insert 
with check (bucket_id = 'car-images' and auth.role() = 'authenticated');

create policy "Allow authenticated delete from storage" 
on storage.objects for delete
using (bucket_id = 'car-images' and auth.role() = 'authenticated');
