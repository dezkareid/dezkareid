import { Suspense } from 'react';
import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import Script from 'next/script';
import { AnalyticsClient } from '@/src/shared/lib/analytics/AnalyticsClient';
import { SiteHeader } from '@/src/widgets/site-header';
import { ReportProblem } from '@/src/widgets/report-problem';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-family-base',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Collectstory',
    default: 'Collectstory',
  },
  description: 'Track and showcase your collectibles collection.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className={ibmPlexSans.variable} suppressHydrationWarning>
      <body>
        <Suspense fallback={undefined}>
          <AnalyticsClient gaId={gaId} />
        </Suspense>
        <Script
          id="theme-strategy"
          strategy="beforeInteractive"
          // biome-ignore lint: FOUC guard must be inline and synchronous
          // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('color-scheme');if(t==='dark'){document.documentElement.style.colorScheme='dark';document.documentElement.style.setProperty('--lightningcss-light',' ');document.documentElement.style.setProperty('--lightningcss-dark','initial');}else if(t==='light'){document.documentElement.style.colorScheme='light';document.documentElement.style.setProperty('--lightningcss-light','initial');document.documentElement.style.setProperty('--lightningcss-dark',' ');}}catch(_){}})();`,
          }}
        />
        <Suspense fallback={undefined}>
          <SiteHeader />
        </Suspense>
        <main>{children}</main>
        <Suspense fallback={undefined}>
          <ReportProblem />
        </Suspense>
      </body>
    </html>
  );
}
