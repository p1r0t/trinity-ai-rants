# Trinity AI News - Mobile App

Trinity AI News теперь доступен как мобильное приложение с полным функционалом!

## 🚀 Что нового:

### ✅ **Исправлены лайки и реакции:**
- Полноценная система реакций (умно/смешно/мусор)
- Реальное сохранение в базу данных
- Работает только для авторизованных пользователей

### 📱 **Функция "Поделиться":**
- Нативное sharing на мобильных устройствах
- Поддержка Telegram, WhatsApp, VK, Twitter
- Копирование ссылки в буфер обмена

### 🎵 **Улучшенный аудио плеер:**
- **Контроль скорости:** 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
- **Перемотка:** кнопки ±10 сек + перетаскивание ползунка
- **Скачивание аудио** одним кликом
- Мобильно-оптимизированный интерфейс

### 📱 **Мобильное приложение:**
- Создано с Capacitor для iOS и Android
- Оптимизированный UI для мобильных устройств
- Safe area support для современных смартфонов
- Улучшенные touch targets и навигация

## 📲 Установка мобильного приложения:

1. **Экспортируйте проект в Github** через кнопку "Export to Github"
2. Склонируйте проект: `git pull`
3. Установите зависимости: `npm install`
4. Добавьте платформы:
   - iOS: `npx cap add ios`
   - Android: `npx cap add android`
5. Обновите платформы: `npx cap update ios` или `npx cap update android`
6. Соберите проект: `npm run build`
7. Синхронизируйте: `npx cap sync`
8. Запустите:
   - Android: `npx cap run android`
   - iOS: `npx cap run ios` (требует Mac с Xcode)

## 🎯 Основные возможности:

- **Скрытая админ-панель** (3 клика по логотипу для админов)
- **AI-генерация** TL;DR и аудио
- **Полная система аутентификации**
- **Реакции и комментарии**
- **Мобильное меню** с плавными анимациями
- **Hot-reload** в development режиме

## 🔧 Для разработчиков:

- appId: `app.lovable.dfdaa4dd8d0c4bff99dad45c0600c1ae`
- appName: `trinity-ai-rants`
- Hot-reload URL настроен автоматически

Приложение готово к публикации в App Store и Google Play!

---

## Project info (Lovable)

**URL**: https://lovable.dev/projects/dfdaa4dd-8d0c-4bff-99da-d45c0600c1ae

## Technologies

This project is built with:
- Vite + TypeScript + React
- shadcn-ui + Tailwind CSS
- Supabase (Database + Auth)
- Capacitor (Mobile App)

## Development

```sh
npm install
npm run dev
```

For mobile development:
```sh
npx cap sync
npx cap run android  # or ios
```