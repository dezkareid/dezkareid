'use client';

import { useAnalytics } from '@/src/shared/lib/analytics/useAnalytics';
import { useCallback } from 'react';

interface HeaderTrackerProperties {
  children: React.ReactNode;
  label: string;
}

/**
 * Client-side wrapper for header links to enable G4 tracking.
 */
export function HeaderTracker({ children, label }: HeaderTrackerProperties) {
  const { track } = useAnalytics();

  const handleClick = useCallback(() => {
    track({
      action: 'cta_click',
      category: 'interaction',
      label: `header_${label}`,
    });
  }, [track, label]);

  return (
    <div onClick={handleClick} role="presentation" style={{ display: 'contents' }}>
      {children}
    </div>
  );
}
