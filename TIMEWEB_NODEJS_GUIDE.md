# 🚀 Node.js хостинг на Таймвеб

## Вариант C: Node.js хостинг (Полный функционал)

### ✅ Что будет работать:

- ✅ Все страницы сайта
- ✅ Формы отправки в Telegram
- ✅ Админ-панель для управления автомобилями
- ✅ Авторизация
- ✅ API routes
- ✅ Полная функциональность

---

## 📋 Пошаговая инструкция

### Шаг 1: Заказ Node.js хостинга на Таймвеб

1. **Войдите в панель Таймвеб**
2. **Перейдите в раздел "Хостинг"**
3. **Выберите "Node.js хостинг"** (не обычный веб-хостинг!)

**Важно:** Обычный хостинг НЕ подойдет! Нужен именно Node.js.

**Стоимость:** от 290₽/мес

### Шаг 2: Настройка SSH доступа

1. В панели Таймвеб найдите раздел "SSH"
2. Создайте SSH ключ или используйте пароль
3. Запишите данные для подключения:
   - Хост: `ssh.timeweb.ru`
   - Порт: 22
   - Логин: ваш логин
   - Пароль: ваш пароль

### Шаг 3: Подключение по SSH

**Windows (через PuTTY):**
1. Скачайте PuTTY: https://www.putty.org/
2. Запустите PuTTY
3. Введите данные:
   - Host Name: `ssh.timeweb.ru`
   - Port: 22
4. Нажмите "Open"
5. Введите логин и пароль

**Mac/Linux (через терминал):**
```bash
ssh ваш_логин@ssh.timeweb.ru
```

### Шаг 4: Загрузка проекта на сервер

**Вариант 1: Через Git (Рекомендую)**

```bash
# Перейдите в директорию вашего сайта
cd ~/domains/ваш-домен.ru

# Клонируйте репозиторий
git clone https://github.com/gorbacenkovitalij6-prog/oreon-avto-site.git .

# Если папка не пустая, сначала очистите её
rm -rf *
git clone https://github.com/gorbacenkovitalij6-prog/oreon-avto-site.git .
```

**Вариант 2: Через FTP/SFTP**

1. Используйте FileZilla или WinSCP
2. Подключитесь по SFTP:
   - Протокол: SFTP
   - Хост: `ssh.timeweb.ru`
   - Порт: 22
   - Логин/пароль: ваши данные
3. Загрузите все файлы проекта

### Шаг 5: Установка зависимостей

```bash
# Перейдите в директорию проекта
cd ~/domains/ваш-домен.ru

# Установите Node.js зависимости
npm install

# Или используйте bun (быстрее)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
bun install
```

### Шаг 6: Настройка переменных окружения


```bash
nano .env.local
```


```env
# Supabase (для базы данных)
NEXT_PUBLIC_SUPABASE_URL=ваш_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_supabase_key

# Telegram Bot (для форм)
TELEGRAM_BOT_TOKEN=ваш_telegram_bot_token
TELEGRAM_CHAT_ID=ваш_telegram_chat_id
```


### Шаг 7: Сборка проекта

```bash
# Сборка production версии
npm run build

# Или с bun
bun run build
```

### Шаг 8: Запуск приложения

**Временный запуск (для теста):**
```bash
npm start
```

**Постоянный запуск (через PM2):**

```bash
# Установите PM2
npm install -g pm2

# Запустите приложение
pm2 start npm --name "oreon-site" -- start

# Сохраните конфигурацию
pm2 save

# Автозапуск при перезагрузке
pm2 startup
```

### Шаг 9: Настройка Nginx (прокси)


```nginx
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Шаг 10: SSL сертификат

```bash
# Установите certbot
sudo apt-get install certbot python3-certbot-nginx

# Получите SSL сертификат
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

---

## 🔄 Обновление сайта

### Через Git:

```bash
cd ~/domains/ваш-домен.ru
git pull origin main
npm install  # если добавились новые зависимости
npm run build
pm2 restart oreon-site
```

### Через FTP:

1. Загрузите обновленные файлы
2. Выполните через SSH:
```bash
npm install
npm run build
pm2 restart oreon-site
```

---

## 📊 Управление процессом (PM2)

```bash
# Просмотр логов
pm2 logs oreon-site

# Остановить приложение
pm2 stop oreon-site

# Перезапустить приложение
pm2 restart oreon-site

# Удалить из PM2
pm2 delete oreon-site

# Список всех процессов
pm2 list
```

---

## 🔧 Troubleshooting

### Проблема: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Проблема: "Port 3000 already in use"
```bash
pm2 delete all
npm start
```

### Проблема: "Permission denied"
```bash
chmod -R 755 ~/domains/ваш-домен.ru
```

### Проблема: Сайт не открывается
1. Проверьте, запущен ли процесс:
```bash
pm2 list
```

2. Проверьте логи:
```bash
pm2 logs
```

3. Перезапустите:
```bash
pm2 restart all
```

---

## 💰 Стоимость

- **Node.js хостинг Таймвеб:** от 290₽/мес
- **Домен (.ru):** от 199₽/год
- **SSL сертификат:** бесплатно (Let's Encrypt)

**Итого:** ~290-400₽/мес

**За что платите:**
- ✅ Полный функционал сайта
- ✅ Админ-панель
- ✅ Формы в Telegram
- ✅ Автоматическое обновление данных

---

## 🎯 Преимущества Node.js хостинга

1. **Полная функциональность** - все работает как задумано
2. **Админ-панель** - добавляйте автомобили через сайт
3. **Формы** - заявки автоматически отправляются в Telegram
4. **База данных** - через Supabase
5. **Безопасность** - серверная валидация данных
6. **Производительность** - Server-Side Rendering

---

## 🆚 Сравнение с Netlify

| Параметр | Таймвеб Node.js | Netlify |
|----------|----------------|---------|
| **Стоимость** | 290₽/мес | Бесплатно |
| **Домен .ru** | ✅ Да | ⚠️ Нужен отдельно |
| **Поддержка** | 🇷🇺 Русская | 🇺🇸 Английская |
| **Настройка** | ⚠️ Сложнее | ✅ Проще |
| **Скорость** | ⚡⚡ Быстро | ⚡⚡⚡ Очень быстро |

---

## 📝 Чек-лист настройки

- [ ] Заказан Node.js хостинг на Таймвеб
- [ ] Настроен SSH доступ
- [ ] Проект загружен на сервер
- [ ] Установлены зависимости (npm install)
- [ ] Создан файл .env.local с переменными
- [ ] Выполнена сборка (npm run build)
- [ ] Настроен PM2 для автозапуска
- [ ] Настроен Nginx прокси
- [ ] Установлен SSL сертификат
- [ ] Проверена работа сайта

---

## 🔗 Полезные ссылки

- [Документация Таймвеб Node.js](https://timeweb.com/ru/help/articles/nodejs-hosting)
- [PM2 документация](https://pm2.keymetrics.io/)
- [Next.js Production](https://nextjs.org/docs/deployment)

---

## 💡 Рекомендации

**Используйте Node.js хостинг если:**
- Нужна админ-панель
- Важны формы обратной связи
- Часто добавляете новые автомобили
- Хотите полный контроль

**Используйте Netlify если:**
- Бюджет ограничен
- Хотите простоту настройки
- Не нужен домен .ru
- Готовы использовать английскую поддержку

