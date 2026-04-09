import Link from 'next/link';
import { Shelves } from '@dezkareid/icons/react';
import { siteData } from '@/lib/mock-data';
import { SocialShare } from '@/src/features/social-share';
import styles from './Footer.module.css';

export function Footer() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Shelves aria-hidden style={{ '--icon-size': '20px' } as React.CSSProperties} />
              <span className={styles.brandName}>{siteData.name}</span>
            </Link>
            <p className={styles.copyright}>
              ©
              {' '}
              {siteData.copyrightYear}
              {' '}
              {siteData.name}
              . All rights reserved.
            </p>
          </div>
          <nav className={styles.nav}>
            {siteData.navLinks.map(link => (
              <a key={link.label} href={link.href} className={styles.link}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className={styles.socials}>
            <SocialShare
              title="Collectstory — Track Your Collection"
              baseUrl={baseUrl}
              entityType="collection"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
