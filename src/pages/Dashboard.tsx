
import { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Analytics from '@/components/Analytics';
import ScheduleCalendar from '@/components/ScheduleCalendar';
import { ArrowUpRight, BarChart3, Calendar, Upload, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample calendar posts
const samplePosts = [
  {
    id: '1',
    date: new Date(),
    time: '10:00',
    platforms: ['instagram', 'tiktok'],
    title: 'Product Launch Video',
  },
  {
    id: '2',
    date: new Date(Date.now() + 86400000), // Tomorrow
    time: '14:30',
    platforms: ['youtube', 'linkedin'],
    title: 'Customer Testimonial',
  },
  {
    id: '3',
    date: new Date(Date.now() + 172800000), // Day after tomorrow
    time: '09:15',
    platforms: ['instagram', 'facebook', 'tiktok'],
    title: 'Behind The Scenes',
  },
];

const Dashboard = () => {
  useEffect(() => {
    // Smooth scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Quick actions
  const quickActions = [
    { name: 'Upload New Video', icon: Upload, path: '/upload', color: 'bg-primary/10 text-primary' },
    { name: 'View Analytics', icon: BarChart3, path: '/dashboard', color: 'bg-purple-500/10 text-purple-500' },
    { name: 'Schedule Content', icon: Calendar, path: '/calendar', color: 'bg-green-500/10 text-green-500' },
    { name: 'Account Settings', icon: Settings, path: '/settings', color: 'bg-gray-500/10 text-gray-500' },
  ];

  return (
    <div className="min-h-screen pb-20">
      <NavBar />
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Track, analyze, and optimize your video content performance</p>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <div
                key={index}
                className="glass-panel p-5 cursor-pointer transition-all duration-300 hover:translate-y-[-4px] group animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn("p-2 rounded-full mb-3 transition-all duration-300 group-hover:scale-110", action.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-medium mb-1">{action.name}</h3>
                <div className="flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  <span>View</span>
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Analytics section */}
        <div className="mb-12">
          <Analytics />
        </div>
        
        {/* Calendar section */}
        <div className="mb-12">
          <ScheduleCalendar initialPosts={samplePosts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
