import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  componentCount: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  enabled = false, 
  position = 'bottom-right' 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    componentCount: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    // FPS monitoring
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Memory usage (if available)
        const memory = (performance as any).memory;
        const memoryUsage = memory ? 
          Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;

        // Component count estimation
        const componentCount = document.querySelectorAll('[data-react-component]').length;

        setMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage,
          componentCount
        }));

        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Show/hide with keyboard shortcut (Ctrl/Cmd + Shift + P)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  if (!enabled || !isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  const getFPSStatus = (fps: number) => {
    if (fps >= 55) return { color: 'success', icon: CheckCircle };
    if (fps >= 30) return { color: 'warning', icon: AlertTriangle };
    return { color: 'destructive', icon: AlertTriangle };
  };

  const fpsStatus = getFPSStatus(metrics.fps);
  const StatusIcon = fpsStatus.icon;

  return (
    <Card className={`fixed ${getPositionClasses()} z-50 p-3 min-w-[200px] glass-card`}>
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Performance</span>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span>FPS:</span>
          <div className="flex items-center gap-1">
            <StatusIcon className="w-3 h-3" />
            <Badge 
              variant={fpsStatus.color === 'success' ? 'default' : 'destructive'}
              className="text-xs px-1 py-0"
            >
              {metrics.fps}
            </Badge>
          </div>
        </div>
        
        {metrics.memoryUsage > 0 && (
          <div className="flex items-center justify-between">
            <span>Memory:</span>
            <Badge variant="outline" className="text-xs px-1 py-0">
              {metrics.memoryUsage}MB
            </Badge>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span>Components:</span>
          <Badge variant="outline" className="text-xs px-1 py-0">
            {metrics.componentCount}
          </Badge>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
        Press Ctrl+Shift+P to toggle
      </div>
    </Card>
  );
};

// Performance-aware component wrapper
export function withPerformanceMonitoring<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return React.memo((props: T) => {
    const startTime = React.useRef<number>();
    
    if (process.env.NODE_ENV === 'development') {
      startTime.current = performance.now();
    }
    
    React.useLayoutEffect(() => {
      if (process.env.NODE_ENV === 'development' && startTime.current) {
        const renderTime = performance.now() - startTime.current;
        if (renderTime > 16) {
          console.warn(`⚠️ Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
        }
      }
    });
    
    return <Component {...props} data-react-component={componentName} />;
  });
}