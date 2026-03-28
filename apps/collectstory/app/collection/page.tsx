import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { CollectionItemCard } from '@/components/CollectionItemCard';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'My Collection',
  description: 'Your personal collectibles collection.',
};

type CollectionItem = {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  date_acquired: string | null;
  brands: { name: string }[];
  lines: { name: string }[];
  categories: { name: string }[];
};

async function CollectionItems() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from('collection_items')
    .select(`
      id,
      name,
      image_url,
      description,
      date_acquired,
      brands ( name ),
      lines ( name ),
      categories ( name )
    `)
    .order('created_at', { ascending: false });

  const collectionItems = (items ?? []) as CollectionItem[];

  if (collectionItems.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Your collection is empty</p>
        <p className={styles.emptyDesc}>
          Items you add to your collection will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className={styles.grid} role="list">
      {collectionItems.map(item => (
        <li key={item.id}>
          <CollectionItemCard
            name={item.name}
            imageUrl={item.image_url ?? undefined}
            brand={item.brands[0]?.name ?? undefined}
            line={item.lines[0]?.name ?? undefined}
            category={item.categories[0]?.name ?? undefined}
            description={item.description ?? undefined}
            dateAcquired={item.date_acquired ?? undefined}
          />
        </li>
      ))}
    </ul>
  );
}

export default function CollectionPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Collection</h1>
      </div>
      <Suspense>
        <CollectionItems />
      </Suspense>
    </div>
  );
}
