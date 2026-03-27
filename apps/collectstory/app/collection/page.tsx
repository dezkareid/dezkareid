import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CollectionItemCard } from '@/components/CollectionItemCard';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

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
  brands: { name: string } | null;
  lines: { name: string } | null;
  categories: { name: string } | null;
};

export default async function CollectionPage() {
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

  const collectionItems = (items ?? []) as unknown as CollectionItem[];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Collection</h1>
        <span className={styles.itemCount}>
          {collectionItems.length}
          {' '}
          {collectionItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {collectionItems.length === 0
        ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>Your collection is empty</p>
              <p className={styles.emptyDesc}>
                Items you add to your collection will appear here.
              </p>
            </div>
          )
        : (
            <ul className={styles.grid} role="list">
              {collectionItems.map(item => (
                <li key={item.id}>
                  <CollectionItemCard
                    name={item.name}
                    imageUrl={item.image_url ?? undefined}
                    brand={item.brands?.name ?? undefined}
                    line={item.lines?.name ?? undefined}
                    category={item.categories?.name ?? undefined}
                    description={item.description ?? undefined}
                    dateAcquired={item.date_acquired ?? undefined}
                  />
                </li>
              ))}
            </ul>
          )}
    </div>
  );
}
