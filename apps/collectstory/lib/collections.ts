import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cacheLife } from 'next/cache';

function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export type PublicCollection = {
  id: string;
  name: string;
  slug: string;
  description: string | undefined;
  item_count: number;
};

export type LineVariant = { value: string; display_name: string };

export type PublicItem = {
  id: string;
  name: string;
  slug: string;
  image_url: string | undefined;
  description: string | undefined;
  date_acquired: string | undefined;
  lines: {
    name: string;
    brands: { name: string } | undefined;
    categories: { name: string } | undefined;
    variants: LineVariant[];
  } | undefined;
};

export type PublicItemDetail = PublicItem & {
  visibility: string;
  user_id: string;
  variant: string | undefined;
  franchises: { name: string; slug: string } | undefined;
};

export type LatestArrival = {
  id: string;
  name: string;
  slug: string;
  image_url: string | undefined;
  author: string;
  category: string | undefined;
  collection_slug: string;
};

export type LastArrivalItem = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  created_at: string;
  collection_id: string;
  collection_slug: string;
  username: string;
  avatar_url: string | null;
  line_name: string | null;
  line_slug: string | null;
  brand_name: string | null;
  brand_slug: string | null;
};

export async function getLatestPublicItems(limit: number = 4): Promise<LatestArrival[]> {
  'use cache';
  cacheLife('hours');
  const supabase = createPublicClient();

  const { data: items } = await supabase
    .from('collection_items')
    .select(`
      id,
      name,
      slug,
      image_url,
      collections (
        slug
      )
    `)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(limit);

  return (items ?? []).map((item: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    collections: { slug: string } | { slug: string }[] | null;
  }) => {
    const collection = Array.isArray(item.collections) ? item.collections[0] : item.collections;

    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      image_url: item.image_url ?? undefined,
      author: 'collector',
      category: undefined,
      collection_slug: collection?.slug ?? 'default',
    };
  });
}

export async function getLastArrivals(): Promise<LastArrivalItem[]> {
  'use cache';
  cacheLife('hours');
  const supabase = createPublicClient();

  const { data } = await supabase
    .from('last_arrivals')
    .select('*');

  return (data ?? []).map(row => ({
    id: row.id ?? '',
    name: row.name ?? '',
    slug: row.slug ?? '',
    image_url: row.image_url ?? null,
    created_at: row.created_at ?? '',
    collection_id: row.collection_id ?? '',
    collection_slug: row.collection_slug ?? '',
    username: row.username ?? '',
    avatar_url: row.avatar_url ?? null,
    line_name: row.line_name ?? null,
    line_slug: row.line_slug ?? null,
    brand_name: row.brand_name ?? null,
    brand_slug: row.brand_slug ?? null,
  }));
}

export async function getCollectionFirstImage(
  collectionId: string,
): Promise<string | undefined> {
  const supabase = createPublicClient();

  const { data: item } = await supabase
    .from('collection_items')
    .select('image_url')
    .eq('collection_id', collectionId)
    .eq('visibility', 'public')
    .not('image_url', 'is', undefined)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return item?.image_url ?? undefined;
}

export async function getPublicCollectionsByUsername(
  username: string,
): Promise<{ collections: PublicCollection[]; userId: string; avatarUrl: string | undefined } | undefined> {
  const supabase = createPublicClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, avatar_url')
    .eq('username', username)
    .single();

  if (!profile) return undefined;

  const { data: collections } = await supabase
    .from('collections')
    .select('id, name, slug, description')
    .eq('user_id', profile.id)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  if (!collections) return { collections: [], userId: profile.id, avatarUrl: profile.avatar_url ?? undefined };

  // Count public items per collection
  const collectionsWithCount = await Promise.all(
    collections.map(async (col) => {
      const { count } = await supabase
        .from('collection_items')
        .select('id', { count: 'exact', head: true })
        .eq('collection_id', col.id)
        .eq('visibility', 'public');
      return { ...col, item_count: count ?? 0, description: col.description ?? undefined };
    }),
  );

  return { collections: collectionsWithCount, userId: profile.id, avatarUrl: profile.avatar_url ?? undefined };
}

export async function getPublicCollectionBySlug(
  username: string,
  collectionSlug: string,
): Promise<{
  collection: { id: string; name: string; slug: string; description: string | undefined };
  userId: string;
} | undefined> {
  const supabase = createPublicClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (!profile) return undefined;

  const { data: collection } = await supabase
    .from('collections')
    .select('id, name, slug, description')
    .eq('user_id', profile.id)
    .eq('slug', collectionSlug)
    .eq('visibility', 'public')
    .single();

  if (!collection) return undefined;

  return {
    collection: { ...collection, description: collection.description ?? undefined },
    userId: profile.id,
  };
}

export async function getPublicItemsInCollection(
  collectionId: string,
): Promise<PublicItem[]> {
  const supabase = createPublicClient();

  const { data: items } = await supabase
    .from('collection_items')
    .select(`
      id,
      name,
      slug,
      image_url,
      description,
      date_acquired,
      lines (
        name,
        brands ( name ),
        categories ( name )
      )
    `)
    .eq('collection_id', collectionId)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  return (items ?? []) as unknown as PublicItem[];
}

export async function getPublicItemBySlug(
  collectionId: string,
  itemSlug: string,
): Promise<PublicItemDetail | undefined> {
  const supabase = createPublicClient();

  const { data: item } = await supabase
    .from('collection_items')
    .select(`
      id,
      name,
      slug,
      image_url,
      description,
      date_acquired,
      visibility,
      user_id,
      variant,
      lines (
        name,
        variants,
        brands ( name ),
        categories ( name )
      ),
      franchises ( name, slug )
    `)
    .eq('collection_id', collectionId)
    .eq('slug', itemSlug)
    .eq('visibility', 'public')
    .single();

  if (!item) return undefined;

  return item as unknown as PublicItemDetail;
}
