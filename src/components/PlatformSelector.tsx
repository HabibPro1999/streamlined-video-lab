
import { useState } from 'react';
import { Instagram, Youtube, TikTok, Facebook, Linkedin, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Platform = 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'linkedin';

interface PlatformSelectorProps {
  onSelectionChange?: (platforms: Platform[]) => void;
}

const PlatformSelector = ({ onSelectionChange }: PlatformSelectorProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['instagram', 'tiktok', 'youtube']);

  const platforms = [
    { id: 'instagram' as Platform, name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
    { id: 'tiktok' as Platform, name: 'TikTok', icon: TikTok, color: 'bg-black' },
    { id: 'youtube' as Platform, name: 'YouTube', icon: Youtube, color: 'bg-red-600' },
    { id: 'facebook' as Platform, name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'linkedin' as Platform, name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
  ];

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev => {
      const newSelection = prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform];
      
      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }
      
      return newSelection;
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Platforms</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          const Icon = platform.icon;
          
          return (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={cn(
                "glass-panel flex flex-col items-center justify-center p-4 transition-all duration-300",
                isSelected 
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                  : "hover:bg-background/80"
              )}
            >
              <div className="relative mb-3">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  isSelected ? "bg-primary/10" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "h-6 w-6 transition-all duration-300",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                
                {isSelected && (
                  <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              
              <span className={cn(
                "text-sm font-medium transition-all duration-300",
                isSelected ? "text-foreground" : "text-muted-foreground"
              )}>
                {platform.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformSelector;
