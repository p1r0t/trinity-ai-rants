-- Создаем таблицу комментариев
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Включаем RLS для таблицы комментариев
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Политики для комментариев
CREATE POLICY "Все могут просматривать комментарии" 
ON public.comments 
FOR SELECT 
USING (true);

CREATE POLICY "Пользователи могут создавать свои комментарии" 
ON public.comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут обновлять свои комментарии" 
ON public.comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут удалять свои комментарии" 
ON public.comments 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Админы могут управлять всеми комментариями" 
ON public.comments 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::app_role);

-- Создаем таблицу для отслеживания прочитанных статей
CREATE TABLE public.article_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(article_id, user_id)
);

-- Включаем RLS для просмотров
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

-- Политики для просмотров статей
CREATE POLICY "Пользователи могут просматривать свои просмотры" 
ON public.article_views 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут записывать свои просмотры" 
ON public.article_views 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Админы могут просматривать все просмотры" 
ON public.article_views 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin'::app_role);

-- Создаем таблицу достижений пользователей
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Включаем RLS для достижений
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Политики для достижений
CREATE POLICY "Пользователи могут просматривать свои достижения" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут получать достижения" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Админы могут управлять достижениями" 
ON public.user_achievements 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::app_role);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обновления updated_at в комментариях
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();