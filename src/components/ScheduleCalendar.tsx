
import { useState } from 'react';
import { Calendar as CalendarIcon, MoreHorizontal, Plus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parse, addDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { TikTokIcon } from './icons/TikTokIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { schedulePost, getUserPosts, getUserSocialAccounts } from '@/services/videoService';
import { Textarea } from '@/components/ui/textarea';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [schedulingPost, setSchedulingPost] = useState<string | null>(null);
  const [schedulingTime, setSchedulingTime] = useState('12:00');
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [customCaption, setCustomCaption] = useState('');
  const [availablePosts, setAvailablePosts] = useState<any[]>([]);
  const [availableAccounts, setAvailableAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load posts and accounts when component mounts
  useState(() => {
    if (user) {
      loadUserPosts();
      loadUserAccounts();
    }
  });

  const loadUserPosts = async () => {
    try {
      const posts = await getUserPosts(user!.id);
      setAvailablePosts(posts);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const loadUserAccounts = async () => {
    try {
      const accounts = await getUserSocialAccounts(user!.id);
      setAvailableAccounts(accounts);
    } catch (error) {
      console.error('Error loading social accounts:', error);
    }
  };

  const handleScheduleSubmit = async () => {
    if (!user || !schedulingPost || !selectedAccount || !scheduledDate) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please select a post, account, and date/time.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Combine date and time
      const timeArray = schedulingTime.split(':');
      const hours = parseInt(timeArray[0]);
      const minutes = parseInt(timeArray[1]);
      
      const scheduledDateTime = new Date(scheduledDate);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      await schedulePost({
        postId: schedulingPost,
        socialAccountId: selectedAccount,
        scheduledTime: scheduledDateTime,
        platformSpecificCaption: customCaption || undefined,
      });

      // Add to local state
      const selectedPost = availablePosts.find(post => post.id === schedulingPost);
      const selectedSocialAccount = availableAccounts.find(account => account.id === selectedAccount);
      
      if (selectedPost && selectedSocialAccount) {
        setPosts([
          ...posts,
          {
            id: `local-${Date.now()}`,
            date: scheduledDateTime,
            time: schedulingTime,
            platforms: [selectedSocialAccount.platform],
            title: selectedPost.title,
          }
        ]);
      }

      toast({
        title: 'Post Scheduled',
        description: `Your post has been scheduled for ${format(scheduledDateTime, 'PPP')} at ${schedulingTime}.`,
      });

      // Reset form
      setIsScheduleDialogOpen(false);
      setSchedulingPost(null);
      setSelectedAccount('');
      setCustomCaption('');
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast({
        variant: 'destructive',
        title: 'Schedule Failed',
        description: 'There was an error scheduling your post.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />;
      case 'tiktok':
        return <TikTokIcon className="w-4 h-4 text-black dark:text-white" />;
      case 'youtube':
        return <div className="w-4 h-4 bg-red-600 rounded-full" />;
      case 'facebook':
        return <div className="w-4 h-4 bg-blue-600 rounded-full" />;
      case 'linkedin':
        return <div className="w-4 h-4 bg-blue-700 rounded-full" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Content Calendar</CardTitle>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {date ? format(date, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 px-2">
                <Plus className="h-4 w-4 mr-1" /> Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule Post</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Post Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Post</label>
                  <Select value={schedulingPost || ''} onValueChange={setSchedulingPost}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a post" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePosts.length === 0 ? (
                        <SelectItem value="no-posts" disabled>No posts available</SelectItem>
                      ) : (
                        availablePosts.map(post => (
                          <SelectItem key={post.id} value={post.id}>
                            {post.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Social Account Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Platform</label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAccounts.length === 0 ? (
                        <SelectItem value="no-accounts" disabled>
                          No social accounts connected
                        </SelectItem>
                      ) : (
                        availableAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.platform} - {account.account_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Date Picker */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Schedule Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, 'PPP') : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={(date) => date && setScheduledDate(date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Time Picker */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Schedule Time</label>
                  <Input
                    type="time"
                    value={schedulingTime}
                    onChange={(e) => setSchedulingTime(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                {/* Custom Caption */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Caption (Optional)</label>
                  <Textarea
                    value={customCaption}
                    onChange={(e) => setCustomCaption(e.target.value)}
                    placeholder="Add a custom caption for this platform"
                    className="w-full"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsScheduleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleScheduleSubmit} disabled={isLoading}>
                  {isLoading ? 'Scheduling...' : 'Schedule Post'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-muted p-3 rounded-lg flex justify-between items-start">
                <div>
                  <div className="font-medium">{post.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {format(post.date, 'MMM dd')} • {post.time}
                  </div>
                  <div className="flex gap-1 mt-2">
                    {post.platforms.map((platform, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1 px-2 py-0.5">
                        {getPlatformIcon(platform)}
                        <span className="text-xs">{platform}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No scheduled posts for this date. Click 'Schedule' to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;
