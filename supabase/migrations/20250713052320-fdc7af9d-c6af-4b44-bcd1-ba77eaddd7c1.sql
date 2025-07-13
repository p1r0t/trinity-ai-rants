-- Добавляем недостающие колонки и таблицы для завершения функционала

-- Добавляем настройки уведомлений в профили
ALTER TABLE public.profiles 
ADD COLUMN notification_settings JSONB DEFAULT '{"newArticles": true, "reactions": false, "comments": true, "weekly": true}'::jsonb;

-- Создаем таблицу для push-подписок
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Включаем RLS для push-подписок
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Политики для push-подписок
CREATE POLICY "Пользователи могут управлять своими подписками" 
ON public.push_subscriptions 
FOR ALL 
USING (auth.uid() = user_id);