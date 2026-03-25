import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SiteHeader } from '@/components/SiteHeader';
import styles from './page.module.css';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Stores Directory',
  description:
    'Browse a curated directory of collectibles stores and locations worldwide. Find where to buy S.H. Figuarts, action figures, and more.',
  openGraph: {
    title: 'Stores Directory — Collectstory',
    description: 'Find collectibles stores and locations worldwide.',
    type: 'website',
  },
};

type Store = {
  id: string;
  name: string;
  url: string | null;
  country: string | null;
  city: string | null;
};

export default async function StoresPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('stores')
    .select('id, name, url, country, city')
    .order('name', { ascending: true });

  const stores = (data ?? []) as Store[];

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} aria-hidden="true" />
            <span className={styles.eyebrowText}>Find your next piece</span>
          </div>
          <h1 className={styles.title}>Stores Directory</h1>
          <p className={styles.subtitle}>
            A curated list of collectibles stores and retailers worldwide.
          </p>
        </div>

        {stores.length === 0
          ? (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>No stores listed yet</p>
                <p className={styles.emptyDesc}>Check back soon as we add more stores.</p>
              </div>
            )
          : (
              <ul className={styles.list} role="list">
                {stores.map(store => (
                  <li key={store.id} className={styles.storeItem}>
                    <div className={styles.storeInfo}>
                      <h2 className={styles.storeName}>{store.name}</h2>
                      {(store.city || store.country) && (
                        <span className={styles.storeLocation}>
                          {[store.city, store.country].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </div>
                    {store.url && (
                      <a
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.storeLink}
                      >
                        Visit store
                        <span aria-hidden="true"> →</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
      </main>
    </>
  );
}
