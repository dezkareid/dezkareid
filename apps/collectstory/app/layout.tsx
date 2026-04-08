import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import Script from 'next/script';
import { SiteHeader } from '@/src/widgets/site-header';
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
  return (
    <html lang="en" className={ibmPlexSans.variable} suppressHydrationWarning>
      <body>
        <Script
          id="theme-strategy"
          strategy="beforeInteractive"
          // biome-ignore lint: FOUC guard must be inline and synchronous
          // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('color-scheme');if(t==='dark'){document.documentElement.style.colorScheme='dark';document.documentElement.style.setProperty('--lightningcss-light',' ');document.documentElement.style.setProperty('--lightningcss-dark','initial');}else if(t==='light'){document.documentElement.style.colorScheme='light';document.documentElement.style.setProperty('--lightningcss-light','initial');document.documentElement.style.setProperty('--lightningcss-dark',' ');}}catch(_){}})();`,
          }}
        />
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
