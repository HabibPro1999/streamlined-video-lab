import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Instagram, Youtube, ArrowUp, TrendingUp } from 'lucide-react';
import { TikTokIcon } from './icons/TikTokIcon';
import { cn } from '@/lib/utils';

const generateData = () => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return daysOfWeek.map(day => ({
    name: day,
    instagram: Math.floor(Math.random() * 1000) + 500,
    tiktok: Math.floor(Math.random() * 1500) + 800,
    youtube: Math.floor(Math.random() * 800) + 300,
  }));
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border border-border shadow-md">
        <p className="font-medium text-sm">{label}</p>
        <div className="space-y-1 mt-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center text-xs">
              <div 
                className="w-2 h-2 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground mr-2">
                {entry.name}:
              </span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [data, setData] = useState(generateData());
  const [timeframe, setTimeframe] = useState('week');
  
  const refreshData = () => {
    setData(generateData());
  };
  
  useEffect(() => {
    refreshData();
  }, [timeframe]);

  const statCards = [
    { 
      title: 'Instagram Views', 
      value: '24.5K', 
      change: '+15%', 
      icon: Instagram,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10' 
    },
    { 
      title: 'TikTok Views', 
      value: '42.8K', 
      change: '+28%', 
      icon: TikTokIcon,
      color: 'text-black dark:text-white',
      bgColor: 'bg-black/10 dark:bg-white/10' 
    },
    { 
      title: 'YouTube Views', 
      value: '18.3K', 
      change: '+10%', 
      icon: Youtube,
      color: 'text-red-600',
      bgColor: 'bg-red-600/10' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Analytics Overview</h3>
        </div>
        
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full transition-all duration-200",
                timeframe === period 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <div 
              key={index}
              className="glass-panel p-5 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <h4 className="text-2xl font-semibold">{card.value}</h4>
                </div>
                <div className={cn("p-2 rounded-full", card.bgColor)}>
                  <Icon className={cn("h-5 w-5", card.color)} />
                </div>
              </div>
              
              <div className="flex items-center text-green-500 text-sm">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>{card.change} from last week</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="glass-panel p-5">
        <h4 className="font-medium mb-4">Performance Comparison</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#888' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#888' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="instagram"
                stroke="#E1306C"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="tiktok"
                stroke="#000000"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="youtube"
                stroke="#FF0000"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
