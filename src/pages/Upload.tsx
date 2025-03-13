
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import VideoUpload from '@/components/VideoUpload';
import PlatformSelector from '@/components/PlatformSelector';
import AIFeatures from '@/components/AIFeatures';
import { Check, ChevronRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Upload = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [aiDescription, setAiDescription] = useState('');

  useEffect(() => {
    // Smooth scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const steps = [
    { number: 1, title: 'Upload Video' },
    { number: 2, title: 'Select Platforms' },
    { number: 3, title: 'Generate Content' },
    { number: 4, title: 'Review & Post' },
  ];

  const handleVideoUpload = (file: File) => {
    setUploadedFile(file);
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

  const handleFinish = () => {
    // Here you would typically submit all the data
    navigate('/dashboard');
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
              <PlatformSelector />
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
              <AIFeatures description={aiDescription} />
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
                          {uploadedFile?.name || "Your video is ready for distribution"}
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
                        <p className="text-sm text-muted-foreground">
                          Instagram, TikTok, YouTube
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
                          Captions, hashtags, and posting times generated
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleFinish}
                    className="glass-button bg-primary text-white hover:bg-primary/90 flex items-center justify-center px-6 py-3 flex-1"
                  >
                    <span>Publish Now</span>
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </button>
                  
                  <button 
                    onClick={() => navigate('/calendar')}
                    className="glass-button bg-white/50 dark:bg-gray-900/50 text-foreground hover:bg-white/70 dark:hover:bg-gray-800/70 flex items-center justify-center px-6 py-3 flex-1"
                  >
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
