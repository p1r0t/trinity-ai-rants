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
    console.log('Generating audio for article:', articleId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get article content
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('content, title, summary')
      .eq('id', articleId)
      .single();

    if (fetchError || !article) {
      throw new Error('Article not found');
    }

    // Use summary if available, otherwise use first 500 chars of content
    const textToSpeak = article.summary || article.content.substring(0, 500) + '...';
    const fullText = `${article.title}. ${textToSpeak}`;

    // Generate audio using ElevenLabs
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY'),
      },
      body: JSON.stringify({
        text: fullText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error('Failed to generate audio');
    }

    // Convert audio to base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
    const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;

    // Update article with audio URL
    const { error: updateError } = await supabase
      .from('articles')
      .update({ audio_url: audioDataUrl })
      .eq('id', articleId);

    if (updateError) {
      throw new Error('Failed to save audio URL');
    }

    console.log('Audio generated successfully');

    return new Response(JSON.stringify({ success: true, audioUrl: audioDataUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});