
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Instagram, Youtube, TikTok, Facebook, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay to allow for nice animations
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-white/80 dark:from-gray-900/50 dark:to-gray-950/80 -z-10"></div>
      
      {/* Background blur circles */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-blue-300/20 dark:bg-blue-700/10 blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-purple-300/10 dark:bg-purple-700/10 blur-3xl -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>
      
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* Small tag above heading */}
        <div 
          className={cn(
            "px-4 py-1.5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full text-xs font-medium text-primary mb-6 border border-white/20 dark:border-gray-800/20 shadow-sm",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4",
            "transition-all duration-700 delay-100"
          )}
        >
          Simplify Your Video Marketing Workflow
        </div>
        
        {/* Main heading */}
        <h1 
          className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 tracking-tight",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4",
            "transition-all duration-700 delay-200"
          )}
        >
          Create Once, <span className="text-primary">Share Everywhere</span>
        </h1>
        
        {/* Subheading */}
        <p 
          className={cn(
            "text-lg md:text-xl text-center text-foreground/80 max-w-2xl mb-8",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4",
            "transition-all duration-700 delay-300"
          )}
        >
          Streamline your video content distribution across all major social platforms with 
          AI-powered caption generation and smart scheduling.
        </p>
        
        {/* CTA buttons */}
        <div 
          className={cn(
            "flex flex-col sm:flex-row gap-4 mb-16",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4",
            "transition-all duration-700 delay-400"
          )}
        >
          <button 
            onClick={() => navigate('/upload')}
            className="glass-button bg-primary text-white hover:bg-primary/90 flex items-center justify-center px-6 py-3"
          >
            <span>Upload Your First Video</span>
            <ChevronRight className="ml-1 h-5 w-5" />
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="glass-button bg-white/50 dark:bg-gray-900/50 text-foreground hover:bg-white/70 dark:hover:bg-gray-800/70 flex items-center justify-center px-6 py-3"
          >
            <span>View Dashboard</span>
          </button>
        </div>
        
        {/* Platform icons */}
        <div 
          className={cn(
            "flex flex-wrap justify-center gap-8 mb-12",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4",
            "transition-all duration-700 delay-500"
          )}
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center glass-panel mb-3">
              <Instagram className="h-8 w-8 text-primary" />
            </div>
            <span className="text-xs font-medium">Instagram</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center glass-panel mb-3">
              <TikTok className="h-8 w-8 text-primary" />
            </div>
            <span className="text-xs font-medium">TikTok</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center glass-panel mb-3">
              <Youtube className="h-8 w-8 text-primary" />
            </div>
            <span className="text-xs font-medium">YouTube</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center glass-panel mb-3">
              <Facebook className="h-8 w-8 text-primary" />
            </div>
            <span className="text-xs font-medium">Facebook</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center glass-panel mb-3">
              <Linkedin className="h-8 w-8 text-primary" />
            </div>
            <span className="text-xs font-medium">LinkedIn</span>
          </div>
        </div>
        
        {/* Minimalist mockup image */}
        <div 
          className={cn(
            "w-full max-w-3xl glass-panel p-1 rounded-2xl overflow-hidden shadow-2xl",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8",
            "transition-all duration-700 delay-600"
          )}
        >
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl aspect-video flex items-center justify-center text-muted-foreground">
            <p className="text-sm font-medium">Dashboard Preview</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
