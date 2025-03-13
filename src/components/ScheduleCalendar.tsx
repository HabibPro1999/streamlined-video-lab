import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Instagram, Youtube, Facebook, Linkedin } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ScheduleCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [schedules, setSchedules] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSchedules();
    }
  }, [user, date]);

  const fetchSchedules = async () => {
    try {
      // Fetch all post schedules for the user's posts
      const { data: posts } = await supabase
        .from('posts')
        .select('id')
        .eq('user_id', user?.id);

      if (posts && posts.length > 0) {
        const postIds = posts.map(post => post.id);
        const { data } = await supabase
          .from('post_schedules')
          .select(`
            *,
            social_accounts:social_account_id (
              platform,
              account_name
            )
          `)
          .in('post_id', postIds);

        setSchedules(data || []);
      } else {
        setSchedules([]);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'tiktok':
        return <TikTokIcon className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) =>
              date < new Date()
            }
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>

      {/* Display Scheduled Posts */}
      <div className="mt-4">
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <div key={schedule.id} className="mb-2 p-3 rounded-md shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {schedule.social_accounts && schedule.social_accounts.platform && (
                    getPlatformIcon(schedule.social_accounts.platform)
                  )}
                  <span className="ml-2 font-semibold">
                    {schedule.social_accounts ? schedule.social_accounts.account_name : 'Unknown Account'}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(schedule.scheduled_time), 'Pp')}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground">No posts scheduled for this date.</div>
        )}
      </div>
    </div>
  );
};

export default ScheduleCalendar;
