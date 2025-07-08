import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { originalTitle, articleId } = await req.json();
    console.log('Generating clickbait for:', originalTitle);

    // Generate clickbait title using OpenAI
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
            content: `Ты эксперт по созданию кликбейтных заголовков в стиле жёлтой прессы. 

Преврати обычный заголовок в максимально кликбейтный, используя:
- КАПС для важных слов
- Эмоциональные слова: ШОКИРУЮЩИЙ, НЕВЕРОЯТНЫЙ, СЕНСАЦИЯ
- Цифры и проценты
- Вопросы и восклицания
- Обещания раскрыть секреты
- "Этот трюк", "Вы не поверите"
- Драматизацию

Пример:
Обычный: "OpenAI выпустила новую модель GPT-4"
Кликбейт: "ШОКИРУЮЩИЙ прорыв OpenAI! Новый ИИ УМНЕЕ человека на 300%! Этот СЕКРЕТ изменит ВСЁ!"

Отвечай ТОЛЬКО заголовком на русском языке.`
          },
          {
            role: 'user',
            content: originalTitle
          }
        ],
        max_tokens: 150,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate clickbait title');
    }

    const data = await response.json();
    const clickbaitTitle = data.choices[0].message.content.trim();

    console.log('Clickbait generated successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      clickbaitTitle,
      originalTitle 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating clickbait:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});