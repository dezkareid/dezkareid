import Link from 'next/link';
import { ShelvesIcon } from '@/components/icons/ShelvesIcon';
import { siteData } from '@/lib/mock-data';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <ShelvesIcon size={20} />
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
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className={styles.socialBtn} aria-label="Public">
              <span className="material-symbols-outlined">public</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
