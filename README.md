# Trinity AI Rants 🚀

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-purple.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.50.3-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-38B2AC.svg)](https://tailwindcss.com/)

---

## 🇷🇺 Русский

### 📖 Описание

**Trinity AI Rants** — это современная платформа для новостей и подкастов с интеграцией искусственного интеллекта. Приложение предоставляет персонализированный опыт чтения новостей с возможностью генерации аудио, AI-рекомендаций и интерактивных функций.

### ✨ Основные возможности

#### 🎯 **Умная лента новостей**
- Персонализированные рекомендации на основе AI
- Фильтрация по категориям и тегам
- Поиск с автодополнением
- Pull-to-refresh для обновления контента

#### 🎧 **Аудио-функции**
- Автоматическая генерация аудио из текста статей
- Выбор голоса для озвучивания
- Аудиоплеер с контролами воспроизведения
- Подкасты с метаданными

#### 🤖 **AI-интеграции**
- Генерация TL;DR для статей
- AI-рекомендации контента
- Генерация кликбейт-заголовков
- Trinity AI комментарии и реакции

#### 🎮 **Геймификация**
- Система достижений и бейджей
- Лидерборд пользователей
- Прогресс чтения
- Система реакций и лайков

#### 📱 **Мобильные функции**
- Адаптивный дизайн
- Push-уведомления
- Telegram-интеграция
- Мобильное меню

#### 🔧 **Административные функции**
- Панель администратора
- Настройки News API
- Управление пользователями
- Статистика и аналитика

### 🛠 Технологический стек

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Radix UI, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **AI Services**: ElevenLabs (TTS), OpenAI API
- **State Management**: TanStack Query
- **Routing**: React Router DOM
- **Animations**: Framer Motion

### 🚀 Быстрый старт

```bash
# Клонирование репозитория
git clone https://github.com/your-username/trinity-ai-rants.git
cd trinity-ai-rants

# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env.local

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
```

### 📋 Переменные окружения

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_NEWS_API_KEY=your_news_api_key
```

### 📁 Структура проекта

```
src/
├── components/          # React компоненты
│   ├── ui/            # UI компоненты (shadcn/ui)
│   ├── AIRecommendations.tsx
│   ├── AudioPlayer.tsx
│   ├── CommentSystem.tsx
│   ├── Gamification.tsx
│   ├── Leaderboard.tsx
│   ├── NewsCard.tsx
│   ├── PushNotifications.tsx
│   ├── SmartFeed.tsx
│   └── ...
├── pages/              # Страницы приложения
├── hooks/              # Кастомные хуки
├── lib/                # Утилиты и конфигурация
└── integrations/       # Интеграции с внешними сервисами

supabase/
├── functions/          # Edge Functions
│   ├── generate-audio/
│   ├── generate-clickbait/
│   ├── generate-podcast-audio/
│   ├── generate-recommendations/
│   ├── generate-tldr/
│   └── generate-trinity-comment/
└── migrations/         # Миграции базы данных
```

### 🔧 Supabase Edge Functions

- **generate-audio**: Генерация аудио из текста статей
- **generate-clickbait**: Создание кликбейт-заголовков
- **generate-podcast-audio**: Озвучивание подкастов
- **generate-recommendations**: AI-рекомендации контента
- **generate-tldr**: Краткое изложение статей
- **generate-trinity-comment**: AI-комментарии Trinity

### 🎨 UI/UX Особенности

- **Темная/светлая тема** с автоматическим переключением
- **Адаптивный дизайн** для всех устройств
- **Анимации и переходы** с Framer Motion
- **Toast уведомления** для обратной связи
- **Модальные окна** и диалоги
- **Прогресс-бары** и индикаторы загрузки

### 📊 Функции аналитики

- Отслеживание времени чтения
- Статистика популярных статей
- Анализ пользовательского поведения
- Метрики вовлеченности

### 🔐 Безопасность

- Аутентификация через Supabase Auth
- Роли пользователей (admin, user)
- Защищенные API endpoints
- Валидация данных с Zod

---

## 🇺🇸 English

### 📖 Description

**Trinity AI Rants** is a modern news and podcast platform with artificial intelligence integration. The application provides a personalized news reading experience with audio generation capabilities, AI recommendations, and interactive features.

### ✨ Key Features

#### 🎯 **Smart News Feed**
- AI-powered personalized recommendations
- Category and tag filtering
- Search with autocomplete
- Pull-to-refresh content updates

#### 🎧 **Audio Features**
- Automatic audio generation from article text
- Voice selection for narration
- Audio player with playback controls
- Podcasts with metadata

#### 🤖 **AI Integrations**
- TL;DR generation for articles
- AI content recommendations
- Clickbait headline generation
- Trinity AI comments and reactions

#### 🎮 **Gamification**
- Achievement and badge system
- User leaderboard
- Reading progress tracking
- Reaction and like system

#### 📱 **Mobile Features**
- Responsive design
- Push notifications
- Telegram integration
- Mobile menu

#### 🔧 **Administrative Features**
- Admin panel
- News API settings
- User management
- Statistics and analytics

### 🛠 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Radix UI, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **AI Services**: ElevenLabs (TTS), OpenAI API
- **State Management**: TanStack Query
- **Routing**: React Router DOM
- **Animations**: Framer Motion

### 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/your-username/trinity-ai-rants.git
cd trinity-ai-rants

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev

# Build for production
npm run build
```

### 📋 Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_NEWS_API_KEY=your_news_api_key
```

### 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/            # UI components (shadcn/ui)
│   ├── AIRecommendations.tsx
│   ├── AudioPlayer.tsx
│   ├── CommentSystem.tsx
│   ├── Gamification.tsx
│   ├── Leaderboard.tsx
│   ├── NewsCard.tsx
│   ├── PushNotifications.tsx
│   ├── SmartFeed.tsx
│   └── ...
├── pages/              # Application pages
├── hooks/              # Custom hooks
├── lib/                # Utilities and configuration
└── integrations/       # External service integrations

supabase/
├── functions/          # Edge Functions
│   ├── generate-audio/
│   ├── generate-clickbait/
│   ├── generate-podcast-audio/
│   ├── generate-recommendations/
│   ├── generate-tldr/
│   └── generate-trinity-comment/
└── migrations/         # Database migrations
```

### 🔧 Supabase Edge Functions

- **generate-audio**: Generate audio from article text
- **generate-clickbait**: Create clickbait headlines
- **generate-podcast-audio**: Narrate podcasts
- **generate-recommendations**: AI content recommendations
- **generate-tldr**: Article summarization
- **generate-trinity-comment**: Trinity AI comments

### 🎨 UI/UX Features

- **Dark/light theme** with automatic switching
- **Responsive design** for all devices
- **Animations and transitions** with Framer Motion
- **Toast notifications** for user feedback
- **Modal windows** and dialogs
- **Progress bars** and loading indicators

### 📊 Analytics Features

- Reading time tracking
- Popular articles statistics
- User behavior analysis
- Engagement metrics

### 🔐 Security

- Supabase Auth authentication
- User roles (admin, user)
- Protected API endpoints
- Data validation with Zod

---

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [ElevenLabs](https://elevenlabs.io/) for text-to-speech capabilities
- [OpenAI](https://openai.com/) for AI features
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components

---

<div align="center">
  <p>Made with ❤️ by the Trinity AI Rants team</p>
  <p>
    <a href="https://github.com/your-username/trinity-ai-rants/issues">Report Bug</a>
    ·
    <a href="https://github.com/your-username/trinity-ai-rants/issues">Request Feature</a>
  </p>
</div>
