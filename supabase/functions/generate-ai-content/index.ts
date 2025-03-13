import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    // In a real implementation, you would use a proper AI API
    // For this demo, we'll use a function to generate content based on description
    
    let response;
    if (contentType === 'caption') {
      response = generateCaption(videoDescription, platforms);
    } else if (contentType === 'hashtags') {
      response = generateHashtags(videoDescription, platforms);
    } else {
      response = {
        error: 'Invalid content type. Use "caption" or "hashtags"'
      };
    }

    return new Response(
      JSON.stringify(response),
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

// Function to generate captions based on description
function generateCaption(description: string, platforms: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  
  // Platform-specific caption generation logic
  platforms.forEach(platform => {
    let caption = `${description}\n\n`;
    
    switch (platform) {
      case 'instagram':
        caption += "Check out our latest content! Don't forget to like and share! ✨📱 #instaworthy";
        break;
      case 'tiktok':
        caption += "New upload! RT if you agree! 🔥 #tiktokviral";
        break;
      case 'youtube':
        caption += "Thanks for watching! Subscribe for more content and hit the notification bell! 🔔";
        break;
      case 'facebook':
        caption += "What do you think about this? Share your thoughts in the comments below! 💭";
        break;
      case 'linkedin':
        caption += "Excited to share this with my professional network. What are your thoughts on this topic? #professionaldev";
        break;
      default:
        caption += "Thanks for watching!";
    }
    
    result[platform] = caption;
  });
  
  return result;
}

// Function to generate hashtags based on description
function generateHashtags(description: string, platforms: string[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  
  // List of common hashtags
  const commonHashtags = ['content', 'digital', 'social', 'trending', 'viral'];
  
  // Add hashtags based on words in the description
  const descriptionWords = description.toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(' ')
    .filter(word => word.length > 3)
    .slice(0, 3);
  
  const baseHashtags = [
    ...commonHashtags,
    ...descriptionWords
  ];
  
  // Platform-specific hashtag generation logic
  platforms.forEach(platform => {
    let hashtags = [...baseHashtags];
    
    switch (platform) {
      case 'instagram':
        hashtags = [...hashtags, 'instagram', 'insta', 'igdaily', 'instagood', 'instadaily'];
        break;
      case 'tiktok':
        hashtags = [...hashtags, 'tiktok', 'tiktokviral', 'fyp', 'foryoupage', 'tiktokalgorithm'];
        break;
      case 'youtube':
        hashtags = [...hashtags, 'youtube', 'youtubeshorts', 'youtuber', 'subscribe', 'video'];
        break;
      case 'facebook':
        hashtags = [...hashtags, 'facebook', 'facebooklive', 'share', 'community', 'connect'];
        break;
      case 'linkedin':
        hashtags = [...hashtags, 'linkedin', 'career', 'professional', 'business', 'networking'];
        break;
    }
    
    // Format hashtags and select random subset to keep the list reasonable
    result[platform] = hashtags
      .sort(() => 0.5 - Math.random())
      .slice(0, 10)
      .map(tag => `#${tag}`);
  });
  
  return result;
}
