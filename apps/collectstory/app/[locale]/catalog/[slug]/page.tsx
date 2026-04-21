import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Suspense } from 'react';
import type { WithContext, Thing } from 'schema-dts';
import { createAdminClient } from '@/lib/supabase/admin';
import type { CatalogImage } from '@/lib/supabase/types';
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
  item: { name: string; description: string | null; image_url: string | null; images: CatalogImage[]; slug: string },
  stores: StoreRow[],
  baseUrl: string,
): WithContext<Thing> {
  const allImageUrls = [
    ...(item.image_url ? [item.image_url] : []),
    ...item.images.map(img => img.src),
  ];
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'Product' as const,
    'name': item.name,
    'description': item.description ?? undefined,
    'image': allImageUrls.length === 1
      ? allImageUrls[0]
      : (allImageUrls.length > 1 ? allImageUrls : undefined),
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
  // Use admin client — generateMetadata runs at build time for static params,
  // where cookie-based createClient() is not available.
  const supabase = createAdminClient();
  const { data: item } = await supabase
    .from('catalog_items')
    .select('name, description, image_url, images')
    .eq('slug', slug)
    .single();

  if (!item) return {};

  const extraImages = Array.isArray(item.images) ? (item.images as CatalogImage[]) : [];
  const ogImages = [
    ...(item.image_url ? [{ url: item.image_url }] : []),
    ...extraImages.map(img => ({ url: img.src })),
  ];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  return {
    title: `${item.name} — Catalog — Collectstory`,
    description: item.description ?? `${item.name} collectible — find where to buy it on Collectstory.`,
    alternates: { canonical: `${baseUrl}/catalog/${slug}` },
    openGraph: {
      title: `${item.name} — Collectstory Catalog`,
      description: item.description ?? `${item.name} collectible on Collectstory.`,
      images: ogImages,
    },
  };
}

async function fetchCatalogItem(slug: string) {
  const supabase = createAdminClient();
  const { data: item } = await supabase
    .from('catalog_items')
    .select(`
      id,
      name,
      slug,
      description,
      image_url,
      images,
      franchises ( id, name, slug ),
      lines ( id, name )
    `)
    .eq('slug', slug)
    .single();

  if (!item) notFound();

  const { data: catalogStoreRows } = await supabase
    .from('catalog_item_stores')
    .select('stores ( id, name, city, country, url )')
    .eq('catalog_item_id', item.id);

  const stores = (catalogStoreRows ?? []).flatMap((row: unknown) => {
    const storeRow = extractStore(row);
    return storeRow ? [storeRow] : [];
  });

  return { item, stores };
}

async function CatalogItemContent({ slug }: { slug: string }) {
  const { item, stores } = await fetchCatalogItem(slug);

  const franchise = Array.isArray(item.franchises) ? item.franchises[0] : item.franchises;
  const line = Array.isArray(item.lines) ? item.lines[0] : item.lines;
  const extraImages = Array.isArray(item.images) ? (item.images as CatalogImage[]) : [];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const productSchema = buildProductSchema({ ...item, images: extraImages }, stores, baseUrl);

  return (
    <>
      <DataSchema schema={productSchema} id="product-schema" />
      <div className={styles.layout}>
        <div className={styles['catalog-detail__gallery']}>
          {item.image_url
            ? (
                <div className={styles.imageWrapper}>
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={600}
                    height={600}
                    className={styles.image}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )
            : (
                <div className={styles.imageWrapper}>
                  <div className={styles.imagePlaceholder} aria-hidden="true">📦</div>
                </div>
              )}
          {extraImages.length > 0 && (
            <div className={styles['catalog-detail__gallery-thumbnails']} role="list" aria-label="Additional images">
              {extraImages.map((img, index) => (
                <div key={img.src} className={styles['catalog-detail__gallery-thumb']} role="listitem">
                  <Image
                    src={img.src}
                    alt={img.alt || `${item.name} image ${index + 2}`}
                    width={120}
                    height={120}
                    className={styles['catalog-detail__gallery-thumb-img']}
                    sizes="120px"
                  />
                </div>
              ))}
            </div>
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
    </>
  );
}

export default async function CatalogItemDetailPage({ params }: Properties) {
  const { slug } = await params;
  return (
    <div className={styles.page}>
      <Suspense fallback={undefined}>
        <CatalogItemContent slug={slug} />
      </Suspense>
    </div>
  );
}
