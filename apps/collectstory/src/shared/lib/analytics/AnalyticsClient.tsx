'use client';

import dynamic from 'next/dynamic';
import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

const ConsentBanner = dynamic(
  () => import('@/src/shared/ui/ConsentBanner').then(module_ => module_.ConsentBanner),
  { ssr: false },
);

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
      <ConsentBanner />
    </>
  );
}
