import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { routing } from '../i18n/routing';
import './globals.css';
import { Suspense } from 'react';
import { AnalyticsClient } from '@/src/shared/lib/analytics/AnalyticsClient';
import { SiteHeader } from '@/src/widgets/site-header';
import Script from 'next/script';
import { ReportProblem } from '@/src/widgets/report-problem';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-family-base',
});

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage.metadata' });

  return {
    title: {
      template: `%s | ${t('title')}`,
      default: t('title'),
    },
    description: t('description'),
    icons: { icon: '/favicon.svg' },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  return (
    <html lang={locale} className={ibmPlexSans.variable} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
