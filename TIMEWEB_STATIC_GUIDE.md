# 📦 Статический экспорт для Таймвеб

## Вариант B: Статический сайт (Обычный хостинг)

### ⚠️ Важно понимать ограничения:

**Что НЕ будет работать:**
- ❌ Формы отправки в Telegram (нет серверной части)
- ❌ Админ-панель (требует backend)
- ❌ Авторизация
- ❌ Добавление новых автомобилей через сайт
- ❌ API routes

**Что БУДЕТ работать:**
- ✅ Отображение всех страниц
- ✅ Навигация по сайту
- ✅ Дизайн и верстка
- ✅ Статическое содержимое
- ✅ Ссылки на Telegram
- ✅ Телефонные номера

---

## 📋 Пошаговая инструкция

### Шаг 1: Подготовка статического экспорта


### Шаг 2: Настройка проекта для статического экспорта


**Файл: `next.config.js`**


### Шаг 3: Сборка статической версии


\`\`\`bash
npm run build
\`\`\`


### Шаг 4: Загрузка на Таймвеб

**Через FileZilla (FTP):**

1. Скачайте FileZilla: https://filezilla.ru/
2. Подключитесь к вашему хостингу:
   - Хост: `ftp.timeweb.ru`
   - Логин: (ваш логин)
   - Пароль: (ваш пароль)
   - Порт: 21

3. Загрузите содержимое папки `out` в корневую директорию сайта:
   - `/public_html/` или 
   - `/domains/ваш-домен.ru/public_html/`

**Через панель Таймвеб:**

1. Войдите в панель управления
2. Перейдите в "Файловый менеджер"
3. Загрузите все файлы из папки `out`

### Шаг 5: Настройка .htaccess


\`\`\`apache
# Включение ЧПУ
RewriteEngine On

# Перенаправление на HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Обработка расширений .html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^([^\.]+)$ $1.html [NC,L]

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

# Gzip сжатие
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
\`\`\`

---

## 🔄 Обновление сайта


1. Внесите изменения в код
2. Выполните: `npm run build`
3. Загрузите обновленные файлы из папки `out` на хостинг

---

## 💡 Решение для работы форм


### Вариант 1: Formspree (Рекомендую)


1. Зарегистрируйтесь на https://formspree.io
2. Получите endpoint URL
3. Замените action формы на URL от Formspree

### Вариант 2: Google Forms

1. Создайте форму в Google Forms
2. Встройте её на сайт через iframe

### Вариант 3: Tally.so


1. Создайте форму на https://tally.so
2. Встройте на сайт

---

## 💰 Стоимость

- **Обычный хостинг Таймвеб:** от 90₽/мес
- **Домен (.ru):** от 199₽/год
- **SSL сертификат:** бесплатно (Let's Encrypt)

**Итого:** ~90-150₽/мес

**Экономия:** 200₽/мес по сравнению с Node.js хостингом

---

## 📊 Сравнение вариантов

| Функция | Статический | Node.js |
|---------|------------|---------|
| **Стоимость** | 90₽/мес | 290₽/мес |
| **Скорость** | ⚡⚡⚡ Очень быстро | ⚡⚡ Быстро |
| **Формы в Telegram** | ❌ | ✅ |
| **Админ-панель** | ❌ | ✅ |
| **Простота** | ✅ Проще | ⚠️ Сложнее |
| **Обновление контента** | Вручную | Через админку |

---

## 🎯 Рекомендация

**Выбирайте статический экспорт если:**
- Бюджет ограничен
- Контент редко меняется
- Готовы обновлять вручную
- Формы не критичны (можно использовать Telegram напрямую)

**Выбирайте Node.js хостинг если:**
- Нужна админ-панель
- Часто добавляете автомобили
- Важны формы обратной связи
- Хотите полную автоматизацию

---

## 🔗 Полезные ссылки

- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Formspree](https://formspree.io)
- [Tally Forms](https://tally.so)
- [FileZilla](https://filezilla.ru/)

