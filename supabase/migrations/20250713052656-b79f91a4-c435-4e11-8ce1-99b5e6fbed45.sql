-- Добавляем поле для хранения API ключей пользователей
ALTER TABLE public.profiles 
ADD COLUMN api_keys JSONB DEFAULT '{}'::jsonb;

-- Создаем таблицу для настроек источников новостей
CREATE TABLE public.news_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  api_provider TEXT NOT NULL DEFAULT 'newsapi',
  api_key TEXT,
  preferred_sources TEXT[],
  preferred_categories TEXT[] DEFAULT ARRAY['technology', 'business', 'science'],
  language TEXT DEFAULT 'en',
  country TEXT DEFAULT 'us',
  auto_fetch BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, api_provider)
);

-- Включаем RLS
ALTER TABLE public.news_preferences ENABLE ROW LEVEL SECURITY;

-- Политики для настроек новостей
CREATE POLICY "Пользователи могут управлять своими настройками новостей" 
ON public.news_preferences 
FOR ALL 
USING (auth.uid() = user_id);