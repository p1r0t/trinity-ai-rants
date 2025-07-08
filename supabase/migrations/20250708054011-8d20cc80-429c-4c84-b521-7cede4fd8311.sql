-- Create reactions table for user interactions
CREATE TABLE public.reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('smart', 'funny', 'trash')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(article_id, user_id, reaction_type)
);

-- Enable RLS on reactions
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- Policies for reactions
CREATE POLICY "Anyone can view reactions" 
ON public.reactions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own reactions" 
ON public.reactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" 
ON public.reactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add audio_url column to articles if not exists
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Add reaction counts as computed columns function
CREATE OR REPLACE FUNCTION get_article_reaction_counts(article_uuid UUID)
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'smart', COALESCE((SELECT COUNT(*) FROM public.reactions WHERE article_id = article_uuid AND reaction_type = 'smart'), 0),
      'funny', COALESCE((SELECT COUNT(*) FROM public.reactions WHERE article_id = article_uuid AND reaction_type = 'funny'), 0),
      'trash', COALESCE((SELECT COUNT(*) FROM public.reactions WHERE article_id = article_uuid AND reaction_type = 'trash'), 0)
    )
  );
END;
$$ LANGUAGE plpgsql;