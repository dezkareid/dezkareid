import { Suspense } from 'react';
import Link from 'next/link';
import { Shelves } from '@dezkareid/icons/react';
import { siteData } from '@/lib/mock-data';
import { HeaderTracker } from './HeaderTracker';
import { HeaderAuthSlot } from './HeaderAuthSlot';
import { HeaderAuthFallback } from './HeaderAuthFallback';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  return (
    <header className={styles['site-header']}>
      <div className={`container ${styles['site-header__inner']}`}>
        <HeaderTracker label="home">
          <Link href="/" className={styles['site-header__brand']} aria-label="Collectstory home">
            <Shelves aria-hidden style={{ '--icon-size': '24px' } as React.CSSProperties} />
            <span className={styles['site-header__brand-name']}>{siteData.name}</span>
          </Link>
        </HeaderTracker>

        <Suspense fallback={<HeaderAuthFallback />}>
          <HeaderAuthSlot />
        </Suspense>
      </div>
    </header>
  );
}
