import React from 'react';
import type { BaseComponentProps } from '../../types';

interface ComingSoonPageProps extends BaseComponentProps {
  pageName: string;
  description?: string;
}

/**
 * Placeholder component for pages that are not yet implemented
 */
export const ComingSoonPage = React.memo<ComingSoonPageProps>(({ 
  pageName, 
  description = "This page is coming soon...",
  className = "p-6"
}) => (
  <div className={className}>
    <div className="glass-card rounded-lg p-8 text-center">
      <h2 className="text-xl font-medium mb-2">{pageName}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
));

ComingSoonPage.displayName = 'ComingSoonPage';