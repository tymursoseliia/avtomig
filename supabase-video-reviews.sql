-- Create video_reviews table in Supabase
-- Run this SQL in your Supabase SQL Editor

create table if not exists public.video_reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  video_url text not null,
  platform text not null check (platform in ('rutube', 'youtube')),
  thumbnail_url text
);

-- Enable Row Level Security
alter table public.video_reviews enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access"
  on public.video_reviews
  for select
  using (true);

-- Create policy to allow authenticated users to insert
create policy "Allow authenticated insert"
  on public.video_reviews
  for insert
  with check (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update
create policy "Allow authenticated update"
  on public.video_reviews
  for update
  using (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete
create policy "Allow authenticated delete"
  on public.video_reviews
  for delete
  using (auth.role() = 'authenticated');

-- Insert sample data (optional)
insert into public.video_reviews (title, video_url, platform)
values
  ('Отзыв клиента 1', 'https://rutube.ru/video/1234567890abcdef/', 'rutube'),
  ('Отзыв клиента 2', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube');
