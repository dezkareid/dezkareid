import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import type { WithContext, Thing } from 'schema-dts';
import { createClient } from '@/lib/supabase/server';
import { getSessionAndRole } from '@/lib/auth/role';
import { DataSchema } from '@/src/shared/ui/DataSchema';
import { CatalogItemCard } from '@/src/entities/catalog-item';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Catalog — Collectstory',
  description: 'Browse the complete catalog of collectible items and find where to buy them.',
};

const itemListSchema = (baseUrl: string, items: { name: string; slug: string; image_url: string | null }[]): WithContext<Thing> => ({
  '@context': 'https://schema.org' as const,
  '@type': 'ItemList' as const,
  'name': 'Collectstory Catalog',
  'url': `${baseUrl}/catalog`,
  'numberOfItems': items.length,
  'itemListElement': items.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.name,
    'url': `${baseUrl}/catalog/${item.slug}`,
    'image': item.image_url ?? undefined,
  })),
});

async function AdminNewItemLink() {
  const session = await getSessionAndRole();
  if (session?.role !== 'admin') return;
  return (
    <Link href="/admin/catalog-items/new" className={styles.newButton}>
      + New Item
    </Link>
  );
}

async function CatalogGrid() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('catalog_items')
    .select(`
      id,
      name,
      slug,
      image_url,
      franchises ( name ),
      lines ( name )
    `)
    .order('name');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const schema = itemListSchema(baseUrl, items ?? []);

  return (
    <>
      <DataSchema schema={schema} id="catalog-schema" />
      {items && items.length > 0
        ? (
            <div className={styles.grid}>
              {items.map((item) => {
                const franchise = Array.isArray(item.franchises) ? item.franchises[0] : item.franchises;
                const line = Array.isArray(item.lines) ? item.lines[0] : item.lines;
                return (
                  <CatalogItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    slug={item.slug}
                    image_url={item.image_url}
                    franchise_name={franchise?.name}
                    line_name={line?.name}
                  />
                );
              })}
            </div>
          )
        : (
            <p className={styles.empty}>No catalog items yet. Check back soon.</p>
          )}
    </>
  );
}

export default function CatalogPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.heading}>Catalog</h1>
          <Suspense fallback={undefined}>
            <AdminNewItemLink />
          </Suspense>
        </div>
        <p className={styles.description}>
          Browse the complete catalog of collectible items and find stores where you can buy them.
        </p>
      </header>

      <Suspense fallback={undefined}>
        <CatalogGrid />
      </Suspense>
    </div>
  );
}
