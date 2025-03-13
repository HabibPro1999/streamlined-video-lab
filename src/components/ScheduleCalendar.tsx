
import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Instagram, Youtube, Facebook, Linkedin, Plus, X } from 'lucide-react';
import { TikTokIcon } from './icons/TikTokIcon';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  date: Date;
  time: string;
  platforms: string[];
  title: string;
}

interface ScheduleCalendarProps {
  initialPosts?: Post[];
}

const ScheduleCalendar = ({ initialPosts = [] }: ScheduleCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostTime, setNewPostTime] = useState('12:00');
  const [newPostPlatforms, setNewPostPlatforms] = useState<string[]>(['instagram']);

  const platformIcons: Record<string, React.ElementType> = {
    instagram: Instagram,
    youtube: Youtube,
    tiktok: TikTok,
    facebook: Facebook,
    linkedin: Linkedin,
  };

  const platformColors: Record<string, string> = {
    instagram: 'text-pink-500 bg-pink-500/10',
    youtube: 'text-red-600 bg-red-600/10',
    tiktok: 'text-gray-900 dark:text-white bg-gray-900/10 dark:bg-white/10',
    facebook: 'text-blue-600 bg-blue-600/10',
    linkedin: 'text-blue-700 bg-blue-700/10',
  };

  const addNewPost = () => {
    if (!date || !newPostTitle) return;
    
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(date),
      time: newPostTime,
      platforms: newPostPlatforms,
      title: newPostTitle,
    };
    
    setPosts([...posts, newPost]);
    setIsAddingPost(false);
    setNewPostTitle('');
    setNewPostTime('12:00');
    setNewPostPlatforms(['instagram']);
  };

  const removePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const togglePlatform = (platform: string) => {
    setNewPostPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => {
      const postDate = new Date(post.date);
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const dateHasPosts = (date: Date) => {
    return getPostsForDate(date).length > 0;
  };

  const selectedDatePosts = date ? getPostsForDate(date) : [];

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-primary/10">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Content Calendar</h3>
        </div>
        
        <button
          onClick={() => setIsAddingPost(!isAddingPost)}
          className={cn(
            "glass-button",
            isAddingPost ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"
          )}
        >
          {isAddingPost ? 'Cancel' : 'Add Post'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
        <div className="md:col-span-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="glass-panel p-3 border-none"
            modifiers={{
              booked: (date) => dateHasPosts(date),
            }}
            modifiersStyles={{
              booked: {
                fontWeight: 'bold',
                backgroundColor: 'hsl(var(--primary) / 0.1)',
                color: 'hsl(var(--primary))',
              },
            }}
          />
        </div>
        
        <div className="md:col-span-4">
          <h4 className="font-medium mb-4 flex items-center">
            {date ? (
              <>
                <span className="text-primary">
                  {date.toLocaleDateString('en-US', { 
                    month: 'long',
                    day: 'numeric', 
                  })}
                </span>
                <span className="mx-2">·</span>
                <span className="text-muted-foreground">
                  {selectedDatePosts.length} {selectedDatePosts.length === 1 ? 'post' : 'posts'}
                </span>
              </>
            ) : (
              'Select a date'
            )}
          </h4>
          
          {isAddingPost && (
            <div className="glass-panel p-4 mb-4 animate-scale-in">
              <h5 className="font-medium mb-3">Add New Post</h5>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Post Title</label>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="glass-input w-full mt-1"
                    placeholder="Enter post title"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Time</label>
                  <div className="glass-input flex items-center mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <input
                      type="time"
                      value={newPostTime}
                      onChange={(e) => setNewPostTime(e.target.value)}
                      className="bg-transparent outline-none w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Platforms</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(platformIcons).map(([platform, Icon]) => (
                      <button
                        key={platform}
                        onClick={() => togglePlatform(platform)}
                        className={cn(
                          "p-2 rounded-full transition-all duration-200",
                          newPostPlatforms.includes(platform)
                            ? platformColors[platform]
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={addNewPost}
                  disabled={!newPostTitle}
                  className="glass-button bg-primary text-white hover:bg-primary/90 w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Calendar
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-3 mt-4">
            {selectedDatePosts.length > 0 ? (
              selectedDatePosts.map((post) => (
                <div key={post.id} className="glass-panel p-4 flex items-center justify-between animate-slide-up">
                  <div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">{post.time}</span>
                    </div>
                    <h5 className="font-medium mt-1">{post.title}</h5>
                    <div className="flex mt-2 space-x-1">
                      {post.platforms.map(platform => {
                        const PlatformIcon = platformIcons[platform];
                        return (
                          <div key={platform} className={cn("p-1 rounded-full", platformColors[platform])}>
                            <PlatformIcon className="h-3 w-3" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removePost(post.id)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No posts scheduled for this date</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
