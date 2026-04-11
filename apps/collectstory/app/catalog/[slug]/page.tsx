import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { WithContext, Thing } from 'schema-dts';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { DataSchema } from '@/src/shared/ui/DataSchema';
import { WhereToBuy } from '@/src/features/where-to-buy';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ slug: string }>;
};

interface StoreRow {
  id: string;
  name: string;
  city: string | null;
  country: string | null;
  url: string | null;
}

function extractStore(row: unknown): StoreRow | undefined {
  const s = (row as { stores: StoreRow | null }).stores;
  return s ?? undefined;
}

function buildProductSchema(
  item: { name: string; description: string | null; image_url: string | null; slug: string },
  stores: StoreRow[],
  baseUrl: string,
): WithContext<Thing> {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'Product' as const,
    'name': item.name,
    'description': item.description ?? undefined,
    'image': item.image_url ?? undefined,
    'url': `${baseUrl}/catalog/${item.slug}`,
    'offers': stores
      .filter(s => s.url)
      .map(s => ({
        '@type': 'Offer' as const,
        'url': s.url,
        'seller': { '@type': 'Organization' as const, 'name': s.name },
      })),
  } as WithContext<Thing>;
}

export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('catalog_items').select('slug');
  const slugs = (data ?? []).map(item => ({ slug: item.slug }));
  // cacheComponents requires at least one result; return a placeholder if the
  // catalog is empty at build time so the build doesn't fail.
  return slugs.length > 0 ? slugs : [{ slug: '_placeholder' }];
}

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from('catalog_items')
    .select('name, description, image_url')
    .eq('slug', slug)
    .single();

  if (!item) return {};

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  return {
    title: `${item.name} — Catalog — Collectstory`,
    description: item.description ?? `${item.name} collectible — find where to buy it on Collectstory.`,
    alternates: { canonical: `${baseUrl}/catalog/${slug}` },
    openGraph: {
      title: `${item.name} — Collectstory Catalog`,
      description: item.description ?? `${item.name} collectible on Collectstory.`,
      images: item.image_url ? [{ url: item.image_url }] : [],
    },
  };
}

export default async function CatalogItemDetailPage({ params }: Properties) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from('catalog_items')
    .select(`
      id,
      name,
      slug,
      description,
      image_url,
      franchises ( id, name, slug ),
      lines ( id, name )
    `)
    .eq('slug', slug)
    .single();

  if (!item) notFound();

  // Fetch catalog stores for this item
  const { data: catalogStoreRows } = await supabase
    .from('catalog_item_stores')
    .select('stores ( id, name, city, country, url )')
    .eq('catalog_item_id', item.id);

  const stores = (catalogStoreRows ?? []).flatMap((row: unknown) => {
    const s = extractStore(row);
    return s ? [s] : [];
  });

  const franchise = Array.isArray(item.franchises) ? item.franchises[0] : item.franchises;
  const line = Array.isArray(item.lines) ? item.lines[0] : item.lines;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const productSchema = buildProductSchema(item, stores, baseUrl);

  return (
    <>
      <DataSchema schema={productSchema} id="product-schema" />
      <div className={styles.page}>
        <div className={styles.layout}>
          <div className={styles.imageWrapper}>
            {item.image_url
              ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={600}
                    height={600}
                    className={styles.image}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )
              : (
                  <div className={styles.imagePlaceholder} aria-hidden="true">📦</div>
                )}
          </div>

          <div className={styles.details}>
            <div className={styles.tags}>
              {franchise && (
                <span className={styles.tag}>{franchise.name}</span>
              )}
              {line && (
                <span className={styles.tag}>{line.name}</span>
              )}
            </div>

            <h1 className={styles.name}>{item.name}</h1>

            {item.description && (
              <p className={styles.description}>{item.description}</p>
            )}

            {stores.length > 0 && (
              <div className={styles.stores}>
                <WhereToBuy stores={stores} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
