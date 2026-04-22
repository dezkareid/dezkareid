import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import type { CatalogImage } from '@/lib/supabase/types';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { CatalogItemHeader } from './ui/CatalogItemHeader';
import { StoreCard } from './ui/StoreCard';
import { EmptyState } from './ui/EmptyState';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ slug: string; locale: string }>;
};

interface StoreWithProductUrl {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  logo_url: string | null;
  product_url: string | null;
}

interface CatalogItemWithImages {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  images: CatalogImage[] | null;
}

interface CatalogStoreRow {
  product_url: string | null;
  stores: {
    id: string;
    name: string;
    city: string | null;
    country: string | null;
    logo_url: string | null;
    slug: string;
  };
}

async function fetchCatalogItemWithStores(slug: string): Promise<{ item: CatalogItemWithImages; stores: StoreWithProductUrl[] }> {
  const supabase = createAdminClient();
  const { data: item } = await supabase
    .from('catalog_items')
    .select(`
      id,
      name,
      slug,
      description,
      image_url,
      images
    `)
    .eq('slug', slug)
    .single();

  if (!item) notFound();

  const { data: catalogStoreRows } = await supabase
    .from('catalog_item_stores')
    .select('product_url, stores ( id, name, city, country, logo_url, slug )')
    .eq('catalog_item_id', item.id);

  const stores = (catalogStoreRows as unknown as CatalogStoreRow[] ?? []).map(row => ({
    id: row.stores.id,
    name: row.stores.name,
    slug: row.stores.slug,
    city: row.stores.city,
    logo_url: row.stores.logo_url,
    product_url: row.product_url,
  }));

  return { item: item as unknown as CatalogItemWithImages, stores };
}

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations('Catalog.stores.metadata');
  const supabase = createAdminClient();
  const { data: item } = await supabase
    .from('catalog_items')
    .select('name, description')
    .eq('slug', slug)
    .single();

  if (!item) return {};

  return {
    title: t('title', { itemName: item.name }),
    description: t('description', { itemName: item.name }),
  };
}

export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('catalog_items').select('slug');
  return (data ?? []).map(item => ({ slug: item.slug }));
}

async function StoresListContent({ slug, locale }: { slug: string; locale: string }) {
  const { item, stores } = await fetchCatalogItemWithStores(slug);
  const t = await getTranslations('Catalog.stores');

  return (
    <div className={styles.page}>
      <CatalogItemHeader item={item} />

      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{t('title')}</h2>

        {stores.length === 0
          ? (
              <EmptyState />
            )
          : (
              <div className={styles.list}>
                {stores.map(store => (
                  <StoreCard key={store.id} store={store} locale={locale} />
                ))}
              </div>
            )}
      </div>
    </div>
  );
}

export default async function CatalogItemStoresPage({ params }: Properties) {
  const { slug, locale } = await params;
  const t = await getTranslations('Catalog.stores');

  return (
    <Suspense fallback={<div className={styles.loading}>{t('loading')}</div>}>
      <StoresListContent slug={slug} locale={locale} />
    </Suspense>
  );
}
