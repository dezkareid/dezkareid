'use client';

import { Suspense } from 'react';
import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';
import { ConsentBanner } from '../../ui/ConsentBanner';

interface AnalyticsClientProperties {
  gaId?: string;
}

/**
 * Client-side wrapper for analytics components.
 * Handles dynamic import of the consent banner and G4 initialization.
 */
export function AnalyticsClient({ gaId }: AnalyticsClientProperties) {
  return (
    <>
      {gaId && <NextGoogleAnalytics gaId={gaId} />}
      <Suspense fallback={undefined}>
        <ConsentBanner />
      </Suspense>
    </>
  );
}
