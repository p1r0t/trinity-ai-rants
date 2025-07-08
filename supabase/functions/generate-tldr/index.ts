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
    console.log('Generating TL;DR for article:', articleId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get article content
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('content, title')
      .eq('id', articleId)
      .single();

    if (fetchError || !article) {
      throw new Error('Article not found');
    }

    // Generate TL;DR using OpenAI
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
            content: 'Создай краткое резюме (TL;DR) статьи на русском языке. Используй максимум 2-3 предложения. Сохрани основную суть и главные моменты.'
          },
          {
            role: 'user',
            content: `Заголовок: ${article.title}\n\nСодержание: ${article.content}`
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate TL;DR');
    }

    const data = await response.json();
    const tldr = data.choices[0].message.content;

    // Update article with generated summary
    const { error: updateError } = await supabase
      .from('articles')
      .update({ summary: tldr })
      .eq('id', articleId);

    if (updateError) {
      throw new Error('Failed to save TL;DR');
    }

    console.log('TL;DR generated successfully');

    return new Response(JSON.stringify({ success: true, tldr }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating TL;DR:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});