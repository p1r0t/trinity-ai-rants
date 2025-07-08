-- Add more admin capabilities to manage all content

-- Update reactions policy to allow admins to delete any reaction
CREATE POLICY "Admins can delete any reaction" 
ON public.reactions 
FOR DELETE 
USING (public.get_user_role(auth.uid()) = 'admin');

-- Update daily_digests policies for admin control
DROP POLICY IF EXISTS "Anyone can manage digests" ON public.daily_digests;
DROP POLICY IF EXISTS "Public can view published digests" ON public.daily_digests;

CREATE POLICY "Admins can manage all digests" 
ON public.daily_digests 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can view published digests" 
ON public.daily_digests 
FOR SELECT 
USING (published = true OR public.get_user_role(auth.uid()) = 'admin');

-- Update news_sources policies for admin control
DROP POLICY IF EXISTS "Anyone can manage sources" ON public.news_sources;
DROP POLICY IF EXISTS "Public can view active sources" ON public.news_sources;

CREATE POLICY "Admins can manage all sources" 
ON public.news_sources 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can view active sources" 
ON public.news_sources 
FOR SELECT 
USING (is_active = true OR public.get_user_role(auth.uid()) = 'admin');

-- Update subscribers policies for admin control
DROP POLICY IF EXISTS "Anyone can manage subscribers" ON public.subscribers;

CREATE POLICY "Admins can manage all subscribers" 
ON public.subscribers 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'admin');

-- Update system_settings policies for admin control
DROP POLICY IF EXISTS "Anyone can manage settings" ON public.system_settings;

CREATE POLICY "Admins can manage all settings" 
ON public.system_settings 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'admin');

-- Add policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (public.get_user_role(auth.uid()) = 'admin');