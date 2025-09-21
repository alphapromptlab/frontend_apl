import React, { Suspense } from 'react';
import { motion } from 'motion/react';
import { PAGE_TRANSITIONS } from '../../constants/animations';
import { LoadingFallback } from './LoadingFallback';
import type { AnimatedPageProps } from '../../types';

/**
 * Reusable animated page wrapper component for consistent page transitions
 */
export const AnimatedPageWrapper = React.memo<AnimatedPageProps>(({ 
  children, 
  pageKey, 
  className = "" 
}) => (
  <motion.div
    key={pageKey}
    {...PAGE_TRANSITIONS}
    className={className}
  >
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  </motion.div>
));

AnimatedPageWrapper.displayName = 'AnimatedPageWrapper';