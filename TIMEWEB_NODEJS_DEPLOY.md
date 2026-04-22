# 🚀 Инструкция: Развертывание на Node.js хостинге Таймвеб

## ✅ Вариант C: Node.js хостинг (Полный функционал)

### Преимущества:
- ✅ Все функции работают (формы, админка, Telegram)
- ✅ Автоматическое обновление из GitHub
- ✅ Серверный рендеринг
- ✅ API Routes работают

### Что нужно:
- 🔧 Node.js хостинг на Таймвеб (~500₽/мес)
- 🔑 SSH доступ
- 📦 Git установлен

---

## Шаг 1: Заказ Node.js хостинга на Таймвеб

### 1.1. Выбор тарифа:

1. Зайдите в **панель Таймвеб**
2. Перейдите в **"Виртуальный хостинг"** → **"Заказать услугу"**
3. Выберите тариф с поддержкой **Node.js**:
   - **Минимум:** Start (от 500₽/мес)
   - **Рекомендую:** Business (от 800₽/мес)

### 1.2. Что должно быть включено:

- ✅ Node.js 18+ или 20+
- ✅ SSH доступ
- ✅ Git
- ✅ PM2 или другой process manager
- ✅ Минимум 1GB RAM

---

## Шаг 2: Подключение по SSH

### 2.1. Получите данные для подключения:

В панели Таймвеб найдите:
- **IP адрес сервера**
- **SSH логин** (обычно совпадает с логином хостинга)
- **SSH пароль** (можно установить в настройках)
- **Порт SSH** (обычно 22)

### 2.2. Подключитесь через терминал:

**Windows (PowerShell):**
```powershell
ssh username@your-server-ip
```

**Mac/Linux:**
```bash
ssh username@your-server-ip
```

**Или используйте PuTTY** (Windows):
1. Скачайте: https://www.putty.org/
2. Введите IP и порт
3. Нажмите "Open"
4. Введите логин и пароль

---

## Шаг 3: Установка зависимостей на сервере

После подключения по SSH выполните:

```bash
# Проверьте версию Node.js (должна быть 18+)
node --version

# Если Node.js нет или старая версия, установите через nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Установите глобально PM2 (для запуска приложения)
npm install -g pm2

# Установите Git (если еще не установлен)
git --version
```

---

## Шаг 4: Клонирование проекта с GitHub

```bash
# Перейдите в домашнюю директорию
cd ~

# Клонируйте репозиторий
git clone https://github.com/gorbacenkovitalij6-prog/oreon-avto-site.git

# Перейдите в папку проекта
cd oreon-avto-site
```

---

## Шаг 5: Настройка переменных окружения

### 5.1. Создайте файл .env.local:

```bash
nano .env.local
```

### 5.2. Вставьте ваши переменные окружения:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Supabase Service Role (для админки)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Next.js
NODE_ENV=production
PORT=3000
```

**Сохраните:** `Ctrl+O`, `Enter`, `Ctrl+X`

---

## Шаг 6: Установка зависимостей и сборка

```bash
# Установите Bun (рекомендуется) или используйте npm
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Или используйте npm:
# npm install

# Установите зависимости
bun install

# Соберите проект для production
bun run build
```

---

## Шаг 7: Запуск приложения с PM2

### 7.1. Создайте ecosystem файл для PM2:

```bash
nano ecosystem.config.js
```

### 7.2. Вставьте конфигурацию:

```javascript
module.exports = {
  apps: [{
    name: 'oreon-auto-site',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/home/your-username/oreon-avto-site',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

**Сохраните:** `Ctrl+O`, `Enter`, `Ctrl+X`

### 7.3. Запустите приложение:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7.4. Проверьте статус:

```bash
pm2 status
pm2 logs oreon-auto-site
```

---

## Шаг 8: Настройка Nginx (прокси)

### 8.1. Найдите конфигурацию Nginx:

```bash
# Обычно находится здесь:
sudo nano /etc/nginx/sites-available/your-domain.conf
```

### 8.2. Добавьте конфигурацию:

```nginx
server {
    listen 80;
    server_name your-domain.ru www.your-domain.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Статические файлы Next.js
    location /_next/static {
        alias /home/your-username/oreon-avto-site/.next/static;
        expires 365d;
        access_log off;
    }

    location /static {
        alias /home/your-username/oreon-avto-site/public;
        expires 365d;
        access_log off;
    }
}
```

### 8.3. Проверьте конфигурацию и перезапустите Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Шаг 9: Настройка SSL (HTTPS)

### 9.1. Установите Certbot:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### 9.2. Получите SSL сертификат:

```bash
sudo certbot --nginx -d your-domain.ru -d www.your-domain.ru
```

Следуйте инструкциям на экране.

### 9.3. Автоматическое обновление:

```bash
sudo certbot renew --dry-run
```

---

## Шаг 10: Автоматическое обновление с GitHub

### 10.1. Создайте скрипт обновления:

```bash
nano ~/update-site.sh
```

### 10.2. Вставьте скрипт:

```bash
#!/bin/bash

echo "🔄 Обновление сайта..."

cd ~/oreon-avto-site

# Получить последние изменения
git pull origin main

# Установить зависимости (если изменились)
bun install

# Пересобрать проект
bun run build

# Перезапустить PM2
pm2 restart oreon-auto-site

echo "✅ Сайт обновлен!"
```

### 10.3. Сделайте скрипт исполняемым:

```bash
chmod +x ~/update-site.sh
```

### 10.4. Запуск обновления:

```bash
~/update-site.sh
```

---

## Шаг 11: Настройка автоматического обновления (Webhook)

### 11.1. Установите webhook сервис:

```bash
npm install -g webhook
```

### 11.2. Создайте конфигурацию webhook:

```bash
mkdir -p ~/webhooks
nano ~/webhooks/hooks.json
```

```json
[
  {
    "id": "update-site",
    "execute-command": "/home/your-username/update-site.sh",
    "command-working-directory": "/home/your-username",
    "response-message": "Site updated successfully"
  }
]
```

### 11.3. Запустите webhook сервер:

```bash
pm2 start webhook --name webhook-server -- -hooks ~/webhooks/hooks.json -verbose -port 9000
pm2 save
```

### 11.4. Настройте webhook в GitHub:

1. Зайдите в **Settings** → **Webhooks** репозитория
2. Добавьте webhook:
   - **Payload URL:** `http://your-domain.ru:9000/hooks/update-site`
   - **Content type:** `application/json`
   - **Events:** `Just the push event`

Теперь при каждом push в GitHub сайт будет автоматически обновляться!

---

## 🔧 Полезные команды PM2

```bash
# Посмотреть статус всех приложений
pm2 status

# Посмотреть логи
pm2 logs oreon-auto-site

# Перезапустить приложение
pm2 restart oreon-auto-site

# Остановить приложение
pm2 stop oreon-auto-site

# Удалить приложение из PM2
pm2 delete oreon-auto-site

# Мониторинг в реальном времени
pm2 monit
```

---

## 🆘 Решение проблем

### Проблема: Сайт не запускается

```bash
# Проверьте логи
pm2 logs oreon-auto-site --lines 100

# Проверьте порт
netstat -tulpn | grep 3000

# Убедитесь, что .env.local существует
cat .env.local
```

### Проблема: 502 Bad Gateway

1. **Проверьте, запущено ли приложение:**
   ```bash
   pm2 status
   ```

2. **Проверьте Nginx:**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t
   ```

3. **Проверьте firewall:**
   ```bash
   sudo ufw allow 3000
   sudo ufw allow 'Nginx Full'
   ```

### Проблема: Формы не отправляются в Telegram

1. **Проверьте переменные окружения:**
   ```bash
   cat .env.local
   ```

2. **Проверьте API route:**
   ```bash
   curl -X POST http://localhost:3000/api/telegram \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","phone":"123","type":"test"}'
   ```

### Проблема: Недостаточно памяти

```bash
# Увеличьте лимит памяти для PM2
pm2 delete oreon-auto-site
pm2 start ecosystem.config.js --max-memory-restart 2G
```

---

## 📊 Мониторинг

### Установите PM2 Plus (опционально):

1. Зарегистрируйтесь на https://pm2.io
2. Подключите сервер:
   ```bash
   pm2 link <secret_key> <public_key>
   ```

---

## 🔄 Резервное копирование

### Создайте скрипт бэкапа:

```bash
nano ~/backup-site.sh
```

```bash
#!/bin/bash

BACKUP_DIR=~/backups
DATE=$(date +%Y-%m-%d_%H-%M-%S)

mkdir -p $BACKUP_DIR

# Создать архив
tar -czf $BACKUP_DIR/oreon-site-$DATE.tar.gz \
  ~/oreon-avto-site \
  --exclude=node_modules \
  --exclude=.next

echo "✅ Backup created: oreon-site-$DATE.tar.gz"

# Удалить бэкапы старше 30 дней
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

```bash
chmod +x ~/backup-site.sh
```

### Автоматический бэкап (cron):

```bash
crontab -e
```

Добавьте строку (бэкап каждый день в 3:00):
```
0 3 * * * ~/backup-site.sh
```

---

## 💰 Стоимость

**Node.js хостинг Таймвеб:**
- **Start:** ~500₽/мес (1 сайт, 1GB RAM)
- **Business:** ~800₽/мес (5 сайтов, 2GB RAM)
- **Premium:** ~1500₽/мес (10 сайтов, 4GB RAM)

**Альтернативы:**
- **VPS** (~300₽/мес) - требует больше знаний
- **Vercel/Netlify** (бесплатно) - но без SSH доступа

---

## ✅ Проверка

После выполнения всех шагов:

1. ✅ Откройте **https://your-domain.ru**
2. ✅ Проверьте все страницы
3. ✅ Отправьте тестовую форму
4. ✅ Проверьте админ-панель
5. ✅ Убедитесь, что сообщение пришло в Telegram

---

## 📚 Дополнительные материалы

- [Документация PM2](https://pm2.keymetrics.io/)
- [Документация Next.js Deploy](https://nextjs.org/docs/deployment)
- [Nginx configuration](https://nginx.org/ru/docs/)

---

## 🎯 Рекомендация

**Если нужен полный функционал:**
→ ✅ **Используйте этот вариант (Node.js хостинг)**

**Если бюджет ограничен:**
→ Используйте **Vercel/Netlify** (бесплатно)

**Если нужна только визитка:**
→ Используйте **Вариант B (статический экспорт)**

---

## ✨ Готово!

Ваш сайт успешно развернут на Node.js хостинге Таймвеб с полным функционалом!

Теперь у вас работает:
- ✅ Формы с отправкой в Telegram
- ✅ Админ-панель
- ✅ Автоматическое обновление из GitHub
- ✅ SSL сертификат (HTTPS)
- ✅ Быстрая загрузка
