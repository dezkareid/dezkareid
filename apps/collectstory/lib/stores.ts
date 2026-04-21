import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cacheLife, cacheTag } from 'next/cache';

function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export type StoreDetail = {
  id: string;
  name: string;
  slug: string;
  url: string | null;
  city: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  verified: boolean;
  visible: boolean;
  cover_url: string | null;
  logo_url: string | null;
  address: string | null;
  google_place_id: string | null;
};

export type StoreDetailItem = {
  catalog_item_id: string;
  name: string;
  slug: string;
  image_url: string | null;
  product_url: string | null;
  franchise: { name: string; slug: string } | null;
};

export async function getAllStoreSlugs(): Promise<string[]> {
  'use cache';
  cacheLife('hours');

  const supabase = createPublicClient();
  const { data } = await supabase
    .from('stores')
    .select('slug')
    .eq('visible', true)
    .not('slug', 'is', null);

  return (data ?? []).map(row => row.slug).filter(Boolean) as string[];
}

export async function getStoreBySlug(slug: string): Promise<StoreDetail | null> {
  'use cache';
  cacheLife('hours');
  cacheTag(`store-${slug}`);

  const supabase = createPublicClient();
  const { data } = await supabase
    .from('stores')
    .select('id, name, slug, url, city, country, lat, lng, verified, visible, cover_url, logo_url, address, google_place_id')
    .eq('slug', slug)
    .single();

  return data ?? null;
}

export async function getStoreItems(storeId: string, slug: string): Promise<StoreDetailItem[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(`store-${slug}`);

  const supabase = createPublicClient();
  const { data } = await supabase
    .from('catalog_item_stores')
    .select('catalog_item_id, product_url, catalog_items ( name, slug, image_url, franchises ( name, slug ) )')
    .eq('store_id', storeId);

  return (data ?? []).map((row) => {
    const item = row.catalog_items as unknown as {
      name: string;
      slug: string;
      image_url: string | null;
      franchises: { name: string; slug: string } | null;
    } | null;

    if (!item) return null;

    return {
      catalog_item_id: row.catalog_item_id,
      name: item.name,
      slug: item.slug,
      image_url: item.image_url,
      product_url: row.product_url,
      franchise: item.franchises ?? null,
    };
  }).filter((item): item is StoreDetailItem => item !== null);
}
