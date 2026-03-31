import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { HomeCTA } from '@/components/HomeCta';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Collectstory — Track Your Collection',
  description:
    'Collectstory is the premier platform for serious collectors. Catalog your S.H. Figuarts, Marvel Legends, and every figure in your collection — organized by brand, line, and category.',
  openGraph: {
    title: 'Collectstory — Track Your Collection',
    description:
      'The premier platform for serious collectors. Organize every figure by brand, line, and category.',
    type: 'website',
  },
};

const features = [
  {
    label: 'Brands & Lines',
    description:
      'Organize your figures by brand and product line. From Bandai S.H. Figuarts to Hasbro Marvel Legends — every series cataloged.',
  },
  {
    label: 'Categories',
    description:
      'Action figures, statues, diecast, plush — assign categories to filter and surface exactly what you need.',
  },
  {
    label: 'Stores Directory',
    description:
      'Discover where to find the pieces you want. Browse a curated directory of stores and locations worldwide.',
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>

        {/* Hero */}
        <section className={styles.hero} aria-labelledby="hero-heading">
          <div className={styles.heroInner}>
            <div className={styles.heroEyebrow}>
              <span className={styles.eyebrowLine} aria-hidden="true" />
              <span className={styles.eyebrowText}>Your collection. Cataloged.</span>
            </div>

            <h1 id="hero-heading" className={styles.heroTitle}>
              <span className={styles.heroTitleTop}>Collect</span>
              <span className={styles.heroTitleBottom}>story</span>
            </h1>

            <p className={styles.heroSubtitle}>
              The collector&rsquo;s companion for serious enthusiasts.
              Track every figure, discover new releases, and showcase your archive.
            </p>

            <div className={styles.heroActions}>
              <Suspense
                fallback={(
                  <Link href="/login" className={styles.ctaPrimary}>
                    Sign In to Your Collection
                  </Link>
                )}
              >
                <HomeCTA primaryClassName={styles.ctaPrimary} />
              </Suspense>
              <Link href="/stores" className={styles.ctaSecondary}>
                Explore Stores
              </Link>
            </div>
          </div>

          <div className={styles.heroDeco} aria-hidden="true">
            <div className={styles.decoGrid}>
              {Array.from({ length: 9 }).map((_, index) => (
                // eslint-disable-next-line @eslint-react/no-array-index-key -- decorative static grid, never reorders
                <div key={index} className={styles.decoCell} />
              ))}
            </div>
            <div className={styles.decoRing} />
            <div className={styles.decoAccent} />
          </div>
        </section>

        {/* Features */}
        <section className={styles.features} aria-labelledby="features-heading">
          <div className={styles.featuresHeader}>
            <h2 id="features-heading" className={styles.sectionLabel}>
              What you get
            </h2>
          </div>
          <ul className={styles.featureList} role="list">
            {features.map((f, index) => (
              <li key={f.label} className={styles.featureItem}>
                <span className={styles.featureIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className={styles.featureBody}>
                  <h3 className={styles.featureLabel}>{f.label}</h3>
                  <p className={styles.featureDesc}>{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA Banner */}
        <section className={styles.banner} aria-labelledby="banner-heading">
          <h2 id="banner-heading" className={styles.bannerTitle}>
            Ready to catalog your collection?
          </h2>
          <Link href="/login" className={styles.ctaPrimary}>
            Get Started
          </Link>
        </section>

      </main>

      <footer className={styles.footer}>
        <span className={styles.footerBrand}>Collectstory</span>
        <span className={styles.footerMeta}>
          &copy;
          {' '}
          2025
          {' '}
          Dezkareid
        </span>
      </footer>
    </>
  );
}
