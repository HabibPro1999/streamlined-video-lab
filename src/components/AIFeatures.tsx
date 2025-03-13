
import { useState, useEffect } from 'react';
import { Sparkles, Hash, AlignLeft, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateAIContent } from '@/services/videoService';
import { useAuth } from '@/contexts/AuthContext';

type AIFeatureType = 'captions' | 'hashtags' | 'thumbnails' | 'schedule';

interface AIFeaturesProps {
  description?: string;
  platforms: string[];
  onGenerate?: (featureType: AIFeatureType, content: any) => void;
}

const AIFeatures = ({ description = '', platforms, onGenerate }: AIFeaturesProps) => {
  const { user } = useAuth();
  const [generatingFeature, setGeneratingFeature] = useState<AIFeatureType | null>(null);
  const [generatedFeatures, setGeneratedFeatures] = useState<AIFeatureType[]>([]);
  const [generatedContent, setGeneratedContent] = useState<Record<AIFeatureType, any>>({
    captions: null,
    hashtags: null,
    thumbnails: null,
    schedule: null
  });

  const features = [
    { 
      id: 'captions' as AIFeatureType, 
      name: 'Generate Captions', 
      icon: AlignLeft, 
      description: 'Create engaging captions optimized for each platform'
    },
    { 
      id: 'hashtags' as AIFeatureType, 
      name: 'Suggest Hashtags', 
      icon: Hash, 
      description: 'Get relevant and trending hashtags for maximum reach'
    },
    { 
      id: 'thumbnails' as AIFeatureType, 
      name: 'Create Thumbnails', 
      icon: Sparkles, 
      description: 'Generate eye-catching thumbnails optimized for each platform'
    },
    { 
      id: 'schedule' as AIFeatureType, 
      name: 'Optimal Posting Times', 
      icon: Clock, 
      description: 'Recommend the best times to post for maximum engagement'
    },
  ];

  const handleGenerate = async (feature: AIFeatureType) => {
    if (!user) return;
    if (!description) {
      alert('Please provide a description of your video first.');
      return;
    }
    if (platforms.length === 0) {
      alert('Please select at least one platform.');
      return;
    }
    
    setGeneratingFeature(feature);
    
    try {
      let content;
      
      switch (feature) {
        case 'captions':
          content = await generateAIContent(description, platforms, 'caption');
          break;
        case 'hashtags':
          content = await generateAIContent(description, platforms, 'hashtags');
          break;
        case 'thumbnails':
          // For demo purposes, we'll just simulate this
          // In a real app, this would call an AI image generation service
          content = simulateThumbnailGeneration(platforms);
          break;
        case 'schedule':
          // For demo purposes, we'll just simulate this
          content = simulateScheduleRecommendations(platforms);
          break;
      }
      
      setGeneratedContent(prev => ({
        ...prev,
        [feature]: content
      }));
      
      setGeneratedFeatures(prev => 
        prev.includes(feature) ? prev : [...prev, feature]
      );
      
      if (onGenerate) {
        onGenerate(feature, content);
      }
    } catch (error) {
      console.error(`Error generating ${feature}:`, error);
    } finally {
      setGeneratingFeature(null);
    }
  };

  const regenerateFeature = (feature: AIFeatureType) => {
    setGeneratedFeatures(prev => prev.filter(f => f !== feature));
    handleGenerate(feature);
  };
  
  // Helper function to simulate thumbnail generation (in a real app this would use an AI image generation API)
  const simulateThumbnailGeneration = (platforms: string[]) => {
    // This would be replaced by actual AI image generation
    const result: Record<string, string> = {};
    
    platforms.forEach(platform => {
      // In real implementation, this would be image URLs
      result[platform] = `https://picsum.photos/seed/${platform}${Math.random()}/640/360`;
    });
    
    return result;
  };
  
  // Helper function to simulate schedule recommendations
  const simulateScheduleRecommendations = (platforms: string[]) => {
    const result: Record<string, string[]> = {};
    
    const times = {
      instagram: ['8:30 AM', '12:00 PM', '7:00 PM', '9:00 PM'],
      tiktok: ['9:00 AM', '11:00 AM', '2:00 PM', '8:00 PM'],
      youtube: ['3:00 PM', '5:00 PM', '8:00 PM', '9:00 PM'],
      facebook: ['1:00 PM', '3:00 PM', '9:00 AM', '7:00 PM'],
      linkedin: ['9:00 AM', '12:00 PM', '5:00 PM', '6:00 PM'],
    };
    
    platforms.forEach(platform => {
      result[platform] = platform in times ? times[platform] : ['12:00 PM', '6:00 PM'];
    });
    
    return result;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-medium">AI-Powered Features</h3>
      </div>
      
      {description && (
        <div className="glass-panel p-4 mb-6">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isGenerating = generatingFeature === feature.id;
          const isGenerated = generatedFeatures.includes(feature.id);
          
          return (
            <div
              key={feature.id}
              className="glass-panel p-5 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    isGenerated ? "bg-green-500/10" : "bg-primary/10" 
                  )}>
                    <Icon className={cn(
                      "h-5 w-5",
                      isGenerated ? "text-green-500" : "text-primary"
                    )} />
                  </div>
                  <h4 className="font-medium">{feature.name}</h4>
                </div>
                
                {isGenerated && (
                  <button 
                    onClick={() => regenerateFeature(feature.id)}
                    className="p-1.5 rounded-full hover:bg-muted transition-colors duration-200"
                    title="Regenerate"
                  >
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {feature.description}
              </p>
              
              {isGenerated ? (
                <div className="flex items-center text-green-500 text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  <span>Generated successfully</span>
                </div>
              ) : (
                <button
                  onClick={() => handleGenerate(feature.id)}
                  disabled={isGenerating || !description || platforms.length === 0}
                  className={cn(
                    "glass-button w-full flex items-center justify-center",
                    isGenerating 
                      ? "bg-primary/10 text-primary/70" 
                      : !description || platforms.length === 0
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      <span>Generate Now</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIFeatures;
