
import { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import ScheduleCalendar from '@/components/ScheduleCalendar';

// Sample calendar posts for demo
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
  {
    id: '4',
    date: new Date(Date.now() + 432000000), // 5 days from now
    time: '16:00',
    platforms: ['instagram', 'youtube', 'facebook'],
    title: 'Product Tutorial',
  },
  {
    id: '5',
    date: new Date(Date.now() + 604800000), // 7 days from now
    time: '11:30',
    platforms: ['linkedin', 'facebook'],
    title: 'Industry Insights',
  },
];

const Calendar = () => {
  useEffect(() => {
    // Smooth scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <NavBar />
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Content Calendar</h1>
          <p className="text-muted-foreground">Schedule and manage your content across platforms</p>
        </div>
        
        <div className="mb-10">
          <ScheduleCalendar initialPosts={samplePosts} />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
