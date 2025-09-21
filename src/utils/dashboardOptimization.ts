/**
 * Dashboard Performance Optimization Utilities
 * Provides tools for optimizing React performance and reducing re-renders
 */

import React, { useRef, useCallback, useMemo } from 'react';

/**
 * Debounce hook for reducing frequent updates
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  const timerRef = useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for limiting function calls
 */
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastCallTime = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCallTime.current >= delay) {
        lastCallTime.current = now;
        return func(...args);
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        lastCallTime.current = Date.now();
        func(...args);
      }, delay - (now - lastCallTime.current));
    },
    [func, delay]
  ) as T;
}

/**
 * Memoized stable callback that persists across re-renders
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = useRef<T>();
  const memoizedCallback = useRef<T>();

  callbackRef.current = callback;

  if (!memoizedCallback.current) {
    memoizedCallback.current = ((...args: Parameters<T>) => {
      return callbackRef.current?.(...args);
    }) as T;
  }

  return memoizedCallback.current;
}

/**
 * Performance observer for measuring component render times
 */
export function useRenderTime(componentName: string, enabled: boolean = false) {
  const startTime = useRef<number>();
  
  if (enabled && typeof window !== 'undefined' && 'performance' in window) {
    if (!startTime.current) {
      startTime.current = performance.now();
    }
    
    React.useLayoutEffect(() => {
      const endTime = performance.now();
      const renderTime = endTime - (startTime.current || 0);
      
      if (renderTime > 16) { // Log slow renders (>16ms)
        console.log(`🐌 Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }
      
      startTime.current = undefined;
    });
  }
}

/**
 * Optimized intersection observer for lazy loading
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const observerRef = useRef<IntersectionObserver>();

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
          ...options
        }
      );
    }

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [elementRef, options]);

  return isIntersecting;
}

/**
 * Memory optimization for large lists
 */
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight)
    );
    
    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length - 1, endIndex + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => ({
      item,
      index: visibleRange.start + index
    }));
  }, [items, visibleRange]);
  
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };
}

/**
 * Preload components for faster navigation
 */
export function useComponentPreloader(routes: Record<string, () => Promise<any>>) {
  React.useEffect(() => {
    // Preload components after initial render
    const preloadTimeout = setTimeout(() => {
      Object.values(routes).forEach(loader => {
        loader().catch(() => {
          // Ignore preload errors
        });
      });
    }, 1000);
    
    return () => clearTimeout(preloadTimeout);
  }, [routes]);
}

/**
 * Bundle size analyzer (development only)
 */
export function analyzeBundleSize() {
  if (process.env.NODE_ENV === 'development') {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const nav = entry as PerformanceNavigationTiming;
          console.log('📊 Bundle Analysis:', {
            'DNS Lookup': nav.domainLookupEnd - nav.domainLookupStart,
            'Connection': nav.connectEnd - nav.connectStart,
            'Response': nav.responseEnd - nav.responseStart,
            'DOM Loading': nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
            'Total Load Time': nav.loadEventEnd - nav.navigationStart
          });
        }
      });
    });
    
    observer.observe({ entryTypes: ['navigation'] });
    
    return () => observer.disconnect();
  }
}