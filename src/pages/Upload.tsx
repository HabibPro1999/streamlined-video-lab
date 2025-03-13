import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import VideoUpload from '@/components/VideoUpload';
import PlatformSelector from '@/components/PlatformSelector';
import AIFeatures from '@/components/AIFeatures';
import { Check, ChevronRight, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPost, deleteVideoFromStorage, getUserSocialAccounts } from '@/services/videoService';
import { useToast } from '@/components/ui/use-toast';

const Upload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFilePath, setVideoFilePath] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'tiktok', 'youtube']);
  
  const [aiGeneratedContent, setAiGeneratedContent] = useState<{
    captions?: any;
    hashtags?: any;
    thumbnails?: any;
    schedule?: any;
  }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSocialAccounts, setHasSocialAccounts] = useState(false);

  useEffect(() => {
    // Smooth scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check if user has social accounts
    const checkSocialAccounts = async () => {
      if (!user) return;
      
      try {
        const accounts = await getUserSocialAccounts(user.id);
        setHasSocialAccounts(accounts.length > 0);
      } catch (error) {
        console.error("Error checking social accounts:", error);
      }
    };
    
    checkSocialAccounts();
  }, [user]);

  const steps = [
    { number: 1, title: 'Upload Video' },
    { number: 2, title: 'Select Platforms' },
    { number: 3, title: 'Generate Content' },
    { number: 4, title: 'Review & Post' },
  ];

  const handleVideoUpload = (file: File, fileUrl: string, filePath: string) => {
    setUploadedFile(file);
    setVideoUrl(fileUrl);
    setVideoFilePath(filePath);
    setVideoTitle(file.name.split('.')[0]); // Default title from filename
    
    // Wait a bit for animation
    setTimeout(() => setCurrentStep(2), 500);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      // Scroll to top with each step for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlatformChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms);
  };

  const handleAIGenerate = (featureType: string, content: any) => {
    setAiGeneratedContent(prev => ({
      ...prev,
      [featureType]: content
    }));
  };

  const handleFinish = async () => {
    if (!user || !uploadedFile || !videoUrl) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please complete all required fields.',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the post in the database
      const post = await createPost({
        userId: user.id,
        title: videoTitle || uploadedFile.name,
        description: aiDescription,
        videoUrl: videoUrl,
        thumbnailUrl: aiGeneratedContent.thumbnails ? 
          Object.values(aiGeneratedContent.thumbnails)[0] as string : 
          undefined,
        aiGeneratedCaption: aiGeneratedContent.captions ? 
          JSON.stringify(aiGeneratedContent.captions) : 
          undefined,
        aiGeneratedHashtags: aiGeneratedContent.hashtags ? 
          JSON.stringify(aiGeneratedContent.hashtags) : 
          undefined,
      });
      
      // Delete the uploaded video from storage as we no longer need it
      // (Note: In a real app, you might want to keep it or move it to a permanent storage)
      await deleteVideoFromStorage(videoFilePath);
      
      toast({
        title: 'Success!',
        description: 'Your video was successfully saved.',
      });
      
      // Navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error saving your post. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSchedule = () => {
    // First save the post, then navigate to calendar
    handleFinish().then(() => {
      navigate('/calendar');
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <NavBar />
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-32">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Upload & Distribute</h1>
          <p className="text-muted-foreground">Upload once, distribute everywhere</p>
        </div>
        
        {/* Steps indicator */}
        <div className="glass-panel p-4 mb-10">
          <div className="flex flex-wrap justify-between">
            {steps.map((step, i) => (
              <div 
                key={step.number}
                className="flex items-center mb-2"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm mr-2 transition-all duration-300",
                    currentStep > step.number 
                      ? "bg-primary text-white" 
                      : currentStep === step.number 
                        ? "bg-primary/10 text-primary ring-2 ring-primary/20" 
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.number ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>
                
                <span 
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
                
                {i < steps.length - 1 && (
                  <div className="hidden md:block mx-4 h-[1px] w-8 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Step content */}
        <div className="mb-10">
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6">Upload Your Video</h2>
              <VideoUpload onUploadComplete={handleVideoUpload} />
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6">Select Distribution Platforms</h2>
              
              {!hasSocialAccounts && (
                <div className="glass-panel p-4 bg-amber-500/10 border-amber-500/20 mb-6">
                  <p className="text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>You don't have any social accounts connected yet. You can <a href="/settings" className="text-primary underline">connect your accounts</a> in Settings.</span>
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Video Title</label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="glass-input w-full"
                    placeholder="Enter a title for your video"
                  />
                </div>
                
                <PlatformSelector onSelectionChange={handlePlatformChange} />
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6">Generate AI-Powered Content</h2>
              <div className="mb-6">
                <label className="block text-sm text-muted-foreground mb-2">
                  Briefly describe your video (optional)
                </label>
                <textarea
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                  className="glass-input w-full min-h-[100px]"
                  placeholder="Example: A behind-the-scenes look at our new product launch, featuring team interviews and product demonstrations."
                />
              </div>
              <AIFeatures 
                description={aiDescription} 
                platforms={selectedPlatforms}
                onGenerate={handleAIGenerate}
              />
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6">Review & Schedule</h2>
              
              <div className="glass-panel p-6 mb-8">
                <h3 className="font-medium mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  All Set! Review Your Distribution
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4 py-3 bg-green-500/5 rounded-lg border border-green-500/20">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-500/10 rounded-full mr-3">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Video Ready</h4>
                        <p className="text-sm text-muted-foreground">
                          {videoTitle || (uploadedFile?.name || "Your video is ready for distribution")}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between px-4 py-3 bg-green-500/5 rounded-lg border border-green-500/20">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-500/10 rounded-full mr-3">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Platforms Selected</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {selectedPlatforms.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between px-4 py-3 bg-green-500/5 rounded-lg border border-green-500/20">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-500/10 rounded-full mr-3">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">AI Content Generated</h4>
                        <p className="text-sm text-muted-foreground">
                          {Object.keys(aiGeneratedContent).length > 0 
                            ? `${Object.keys(aiGeneratedContent).join(', ')} generated`
                            : "No AI content generated yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleFinish}
                    disabled={isSubmitting}
                    className="glass-button bg-primary text-white hover:bg-primary/90 flex items-center justify-center px-6 py-3 flex-1"
                  >
                    <span>{isSubmitting ? 'Saving...' : 'Save to Dashboard'}</span>
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </button>
                  
                  <button 
                    onClick={handleSchedule}
                    disabled={isSubmitting}
                    className="glass-button bg-white/50 dark:bg-gray-900/50 text-foreground hover:bg-white/70 dark:hover:bg-gray-800/70 flex items-center justify-center px-6 py-3 flex-1"
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    <span>Schedule for Later</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={cn(
              "glass-button",
              currentStep === 1 
                ? "bg-muted/50 text-muted-foreground cursor-not-allowed" 
                : "bg-white/50 dark:bg-gray-900/50 text-foreground hover:bg-white/70 dark:hover:bg-gray-800/70"
            )}
          >
            Back
          </button>
          
          {currentStep < steps.length && (
            <button
              onClick={handleNext}
              className="glass-button bg-primary/10 text-primary hover:bg-primary/20"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
