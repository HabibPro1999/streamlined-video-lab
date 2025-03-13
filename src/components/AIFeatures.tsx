
import { useState } from 'react';
import { Sparkles, Hash, AlignLeft, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type AIFeatureType = 'captions' | 'hashtags' | 'thumbnails' | 'schedule';

interface AIFeaturesProps {
  description?: string;
  onGenerate?: (feature: AIFeatureType) => void;
}

const AIFeatures = ({ description = '', onGenerate }: AIFeaturesProps) => {
  const [generatingFeature, setGeneratingFeature] = useState<AIFeatureType | null>(null);
  const [generatedFeatures, setGeneratedFeatures] = useState<AIFeatureType[]>([]);

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

  const handleGenerate = (feature: AIFeatureType) => {
    setGeneratingFeature(feature);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratingFeature(null);
      setGeneratedFeatures(prev => [...prev, feature]);
      
      if (onGenerate) {
        onGenerate(feature);
      }
    }, 2000);
  };

  const regenerateFeature = (feature: AIFeatureType) => {
    setGeneratedFeatures(prev => prev.filter(f => f !== feature));
    handleGenerate(feature);
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
                  disabled={isGenerating}
                  className={cn(
                    "glass-button w-full flex items-center justify-center",
                    isGenerating 
                      ? "bg-primary/10 text-primary/70" 
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
