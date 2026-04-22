# 📦 Инструкция по развертыванию на Таймвеб

## 🎯 Два варианта развертывания

### Вариант A: Статический экспорт (Обычный хостинг) ⚡
**Плюсы:** Дешевле, проще, быстрее
**Минусы:** API routes не работают (нет Telegram уведомлений)

### Вариант B: Node.js хостинг 🚀
**Плюсы:** Полный функционал, API routes работают
**Минусы:** Дороже, требует настройки

---

## 📘 ВАРИАНТ A: Статический экспорт

### Шаг 1: Скачайте архив
Файл уже создан: `oreon-static-site.zip`

### Шаг 2: Загрузка на Таймвеб

1. **Зайдите в панель Таймвеб**
   - Откройте https://timeweb.com/ru/
   - Войдите в личный кабинет

2. **Перейдите в Файловый менеджер**
   - Выберите ваш сайт
   - Откройте "Файловый менеджер"
   - Перейдите в папку `public_html` (или `www`)

3. **Очистите папку**
   - Удалите все файлы из `public_html`

4. **Загрузите архив**
   - Нажмите "Загрузить файлы"
   - Выберите `oreon-static-site.zip`
   - Дождитесь окончания загрузки

5. **Распакуйте архив**
   - Выберите `oreon-static-site.zip`
   - Нажмите "Извлечь"
   - Удалите архив после распаковки

6. **Переместите файлы**
   - Откройте папку `out`
   - Выделите **все файлы** внутри `out`
   - Переместите их в корень `public_html`
   - Удалите пустую папку `out`

### Шаг 3: Настройка .htaccess

Создайте файл `.htaccess` в `public_html` со следующим содержимым:

```apache
# Включить переписывание URL
RewriteEngine On

# Главная страница
RewriteRule ^$ /index.html [L]

# Перенаправление на HTML страницы
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^/]+)$ /$1.html [L]

# Сжатие
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Кеширование
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

### ⚠️ Ограничения статического экспорта:
- ❌ Формы обратной связи не отправляют в Telegram
- ❌ Админ-панель не работает (нет базы данных)
- ✅ Все страницы отображаются корректно
- ✅ Дизайн работает на 100%

---

## 🚀 ВАРИАНТ B: Node.js хостинг

### Требования
- ✅ Node.js хостинг на Таймвебе (платный тариф)
- ✅ SSH доступ

### Шаг 1: Заказ Node.js хостинга

1. Зайдите в панель Таймвеб
2. Выберите "Виртуальный хостинг" → "Node.js"
3. Закажите тариф (от 299₽/мес)

### Шаг 2: Подключение по SSH

```bash
ssh u1234567@u1234567.timeweb.ru
# Введите пароль из панели управления
```

### Шаг 3: Загрузка проекта

**Способ 1: Через Git (рекомендуется)**

```bash
# Перейти в директорию сайта
cd ~/
cd <ваш_домен>

# Клонировать репозиторий
git clone https://github.com/gorbacenkovitalij6-prog/oreon-avto-site.git .

# Установить зависимости
npm install --production
# или
bun install --production
```

**Способ 2: Через FTP**

1. Скачайте весь проект с GitHub
2. Загрузите через FileZilla в папку домена
3. Подключитесь по SSH и выполните:

```bash
cd ~/домен
npm install --production
```

### Шаг 4: Настройка переменных окружения

```bash
# Создать файл .env.local
nano .env.local
```

Вставьте:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=ваш_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_ключ

# Telegram
TELEGRAM_BOT_TOKEN=ваш_токен
TELEGRAM_CHAT_ID=ваш_chat_id
```

Сохраните: `Ctrl+X`, затем `Y`, затем `Enter`

### Шаг 5: Сборка проекта

```bash
# Собрать production версию
npm run build
# или
bun run build
```

### Шаг 6: Настройка PM2 (автозапуск)

```bash
# Установить PM2 глобально
npm install -g pm2

# Запустить приложение
pm2 start npm --name "oreon-site" -- start

# Сохранить автозапуск
pm2 save
pm2 startup
```

### Шаг 7: Настройка прокси (если нужно)

Создайте файл `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'oreon-site',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

Затем в панели Таймвеб:
1. Настройки → Прокси
2. Добавить правило: `/ → localhost:3000`

### Шаг 8: Проверка работы

```bash
# Проверить статус
pm2 status

# Посмотреть логи
pm2 logs oreon-site

# Перезапустить
pm2 restart oreon-site
```

---

## 🔄 Обновление сайта

### Для статического экспорта:
1. Пересоберите проект локально: `npm run build`
2. Создайте новый архив папки `out`
3. Загрузите и распакуйте на хостинге

### Для Node.js:
```bash
# По SSH
cd ~/домен
git pull origin main
npm install --production
npm run build
pm2 restart oreon-site
```

---

## 🆘 Проблемы и решения

### Статический экспорт: Стили не применяются
**Решение:** Проверьте, что файлы лежат в корне `public_html`, а не в подпапке

### Статический экспорт: 404 ошибки на страницах
**Решение:** Убедитесь, что `.htaccess` настроен правильно

### Node.js: Сайт не запускается
```bash
# Проверить логи
pm2 logs oreon-site

# Проверить порт
netstat -tlnp | grep 3000
```

### Node.js: Ошибка "Cannot find module"
```bash
# Переустановить зависимости
rm -rf node_modules
npm install --production
```

---

## 📊 Сравнение вариантов

| Функция | Статический | Node.js |
|---------|-------------|---------|
| Стоимость | ~100₽/мес | ~299₽/мес |
| Формы | ❌ | ✅ |
| Telegram уведомления | ❌ | ✅ |
| Админ-панель | ❌ | ✅ |
| База данных | ❌ | ✅ |
| Скорость загрузки | ⚡⚡⚡ | ⚡⚡ |
| Сложность настройки | Легко | Средне |

---

## 💡 Рекомендация

- **Для демо/портфолио** → Статический экспорт
- **Для реального бизнеса** → Node.js хостинг или Netlify

**Netlify (бесплатно)** уже настроен и работает на 100%!
