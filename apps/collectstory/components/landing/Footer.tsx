import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Shelves } from '@dezkareid/icons/react';
import { siteData } from '@/lib/mock-data';
import { SocialShare } from '@/src/features/social-share';
import styles from './Footer.module.css';

export function Footer() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const t = useTranslations('Navigation');
  const tHome = useTranslations('HomePage.metadata');

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
              .
              {' '}
              {t('all_rights_reserved')}
            </p>
          </div>
          <nav className={styles.nav} aria-label={t('main_nav')}>
            {siteData.navLinks.map((link) => {
              const translationKeys: Record<string, string> = {
                'Privacy Policy': 'privacy',
                'Terms of Service': 'terms',
                'Contact': 'contact',
              };
              const translationKey = translationKeys[link.label] || 'contact';
              return (
                <a key={link.label} href={link.href} className={styles.link}>
                  {t(translationKey)}
                </a>
              );
            })}
          </nav>
          <div className={styles.socials}>
            <SocialShare
              title={tHome('title')}
              baseUrl={baseUrl}
              entityType="collection"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
