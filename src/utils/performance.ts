/**
 * Enhanced Performance Utilities for Alpha Prompt Lab Dashboard
 */

import React, { useRef, useCallback, useMemo, useLayoutEffect } from 'react';

/**
 * Optimized debounce hook with cleanup
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
 * Optimized throttle hook for high-frequency events
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
 * Memory-efficient list virtualization
 */
export function useVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
  scrollTop = 0
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  scrollTop?: number;
}) {
  return useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight)
    );
    
    const visibleStartIndex = Math.max(0, startIndex - overscan);
    const visibleEndIndex = Math.min(items.length - 1, endIndex + overscan);
    
    const visibleItems = [];
    for (let i = visibleStartIndex; i <= visibleEndIndex; i++) {
      visibleItems.push({
        index: i,
        item: items[i],
        offsetTop: i * itemHeight
      });
    }
    
    return {
      visibleItems,
      totalHeight: items.length * itemHeight,
      offsetY: visibleStartIndex * itemHeight,
      visibleStartIndex,
      visibleEndIndex
    };
  }, [items, itemHeight, containerHeight, overscan, scrollTop]);
}

/**
 * Intersection observer for lazy loading with cleanup
 */
export function useIntersectionObserver(
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback((element: Element | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (element) {
      targetRef.current = element;
      observerRef.current = new IntersectionObserver(
        ([entry]) => callback(entry.isIntersecting),
        {
          threshold: 0.1,
          rootMargin: '50px',
          ...options
        }
      );
      observerRef.current.observe(element);
    }
  }, [callback, options]);

  React.useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return observe;
}

/**
 * RAF-based smooth animations
 */
export function useRAFState<T>(initialValue: T): [T, (value: T) => void] {
  const [state, setState] = React.useState(initialValue);
  const rafRef = useRef<number>();

  const setRAFState = useCallback((value: T) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      setState(value);
    });
  }, []);

  React.useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return [state, setRAFState];
}

/**
 * Performance measurement hook
 */
export function usePerformanceMonitor(name: string, enabled = false) {
  const startTime = useRef<number>();
  
  if (enabled && typeof window !== 'undefined') {
    startTime.current = performance.now();
  }
  
  useLayoutEffect(() => {
    if (enabled && startTime.current) {
      const endTime = performance.now();
      const duration = endTime - startTime.current;
      
      if (duration > 16.67) { // 60fps threshold
        console.warn(`🐌 ${name}: ${duration.toFixed(2)}ms (slow render)`);
      } else {
        console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
      }
    }
  });
}

/**
 * Stable callback reference
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef<T>();
  const stableCallback = useRef<T>();

  ref.current = callback;

  if (!stableCallback.current) {
    stableCallback.current = ((...args) => {
      return ref.current?.(...args);
    }) as T;
  }

  return stableCallback.current;
}

/**
 * Component preloader for faster navigation
 */
export function preloadComponent(componentLoader: () => Promise<any>) {
  // Preload after a short delay to avoid blocking initial render
  setTimeout(() => {
    componentLoader().catch(() => {
      // Ignore preload errors
    });
  }, 1000);
}

/**
 * Batch state updates for better performance
 */
export function useBatchedState<T>(initialState: T) {
  const [state, setState] = React.useState(initialState);
  const batchedUpdates = useRef<Partial<T>[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const setBatchedState = useCallback((updates: Partial<T>) => {
    batchedUpdates.current.push(updates);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const allUpdates = batchedUpdates.current;
      batchedUpdates.current = [];
      
      setState(prevState => {
        return allUpdates.reduce(
          (acc, update) => ({ ...acc, ...update }),
          prevState
        );
      });
    }, 0);
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, setBatchedState] as const;
}

/**
 * Memory leak detection for development
 */
export function useMemoryLeakDetection(componentName: string) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;
      
      return () => {
        setTimeout(() => {
          const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
          const diff = memoryAfter - memoryBefore;
          
          if (diff > 1024 * 1024) { // 1MB threshold
            console.warn(`🧠 ${componentName} may have memory leak: +${(diff / 1024 / 1024).toFixed(2)}MB`);
          }
        }, 100);
      };
    }
  }, [componentName]);
}

/**
 * Efficient list filtering with memoization
 */
export function useFilteredList<T>(
  list: T[],
  filterFn: (item: T) => boolean,
  dependencies: React.DependencyList
) {
  return useMemo(() => {
    return list.filter(filterFn);
  }, [list, ...dependencies]);
}

/**
 * Web Worker hook for heavy computations
 */
export function useWebWorker<T, R>(
  workerFunction: (data: T) => R,
  dependencies: React.DependencyList = []
) {
  const workerRef = useRef<Worker | null>(null);
  
  const execute = useCallback((data: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        const workerBlob = new Blob([`
          self.onmessage = function(e) {
            try {
              const result = (${workerFunction.toString()})(e.data);
              self.postMessage({ success: true, result });
            } catch (error) {
              self.postMessage({ success: false, error: error.message });
            }
          }
        `], { type: 'application/javascript' });
        
        workerRef.current = new Worker(URL.createObjectURL(workerBlob));
      }
      
      const handleMessage = (e: MessageEvent) => {
        workerRef.current?.removeEventListener('message', handleMessage);
        
        if (e.data.success) {
          resolve(e.data.result);
        } else {
          reject(new Error(e.data.error));
        }
      };
      
      workerRef.current.addEventListener('message', handleMessage);
      workerRef.current.postMessage(data);
    });
  }, dependencies);
  
  React.useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);
  
  return execute;
}

/**
 * Resource preloading utilities
 */
export const ResourcePreloader = {
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  },
  
  preloadFont: (fontFamily: string, url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const font = new FontFace(fontFamily, `url(${url})`);
      font.load()
        .then(() => {
          document.fonts.add(font);
          resolve();
        })
        .catch(reject);
    });
  },
  
  preloadJSON: (url: string): Promise<any> => {
    return fetch(url).then(res => res.json());
  }
};

/**
 * Performance budget monitoring
 */
export function usePerformanceBudget(budgets: {
  renderTime?: number;
  memoryUsage?: number;
  bundleSize?: number;
}) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Monitor render time
      if (budgets.renderTime) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > budgets.renderTime!) {
              console.warn(`⚠️ Render time budget exceeded: ${entry.duration.toFixed(2)}ms > ${budgets.renderTime}ms`);
            }
          });
        });
        observer.observe({ entryTypes: ['measure'] });
      }
      
      // Monitor memory usage
      if (budgets.memoryUsage && (window as any).performance?.memory) {
        const checkMemory = () => {
          const memory = (window as any).performance.memory;
          const usageMB = memory.usedJSHeapSize / 1024 / 1024;
          
          if (usageMB > budgets.memoryUsage!) {
            console.warn(`⚠️ Memory budget exceeded: ${usageMB.toFixed(2)}MB > ${budgets.memoryUsage}MB`);
          }
        };
        
        const interval = setInterval(checkMemory, 5000);
        return () => clearInterval(interval);
      }
    }
  }, [budgets]);
}