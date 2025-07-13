import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, articles, userReactions } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Анализируем предпочтения пользователя на основе реакций
    const smartArticles = userReactions
      .filter((r: any) => r.reaction_type === 'smart')
      .map((r: any) => r.article_id);
    
    const funnyArticles = userReactions
      .filter((r: any) => r.reaction_type === 'funny')
      .map((r: any) => r.article_id);

    // Получаем теги предпочитаемых статей
    const { data: preferredArticles } = await supabase
      .from('articles')
      .select('tags')
      .in('id', [...smartArticles, ...funnyArticles]);

    const preferredTags = new Set<string>();
    preferredArticles?.forEach(article => {
      article.tags?.forEach((tag: string) => preferredTags.add(tag));
    });

    // Находим статьи с похожими тегами
    const { data: recommendedArticles } = await supabase
      .from('articles')
      .select('*')
      .eq('processed', true)
      .not('id', 'in', `(${[...smartArticles, ...funnyArticles].join(',')})`)
      .order('published_at', { ascending: false })
      .limit(10);

    // Ранжируем по релевантности
    const scored = recommendedArticles?.map(article => {
      let score = 0;
      article.tags?.forEach((tag: string) => {
        if (preferredTags.has(tag)) score += 1;
      });
      
      // Бонус за новизну
      const daysSincePublished = (Date.now() - new Date(article.published_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSincePublished < 7) score += 2;
      if (daysSincePublished < 3) score += 1;
      
      return { ...article, score };
    }).sort((a, b) => b.score - a.score) || [];

    // Возвращаем топ-5 рекомендаций
    const recommendations = scored.slice(0, 5);

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});