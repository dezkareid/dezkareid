import Link from 'next/link';
import { Globe, Share, Shelves } from '@dezkareid/icons/react';
import { siteData } from '@/lib/mock-data';
import styles from './Footer.module.css';

export function Footer() {
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
            <button className={styles.socialBtn} aria-label="Share">
              <Share aria-hidden />
            </button>
            <button className={styles.socialBtn} aria-label="Public">
              <Globe aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
