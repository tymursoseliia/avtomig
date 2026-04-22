#!/bin/bash

echo "🚀 Начало деплоя..."

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

# Сборка проекта
echo "🔨 Сборка проекта..."
npm run build

# Перезапуск PM2
echo "♻️ Перезапуск приложения..."
pm2 restart ecosystem.config.js --update-env
pm2 save

echo "✅ Деплой завершен!"
