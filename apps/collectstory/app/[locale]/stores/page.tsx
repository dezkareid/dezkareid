import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cacheLife } from 'next/cache';
import styles from './page.module.css';

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
  slug: string | null;
  url: string | null;
  country: string | null;
  city: string | null;
};

async function getStores() {
  'use cache';
  cacheLife('hours');

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
  const { data } = await supabase
    .from('stores')
    .select('id, name, slug, url, country, city')
    .order('name', { ascending: true });
  return (data ?? []) as Store[];
}

export default async function StoresPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const stores = await getStores();

  return (
    <div className={`container ${styles['stores-page']}`}>
      <div className={styles['stores-page__page-header']}>
        <div className={styles['stores-page__eyebrow']}>
          <span className={styles['stores-page__eyebrow-line']} aria-hidden="true" />
          <span className={styles['stores-page__eyebrow-text']}>Find your next piece</span>
        </div>
        <h1 className={styles['stores-page__title']}>Stores Directory</h1>
        <p className={styles['stores-page__subtitle']}>
          A curated list of collectibles stores and retailers worldwide.
        </p>
      </div>

      {stores.length === 0
        ? (
            <div className={styles['stores-page__empty']}>
              <p className={styles['stores-page__empty-title']}>No stores listed yet</p>
              <p className={styles['stores-page__empty-desc']}>Check back soon as we add more stores.</p>
            </div>
          )
        : (
            <ul className={styles['stores-page__list']} role="list">
              {stores.map(store => (
                <li key={store.id} className={styles['stores-page__store-item']}>
                  <div className={styles['stores-page__store-info']}>
                    <h2 className={styles['stores-page__store-name']}>
                      {store.slug
                        ? (
                            <Link href={`/${locale}/stores/${store.slug}`} className={styles['stores-page__store-name-link']}>
                              {store.name}
                            </Link>
                          )
                        : store.name}
                    </h2>
                    {(store.city || store.country) && (
                      <span className={styles['stores-page__store-location']}>
                        {[store.city, store.country].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                  {store.url && (
                    <a
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles['stores-page__store-link']}
                    >
                      Visit store
                      <span aria-hidden="true"> →</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
    </div>
  );
}
