-- Create table for Trinity AI comments
CREATE TABLE public.trinity_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  mood TEXT NOT NULL CHECK (mood IN ('sarcastic', 'skeptical', 'amused', 'concerned')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trinity_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view Trinity comments" 
ON public.trinity_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage Trinity comments" 
ON public.trinity_comments 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::app_role);