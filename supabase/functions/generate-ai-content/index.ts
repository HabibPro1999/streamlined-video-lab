
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoDescription, platforms, contentType } = await req.json();
    
    if (!videoDescription) {
      return new Response(
        JSON.stringify({ error: 'Video description is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Use OpenAI to generate content
    let generatedContent;
    
    if (contentType === 'caption') {
      generatedContent = await generateCaptionsWithAI(videoDescription, platforms);
    } else if (contentType === 'hashtags') {
      generatedContent = await generateHashtagsWithAI(videoDescription, platforms);
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid content type. Use "caption" or "hashtags"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(generatedContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-ai-content function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Function to generate captions using OpenAI
async function generateCaptionsWithAI(description: string, platforms: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  
  for (const platform of platforms) {
    const prompt = `
You are an expert social media content writer. Generate an engaging caption for a ${platform} post about:
"${description}"

The caption should:
- Be in the appropriate style for ${platform}
- Be concise and engaging
- Not include hashtags (those will be added separately)
- Not include any prefacing text like "Caption:" or "Here's your caption:"
- Just provide the caption text directly

For reference:
- Instagram captions should be visually descriptive and emotional
- TikTok captions should be short, catchy, and trendy
- YouTube captions should be descriptive and include a call to action
- Facebook captions should be conversational and encourage engagement
- LinkedIn captions should be professional but personable`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert social media content creator.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }
    
    result[platform] = data.choices[0].message.content.trim();
  }
  
  return result;
}

// Function to generate hashtags using OpenAI
async function generateHashtagsWithAI(description: string, platforms: string[]): Promise<Record<string, string[]>> {
  const result: Record<string, string[]> = {};
  
  for (const platform of platforms) {
    const prompt = `
Generate a list of 10 relevant and effective hashtags for a ${platform} post about:
"${description}"

The hashtags should:
- Be appropriate for ${platform}'s algorithm and audience
- Include a mix of popular and niche hashtags for better reach
- Each start with # symbol
- Be separated by commas
- Not include any additional text or explanations
- Just provide the hashtags in a comma-separated list

For reference:
- Instagram hashtags should be a mix of popular and niche tags, around 5-10 tags
- TikTok hashtags should include trending tags and challenges, around 3-5 tags
- YouTube hashtags should be concise and directly relevant, around 3-5 tags
- Facebook hashtags should be fewer and more general, around 2-3 tags
- LinkedIn hashtags should be professional and industry-relevant, around 3-5 tags`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert on social media hashtag optimization.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }
    
    // Parse the response to extract hashtags
    const hashtagText = data.choices[0].message.content.trim();
    const hashtags = hashtagText.split(/,\s*/).map(tag => tag.trim()).filter(tag => tag.startsWith('#'));
    
    result[platform] = hashtags;
  }
  
  return result;
}
