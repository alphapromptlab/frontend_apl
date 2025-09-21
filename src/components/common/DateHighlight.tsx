import { motion } from 'motion/react';

interface DateHighlightProps {
  date: string;
  label?: string;
  isStart?: boolean;
  className?: string;
}

export function DateHighlight({ date, label, isStart = false, className = '' }: DateHighlightProps) {
  // Parse the date string
  const dateObj = new Date(date);
  
  // Get day with suffix (1st, 2nd, 3rd, 4th, etc.)
  const day = dateObj.getDate();
  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  // Get month abbreviation
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
  
  // Get year (24, 25, 26, etc.)
  const year = dateObj.getFullYear().toString().slice(-2);
  
  const dayWithSuffix = `${day}${getDaySuffix(day)}`;
  const monthYear = `${month} '${year}`;
  
  return (
    <motion.div 
      className={`flex flex-col items-center text-center ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <span className="text-xs text-muted-foreground mb-1 font-medium">
          {label}
        </span>
      )}
      
      <div className={`
        relative overflow-hidden rounded-lg p-3
        ${isStart 
          ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20' 
          : 'bg-gradient-to-br from-blue-500/20 to-purple-600/20'
        }
        shadow-[0_4px_12px_rgba(0,0,0,0.15)]
        hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]
        transition-all duration-200
        backdrop-blur-sm
      `}>

        
        {/* Content */}
        <div className="relative z-10">
          {/* Large day number */}
          <div className="text-2xl font-bold leading-none mb-1 text-white drop-shadow-sm">
            {dayWithSuffix}
          </div>
          
          {/* Month and year */}
          <div className="text-xs font-medium opacity-90 text-white">
            {monthYear}
          </div>
        </div>
      </div>
    </motion.div>
  );
}