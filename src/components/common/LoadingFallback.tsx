import React from 'react';

/**
 * Simple loading fallback component for Suspense boundaries
 */
export const LoadingFallback = React.memo(() => (
  <div className="flex items-center justify-center h-full">
    <div className="glass-card rounded-lg p-8 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';