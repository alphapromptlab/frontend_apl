import { motion } from 'motion/react';
import { cn } from './utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'white' | 'muted';
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  color = 'primary' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-6 h-6'
  };

  const colorClasses = {
    primary: 'text-foreground',
    white: 'text-white',
    muted: 'text-muted-foreground'
  };

  return (
    <motion.div
      className={cn(
        'inline-block border-2 border-transparent rounded-full',
        sizeClasses[size],
        className
      )}
      style={{
        borderTopColor: 'currentColor',
        borderRightColor: 'currentColor',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent'
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      <span className={cn('sr-only', colorClasses[color])}>Loading...</span>
    </motion.div>
  );
}

// Alternative circular loading dots animation
export function LoadingDots({ 
  size = 'md', 
  className,
  color = 'primary' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2'
  };

  const colorClasses = {
    primary: 'bg-foreground',
    white: 'bg-white',
    muted: 'bg-muted-foreground'
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn(
            'rounded-full',
            sizeClasses[size],
            colorClasses[color]
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Pulsing circle loader
export function LoadingPulse({ 
  size = 'md', 
  className,
  color = 'primary' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const colorClasses = {
    primary: 'border-foreground',
    white: 'border-white', 
    muted: 'border-muted-foreground'
  };

  return (
    <motion.div
      className={cn(
        'rounded-full border-2',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      <span className="sr-only">Loading...</span>
    </motion.div>
  );
}