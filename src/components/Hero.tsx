
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Instagram, Youtube, Facebook, Linkedin, ArrowRight } from 'lucide-react';
import { TikTokIcon } from './icons/TikTokIcon';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Delay to allow for nice animations
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "AI Caption Generator",
      description: "Generate engaging captions for your videos using advanced AI technology",
      icon: "✨"
    },
    {
      title: "Multi-Platform Publishing",
      description: "Schedule and publish your content across all major social media platforms",
      icon: "🌐"
    },
    {
      title: "Analytics Dashboard",
      description: "Track performance metrics and gain insights to optimize your content strategy",
      icon: "📊"
    },
    {
      title: "Content Calendar",
      description: "Plan your content strategy with our intuitive visual calendar",
      icon: "📅"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-24 px-6 md:px-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-white/80 dark:from-gray-900/50 dark:to-gray-950/80 -z-10"></div>
      
      {/* Background blur circles */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-blue-300/20 dark:bg-blue-700/10 blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-purple-300/10 dark:bg-purple-700/10 blur-3xl -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>
      
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* Hero badge */}
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
            "text-4xl md:text-5xl lg:text-7xl font-bold text-center mb-6 tracking-tight",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4",
            "transition-all duration-700 delay-200"
          )}
        >
          Create Once, <span className="text-primary">Share Everywhere</span>
        </h1>
        
        {/* Subheading */}
        <p 
          className={cn(
            "text-lg md:text-xl text-center text-foreground/80 max-w-2xl mb-10",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4",
            "transition-all duration-700 delay-300"
          )}
        >
          The all-in-one platform for creators to manage, schedule, and optimize 
          their video content across all major social platforms.
        </p>
        
        {/* CTA buttons */}
        <div 
          className={cn(
            "flex flex-col sm:flex-row gap-4 mb-16",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4",
            "transition-all duration-700 delay-400"
          )}
        >
          <Button 
            size="lg"
            onClick={() => navigate(user ? '/upload' : '/auth')}
            className="bg-primary text-white hover:bg-primary/90 font-medium text-base px-8"
          >
            {user ? 'Upload Your First Video' : 'Get Started Free'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          {user && (
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="lg"
              className="font-medium text-base px-8"
            >
              View Dashboard
            </Button>
          )}
        </div>
        
        {/* Features grid */}
        <div 
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 w-full",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4",
            "transition-all duration-700 delay-500"
          )}
        >
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-panel p-6 rounded-xl flex flex-col md:flex-row items-start gap-4"
              style={{ animationDelay: `${500 + (index * 100)}ms` }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Platform icons */}
        <div 
          className={cn(
            "flex flex-wrap justify-center gap-8 mb-12",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4",
            "transition-all duration-700 delay-600"
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
              <TikTokIcon className="h-8 w-8 text-primary" />
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
        
        {/* Testimonial */}
        <div 
          className={cn(
            "glass-panel p-8 rounded-2xl max-w-3xl w-full text-center mb-10",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8",
            "transition-all duration-700 delay-700"
          )}
        >
          <p className="text-lg mb-6 italic">"This platform has saved our marketing team countless hours. We're now able to manage our entire social media video strategy in one place."</p>
          <div className="font-semibold">Sarah Johnson</div>
          <div className="text-sm text-muted-foreground">Marketing Director, TechCorp</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
