import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { CollectionItemCard } from '@/components/CollectionItemCard';
import { AddItemModal } from '@/components/AddItemModal/AddItemModal';
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

const ITEM_SELECT = `
  id,
  name,
  image_url,
  description,
  date_acquired,
  brands ( name ),
  lines ( name ),
  categories ( name )
`;

async function LastAdditions() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from('collection_items')
    .select(ITEM_SELECT)
    .order('created_at', { ascending: false })
    .limit(6);

  const recentItems = (items ?? []) as CollectionItem[];

  if (recentItems.length === 0) return;

  return (
    <section className={styles.lastAdditions}>
      <h2 className={styles.sectionTitle}>Last Additions</h2>
      <ul className={styles.strip} role="list">
        {recentItems.map(item => (
          <li key={item.id} className={styles.stripItem}>
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
    </section>
  );
}

async function AllItems() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from('collection_items')
    .select(ITEM_SELECT)
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

async function AddItemSection() {
  const supabase = await createClient();
  const [{ data: brands }, { data: categories }] = await Promise.all([
    supabase.from('brands').select('id, name').order('name'),
    supabase.from('categories').select('id, name').order('name'),
  ]);

  return (
    <AddItemModal
      brands={(brands ?? []) as { id: string; name: string }[]}
      categories={(categories ?? []) as { id: string; name: string }[]}
    />
  );
}

export default function CollectionPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Collection</h1>
        <Suspense>
          <AddItemSection />
        </Suspense>
      </div>
      <Suspense>
        <LastAdditions />
      </Suspense>
      <Suspense>
        <AllItems />
      </Suspense>
    </div>
  );
}
