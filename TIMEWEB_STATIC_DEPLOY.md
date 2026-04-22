# 📦 Инструкция: Статический экспорт для обычного хостинга Таймвеб

## ✅ Вариант B: Статический экспорт (Простой хостинг)

### Преимущества:
- ✅ Дешевле (обычный хостинг)
- ✅ Быстрая загрузка
- ✅ Простое обслуживание

### Ограничения:
- ❌ Не работают серверные API (/api/telegram)
- ❌ Админ-панель не будет работать полноценно
- ❌ Нужно отдельное решение для отправки форм

---

## ⚠️ ВАЖНО: Что НЕ будет работать

1. **Отправка форм в Telegram** - нужно настроить альтернативу
2. **Админ-панель** - требует серверную часть
3. **Динамические данные из Supabase** - будут показаны только при сборке

---

## Шаг 1: Подготовка проекта

### 1.1. Откройте файл next.config.js и измените:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Добавьте эту строку!
  images: {
    unoptimized: true,
  },
  // ... остальные настройки
};

module.exports = nextConfig;
```

### 1.2. Создайте файл .env.production:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Для статического экспорта
NEXT_PUBLIC_STATIC_EXPORT=true
```

---

## Шаг 2: Сборка статического сайта

### 2.1. Локально на вашем компьютере:

```bash
cd auto-europe-site

# Установите зависимости (если еще не установлены)
bun install

# Соберите статический сайт
bun run build
```

После успешной сборки появится папка **`out`** - это и есть ваш статический сайт!

---

## Шаг 3: Загрузка на Таймвеб

### 3.1. Через FTP (FileZilla, WinSCP):

1. **Скачайте FileZilla:** https://filezilla-project.org/
2. **Подключитесь к Таймвеб:**
   - **Хост:** ftp.ваш-домен.ru
   - **Логин:** ваш логин
   - **Пароль:** ваш пароль
   - **Порт:** 21

3. **Загрузите содержимое папки `out`:**
   - Откройте локальную папку `auto-europe-site/out`
   - Выделите ВСЕ файлы внутри папки `out`
   - Перетащите в папку `public_html` на сервере

### 3.2. Структура на сервере должна быть:

```
public_html/
├── _next/
├── about/
├── admin/
├── catalog/
├── favicon.svg
├── index.html
├── reviews/
└── team/
```

---

## Шаг 4: Настройка .htaccess (для правильной маршрутизации)

Создайте файл `.htaccess` в папке `public_html`:

```apache
# Включаем перезапись URL
RewriteEngine On

# Редирект с www на без www (или наоборот)
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ http://%1/$1 [R=301,L]

# Правила для Next.js статики
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/_next
RewriteCond %{REQUEST_URI} !\.(jpg|jpeg|gif|png|css|js|ico|xml|svg|woff|woff2|ttf|eot)$ [NC]
RewriteRule ^([^/]+)/?$ /$1.html [L]

# Редирект на index.html для главной страницы
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^$ /index.html [L]

# Кеширование статических файлов
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>

# Сжатие
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript text/javascript
</IfModule>
```

---

## Шаг 5: Альтернатива для форм (БЕЗ Telegram бота)

Так как серверные API не работают, используйте один из вариантов:

### Вариант 1: FormSubmit (Бесплатно)

Измените форму для отправки на email:

```html
<form action="https://formsubmit.co/ooo.oreongroups@mail.ru" method="POST">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <input type="tel" name="phone" required>
  <button type="submit">Отправить</button>
</form>
```

### Вариант 2: Google Forms

1. Создайте Google форму
2. Встройте её на сайт
3. Ответы будут приходить в Google Sheets

### Вариант 3: Tally.so (Рекомендую)

1. Зарегистрируйтесь на https://tally.so
2. Создайте форму
3. Получите код для встраивания
4. Ответы приходят на email + можно интегрировать с Telegram

---

## Шаг 6: Настройка SSL

1. В панели Таймвеб перейдите в **SSL**
2. Выберите **Let's Encrypt**
3. Установите бесплатный SSL сертификат

---

## 🔄 Обновление статического сайта

Когда нужно обновить сайт:

1. **Внесите изменения в код**
2. **Пересоберите:**
   ```bash
   cd auto-europe-site
   bun run build
   ```
3. **Удалите старые файлы на сервере** (кроме .htaccess)
4. **Загрузите новые файлы из папки `out`**

---

## 📝 Скрипт для автоматизации (опционально)

Создайте `deploy-static.sh`:

```bash
#!/bin/bash

echo "🏗️  Сборка статического сайта..."
bun run build

echo "📦 Создание архива..."
cd out
zip -r ../static-site.zip .
cd ..

echo "✅ Готово! Файл static-site.zip готов к загрузке"
echo "📤 Загрузите и распакуйте на сервере в public_html"
```

Сделайте исполняемым:
```bash
chmod +x deploy-static.sh
```

Запуск:
```bash
./deploy-static.sh
```

---

## ⚙️ Автоматическая отправка на сервер (через SSH)

Если у вас есть SSH доступ к Таймвеб:

Создайте `auto-deploy.sh`:

```bash
#!/bin/bash

# Настройки
SERVER="your-username@your-domain.ru"
REMOTE_PATH="/home/your-username/public_html"

echo "🏗️  Сборка..."
bun run build

echo "📤 Отправка на сервер..."
rsync -avz --delete out/ $SERVER:$REMOTE_PATH/

echo "✅ Сайт обновлен!"
```

---

## 🆘 Решение проблем

### Стили не загружаются:

1. **Проверьте путь к _next:**
   - Должна быть папка `_next` в `public_html`
   - Проверьте права доступа (755)

2. **Очистите кеш браузера:** Ctrl + F5

3. **Проверьте .htaccess:**
   - Убедитесь, что файл загружен
   - Проверьте права (644)

### Страницы возвращают 404:

1. **Проверьте .htaccess**
2. **Убедитесь, что mod_rewrite включен** (обратитесь в поддержку Таймвеб)
3. **Проверьте структуру папок**

### Формы не работают:

- Это нормально для статического сайта
- Используйте альтернативы (FormSubmit, Tally.so)

---

## 💰 Стоимость

**Обычный хостинг Таймвеб:**
- От 150₽/месяц
- Подходит для статического сайта
- Дешевле чем Node.js хостинг

---

## ✅ Проверка

После загрузки:
1. Откройте **http://ваш-домен.ru**
2. Проверьте все страницы
3. Проверьте загрузку стилей (сайт должен выглядеть правильно)

---

## 📊 Сравнение: Статический vs Node.js

| Характеристика | Статический | Node.js |
|---------------|-------------|---------|
| Цена | ✅ Дешевле | ❌ Дороже |
| Скорость | ✅ Быстрее | ⚠️ Средняя |
| Формы | ❌ Не работают | ✅ Работают |
| Админка | ❌ Не работает | ✅ Работает |
| Telegram | ❌ Не работает | ✅ Работает |
| Обновление | ⚠️ Ручное | ✅ Автоматическое |

---

## 🎯 Рекомендация

**Для полноценного функционала** (формы, админка, Telegram):
→ Используйте **Вариант C: Node.js хостинг**

**Для простого сайта-визитки:**
→ Используйте **Вариант B: Статический экспорт**

---

## ✨ Готово!

Ваш статический сайт загружен на Таймвеб!
