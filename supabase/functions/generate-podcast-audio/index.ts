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
    const { title, content, voice, sarcasticLevel } = await req.json();
    console.log('Generating podcast audio with voice:', voice, 'sarcasm level:', sarcasticLevel);

    // Generate enhanced script based on sarcasm level
    const scriptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `Ты Trinity AI, создаёшь подкаст-версию новостной статьи. 

Уровень сарказма: ${sarcasticLevel}/100
- 0-20: Сухой информационный стиль
- 21-40: Лёгкая ирония, осторожный скептицизм
- 41-60: Здоровый скептицизм, заметная ирония
- 61-80: Едкий сарказм, открытая критика хайпа
- 81-100: Взрывной цинизм, беспощадная ирония

Адаптируй текст под подкаст:
- Добавь вступление и заключение
- Используй разговорный стиль
- Добавь паузы и интонационные указания
- Включи комментарии Trinity в соответствии с уровнем сарказма
- Максимум 500 слов для оптимального аудио

Голос: ${voice} (учти характер персонажа)`
          },
          {
            role: 'user',
            content: `Заголовок: ${title}\n\nТекст: ${content}`
          }
        ],
        max_tokens: 800,
        temperature: 0.8,
      }),
    });

    if (!scriptResponse.ok) {
      throw new Error('Failed to generate script');
    }

    const scriptData = await scriptResponse.json();
    const podcastScript = scriptData.choices[0].message.content;

    // Generate audio using OpenAI TTS
    const audioResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        input: podcastScript,
        voice: voice,
        speed: sarcasticLevel > 70 ? 1.1 : sarcasticLevel < 30 ? 0.9 : 1.0,
      }),
    });

    if (!audioResponse.ok) {
      throw new Error('Failed to generate audio');
    }

    // Convert audio to base64
    const audioBuffer = await audioResponse.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    console.log('Podcast audio generated successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      audioUrl,
      script: podcastScript,
      voice,
      sarcasticLevel 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating podcast audio:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});