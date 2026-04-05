import type { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { getAllPublicFranchises } from '@/lib/franchises';
import styles from './page.module.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Franchise Catalog — Collectstory',
  description:
    'Browse all collectible franchises on Collectstory — from Dragon Ball and Naruto to Saint Seiya and beyond. Find figures by the IP series you love.',
  openGraph: {
    title: 'Franchise Catalog — Collectstory',
    description: 'Find collectible figures by franchise.',
    type: 'website',
  },
};

async function FranchiseGrid() {
  const franchises = await getAllPublicFranchises();

  if (franchises.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No franchises yet</p>
        <p className={styles.emptyDesc}>The catalog is being built — check back soon.</p>
      </div>
    );
  }

  return (
    <ul className={styles.grid} role="list">
      {franchises.map(franchise => (
        <li key={franchise.id}>
          <Link href={`/franchises/${franchise.slug}`} className={styles.card}>
            <div className={styles.cardCover}>
              <Image
                src={franchise.image_url}
                alt={franchise.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1080px) 33vw, 360px"
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.cardName}>{franchise.name}</h2>
              {franchise.localized_names.length > 0 && (
                <ul className={styles.cardAliases} aria-label="Also known as">
                  {franchise.localized_names.map(ln => (
                    <li key={ln.id} className={styles.cardAlias}>
                      {ln.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function FranchisesPage() {
  return (
    <>
      <Suspense>
        <SiteHeader />
      </Suspense>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} aria-hidden="true" />
            <span className={styles.eyebrowText}>Franchise Catalog</span>
          </div>
          <h1 className={styles.title}>Browse by Franchise</h1>
          <p className={styles.subtitle}>
            Explore figures and collectibles organized by the IP series they belong to.
          </p>
        </div>
        <Suspense>
          <FranchiseGrid />
        </Suspense>
      </main>
    </>
  );
}
