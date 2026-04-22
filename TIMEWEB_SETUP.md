# Настройка автоматического деплоя на Таймвеб

## Шаг 1: Подключение к Node.js хостингу

1. В панели Таймвеб выбери **Node.js хостинг**
2. Создай новое приложение
3. Подключи GitHub репозиторий: `https://github.com/gorbacenkovitalij6-prog/oreon-avto-site`
4. Выбери ветку: `main`

## Шаг 2: Настройки приложения

### Настройки сборки:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18` или выше
- **Port**: `3000`

### Переменные окружения:
```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=твой_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=твой_supabase_key
TELEGRAM_BOT_TOKEN=твой_telegram_token
TELEGRAM_CHAT_ID=твой_chat_id
```

## Шаг 3: Автоматический деплой


### Ручной деплой (если нужно):
1. Зайди в SSH
2. Перейди в папку проекта: `cd ~/oreon-avto-site`
3. Обнови код: `git pull`
4. Запусти скрипт: `./.deploy.sh`

## PM2 команды:
- `pm2 status` - статус приложения
- `pm2 logs` - логи
- `pm2 restart all` - перезапуск
- `pm2 stop all` - остановка

## Готово! 🎉
