
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Json } from '@/integrations/supabase/types';

// Function to upload video to Supabase storage
export const uploadVideo = async (file: File, userId: string) => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, file);
      
    if (error) throw error;
    
    // Get the public URL of the file
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
      
    return { filePath, publicUrl };
  } catch (error: any) {
    console.error('Error uploading video:', error.message);
    toast({
      variant: 'destructive',
      title: 'Upload failed',
      description: error.message || 'There was an error uploading your video.',
    });
    throw error;
  }
};

// Function to create a post in the database
export const createPost = async (postData: {
  userId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  aiGeneratedCaption?: string;
  aiGeneratedHashtags?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: postData.userId,
        title: postData.title,
        description: postData.description,
        video_url: postData.videoUrl,
        thumbnail_url: postData.thumbnailUrl,
        ai_generated_caption: postData.aiGeneratedCaption,
        ai_generated_hashtags: postData.aiGeneratedHashtags
      })
      .select();
      
    if (error) throw error;
    
    return data[0];
  } catch (error: any) {
    console.error('Error creating post:', error.message);
    toast({
      variant: 'destructive',
      title: 'Post creation failed',
      description: error.message || 'There was an error creating your post.',
    });
    throw error;
  }
};

// Function to schedule a post
export const schedulePost = async (scheduleData: {
  postId: string;
  socialAccountId: string;
  scheduledTime: Date;
  platformSpecificCaption?: string;
  platformSpecificHashtags?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('post_schedules')
      .insert({
        post_id: scheduleData.postId,
        social_account_id: scheduleData.socialAccountId,
        scheduled_time: scheduleData.scheduledTime.toISOString(),
        platform_specific_caption: scheduleData.platformSpecificCaption,
        platform_specific_hashtags: scheduleData.platformSpecificHashtags
      })
      .select();
      
    if (error) throw error;
    
    return data[0];
  } catch (error: any) {
    console.error('Error scheduling post:', error.message);
    toast({
      variant: 'destructive',
      title: 'Schedule failed',
      description: error.message || 'There was an error scheduling your post.',
    });
    throw error;
  }
};

// Function to get user's social media accounts
export const getUserSocialAccounts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error fetching social accounts:', error.message);
    throw error;
  }
};

// Function to add a social media account
export const addSocialAccount = async (accountData: {
  userId: string;
  platform: 'instagram' | 'youtube' | 'facebook' | 'linkedin' | 'tiktok';
  accountName: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  platformUserId?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('social_accounts')
      .insert({
        user_id: accountData.userId,
        platform: accountData.platform,
        account_name: accountData.accountName,
        access_token: accountData.accessToken,
        refresh_token: accountData.refreshToken,
        token_expires_at: accountData.tokenExpiresAt ? accountData.tokenExpiresAt.toISOString() : null,
        platform_user_id: accountData.platformUserId
      })
      .select();
      
    if (error) throw error;
    
    return data[0];
  } catch (error: any) {
    console.error('Error adding social account:', error.message);
    toast({
      variant: 'destructive',
      title: 'Adding account failed',
      description: error.message || 'There was an error adding your social media account.',
    });
    throw error;
  }
};

// Function to generate AI content using the edge function
export const generateAIContent = async (
  videoDescription: string,
  platforms: string[],
  contentType: 'caption' | 'hashtags'
) => {
  try {
    const response = await supabase.functions.invoke('generate-ai-content', {
      body: { videoDescription, platforms, contentType },
    });
    
    if (response.error) throw new Error(response.error.message);
    
    return response.data;
  } catch (error: any) {
    console.error('Error generating AI content:', error.message);
    toast({
      variant: 'destructive',
      title: 'AI generation failed',
      description: error.message || 'There was an error generating AI content.',
    });
    throw error;
  }
};

// Function to delete a video from storage after it's been processed
export const deleteVideoFromStorage = async (filePath: string) => {
  try {
    const { error } = await supabase.storage
      .from('videos')
      .remove([filePath]);
      
    if (error) throw error;
    
    console.log('Video deleted from storage successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting video from storage:', error.message);
    // Don't throw here, just log the error - we don't want to interrupt the user flow
    return false;
  }
};

// Function to get user's posts
export const getUserPosts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error fetching posts:', error.message);
    throw error;
  }
};

// Function to get post schedules for a post
export const getPostSchedules = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('post_schedules')
      .select(`
        *,
        social_accounts:social_account_id (
          platform,
          account_name
        )
      `)
      .eq('post_id', postId)
      .order('scheduled_time', { ascending: true });
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error fetching post schedules:', error.message);
    throw error;
  }
};
