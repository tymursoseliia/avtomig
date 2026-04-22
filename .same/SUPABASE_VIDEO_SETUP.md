# Настройка таблицы Video Reviews в Supabase

## Шаг 1: Откройте Supabase SQL Editor

1. Перейдите на [https://supabase.com](https://supabase.com)
2. Войдите в свой проект
3. В левом меню выберите **SQL Editor** (иконка базы данных)

## Шаг 2: Создайте новый запрос

1. Нажмите **+ New query**
2. Скопируйте и вставьте следующий SQL код:

```sql
-- Create video_reviews table
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
```

## Шаг 3: Выполните запрос

1. Нажмите кнопку **Run** (или Ctrl+Enter / Cmd+Enter)
2. Дождитесь сообщения об успешном выполнении

## Шаг 4: Добавьте тестовые видео (опционально)

Выполните следующий запрос для добавления тестовых данных:

```sql
insert into public.video_reviews (title, video_url, platform, thumbnail_url)
values
  ('Отзыв Павла - Mercedes C-Class', 'https://rutube.ru/video/a1b2c3d4e5f6/', 'rutube', null),
  ('Отзыв Екатерины - Audi Q5', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', null),
  ('Отзыв Максима - BMW 5 Series', 'https://rutube.ru/video/f6e5d4c3b2a1/', 'rutube', null);
```

## Шаг 5: Проверьте таблицу

1. В левом меню выберите **Table Editor**
2. Найдите таблицу `video_reviews`
3. Убедитесь, что таблица создана и содержит тестовые данные

## Структура таблицы

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | uuid | Уникальный идентификатор (генерируется автоматически) |
| `created_at` | timestamp | Дата создания записи |
| `title` | text | Название видео-отзыва |
| `video_url` | text | Ссылка на видео (Rutube или YouTube) |
| `platform` | text | Платформа: 'rutube' или 'youtube' |
| `thumbnail_url` | text | URL превью видео (опционально) |

## Политики безопасности (RLS)

- ✅ **Чтение** - доступно всем (публичный доступ)
- 🔒 **Создание** - только авторизованные пользователи
- 🔒 **Обновление** - только авторизованные пользователи
- 🔒 **Удаление** - только авторизованные пользователи

## Как добавить видео через админ-панель

После создания таблицы, вы сможете добавлять видео через админ-панель:

1. Перейдите на `/admin` (сначала войдите через `/login`)
2. Выберите вкладку **Видео-отзывы**
3. Заполните форму:
   - **Название** - например, "Отзыв Павла - Mercedes C-Class"
   - **URL видео** - вставьте ссылку на Rutube или YouTube
   - **Платформа** - выберите Rutube или YouTube
4. Нажмите **Добавить видео**

## Форматы ссылок

### Rutube
```
https://rutube.ru/video/1234567890abcdef/
```

### YouTube
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

## Готово! 🎉

Теперь видео-отзывы будут отображаться на главной странице и на странице `/reviews`
