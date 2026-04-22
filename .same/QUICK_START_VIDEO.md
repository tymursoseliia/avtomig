# 🚀 Быстрый старт: Создание таблицы Video Reviews

## 1️⃣ Откройте Supabase SQL Editor

Перейдите: **Ваш проект Supabase** → **SQL Editor** → **+ New query**

## 2️⃣ Скопируйте и выполните этот SQL:

```sql
-- Создание таблицы video_reviews
create table if not exists public.video_reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  video_url text not null,
  platform text not null check (platform in ('rutube', 'youtube')),
  thumbnail_url text
);

-- Включение Row Level Security
alter table public.video_reviews enable row level security;

-- Политики доступа
create policy "Allow public read access"
  on public.video_reviews for select using (true);

create policy "Allow authenticated insert"
  on public.video_reviews for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated update"
  on public.video_reviews for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated delete"
  on public.video_reviews for delete
  using (auth.role() = 'authenticated');

-- Тестовые данные
insert into public.video_reviews (title, video_url, platform)
values
  ('Отзыв клиента - Mercedes C-Class', 'https://rutube.ru/video/a1b2c3d4e5f6/', 'rutube'),
  ('Отзыв клиента - Audi Q5', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube'),
  ('Отзыв клиента - BMW 5 Series', 'https://rutube.ru/video/f6e5d4c3b2a1/', 'rutube');
```

## 3️⃣ Нажмите RUN (или Ctrl+Enter)

## 4️⃣ Готово! ✅

Теперь перезагрузите сайт и видео-отзывы будут отображаться на главной странице!

---

📝 **Подробная документация**: `.same/SUPABASE_VIDEO_SETUP.md`
