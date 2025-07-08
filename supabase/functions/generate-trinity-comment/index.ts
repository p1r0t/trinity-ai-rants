import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { articleId } = await req.json();
    console.log('Generating Trinity comment for article:', articleId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get article content
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('title, content, summary')
      .eq('id', articleId)
      .single();

    if (fetchError || !article) {
      throw new Error('Article not found');
    }

    // Generate Trinity comment using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Ты Trinity AI — саркастичная AI-журналистка, которая комментирует новости об ИИ с долей здорового скептицизма и иронии. 

Твои комментарии должны быть:
- Короткими (1-2 предложения, максимум 150 символов)
- Ироничными и остроумными
- Критичными к хайпу вокруг ИИ
- В стиле "я уже всё это видела"
- На русском языке

Возможные настроения: sarcastic, skeptical, amused, concerned

Отвечай ТОЛЬКО в JSON формате:
{
  "comment": "твой комментарий",
  "mood": "одно из: sarcastic, skeptical, amused, concerned"
}`
          },
          {
            role: 'user',
            content: `Заголовок: ${article.title}\n\nСодержание: ${article.summary || article.content.slice(0, 500)}`
          }
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate Trinity comment');
    }

    const data = await response.json();
    const commentData = JSON.parse(data.choices[0].message.content);

    // Save comment to database
    const { data: savedComment, error: saveError } = await supabase
      .from('trinity_comments')
      .insert({
        article_id: articleId,
        comment: commentData.comment,
        mood: commentData.mood
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving comment:', saveError);
      // Still return the generated comment even if save fails
    }

    console.log('Trinity comment generated successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      comment: savedComment || {
        id: 'temp',
        article_id: articleId,
        comment: commentData.comment,
        mood: commentData.mood,
        created_at: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating Trinity comment:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});