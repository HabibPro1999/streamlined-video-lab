
import { useState } from 'react';
import { Calendar as CalendarIcon, MoreHorizontal, Plus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { TikTokIcon } from './icons/TikTokIcon';

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
          
          <Button size="sm" className="h-8 px-2">
            <Plus className="h-4 w-4 mr-1" /> Schedule
          </Button>
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
