import { cacheLife, cacheTag } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

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
    id: string;
    name: string;
    brands: { id: string; name: string } | undefined;
    categories: { name: string } | undefined;
    variants: LineVariant[];
  } | undefined;
};

export type PublicItemDetail = PublicItem & {
  visibility: string;
  user_id: string;
  variant: string | undefined;
  line_id?: string;
  franchise_id?: string;
  franchises: { id: string; name: string; slug: string } | undefined;
};

// i18n note: when a `locale` parameter is added, it must be a named function argument
// (not derived from headers/cookies) so it becomes part of the 'use cache' cache key.
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
  image_url: string | undefined;
  created_at: string;
  collection_id: string;
  collection_slug: string;
  username: string;
  avatar_url: string | undefined;
  line_name: string | undefined;
  line_slug: string | undefined;
  brand_name: string | undefined;
  brand_slug: string | undefined;
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

type LastArrivalRow = Record<keyof LastArrivalItem, string | null | undefined>;

function mapLastArrivalRowCore(row: LastArrivalRow) {
  return {
    id: row.id ?? '',
    name: row.name ?? '',
    slug: row.slug ?? '',
    created_at: row.created_at ?? '',
    collection_id: row.collection_id ?? '',
    collection_slug: row.collection_slug ?? '',
    username: row.username ?? '',
  };
}

function mapLastArrivalRowOptionals(row: LastArrivalRow) {
  return {
    image_url: row.image_url ?? undefined,
    avatar_url: row.avatar_url ?? undefined,
    line_name: row.line_name ?? undefined,
    line_slug: row.line_slug ?? undefined,
    brand_name: row.brand_name ?? undefined,
    brand_slug: row.brand_slug ?? undefined,
  };
}

export async function getLastArrivals(): Promise<LastArrivalItem[]> {
  'use cache';
  cacheLife('hours');
  const supabase = createPublicClient();

  const { data } = await supabase
    .from('last_arrivals')
    .select('*');

  return (data ?? []).map(row => ({ ...mapLastArrivalRowCore(row), ...mapLastArrivalRowOptionals(row) }));
}

export async function getCollectionFirstImage(
  collectionId: string,
): Promise<string | undefined> {
  'use cache';
  cacheLife('user-content');
  cacheTag(`collection-first-image:${collectionId}`);
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

// i18n note: when a `locale` parameter is added, it must be a named function argument
// (not derived from headers/cookies) so it becomes part of the 'use cache' cache key.
export async function getPublicCollectionsByUsername(
  username: string,
): Promise<{ collections: PublicCollection[]; userId: string; avatarUrl: string | undefined } | undefined> {
  'use cache';
  cacheLife('user-content');
  cacheTag(`profile:${username}`);
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

// i18n note: when a `locale` parameter is added, it must be a named function argument
// (not derived from headers/cookies) so it becomes part of the 'use cache' cache key.
export async function getPublicCollectionBySlug(
  username: string,
  collectionSlug: string,
): Promise<{
  collection: { id: string; name: string; slug: string; description: string | undefined };
  userId: string;
} | undefined> {
  'use cache';
  cacheLife('user-content');
  cacheTag(`collection:${username}:${collectionSlug}`);
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

// i18n note: when a `locale` parameter is added, it must be a named function argument
// (not derived from headers/cookies) so it becomes part of the 'use cache' cache key.
export async function getPublicItemsInCollection(
  collectionId: string,
  username: string,
  collectionSlug: string,
): Promise<PublicItem[]> {
  'use cache';
  cacheLife('user-content');
  // Tag with both the slug-based key (for revalidation by Server Actions) and
  // the UUID-based key (for internal cross-references if needed).
  cacheTag(`collection:${username}:${collectionSlug}`);
  cacheTag(`collection-items:${collectionId}`);
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
        id,
        name,
        brands ( id, name ),
        categories ( name )
      )
    `)
    .eq('collection_id', collectionId)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  return (items ?? []) as unknown as PublicItem[];
}

// i18n note: when a `locale` parameter is added, it must be a named function argument
// (not derived from headers/cookies) so it becomes part of the 'use cache' cache key.
export async function getPublicItemBySlug(
  collectionId: string,
  itemSlug: string,
  username: string,
  collectionSlug: string,
): Promise<PublicItemDetail | undefined> {
  'use cache';
  cacheLife('user-content');
  cacheTag(`item:${username}:${collectionSlug}:${itemSlug}`);
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
      line_id,
      franchise_id,
      lines (
        id,
        name,
        variants,
        brands ( id, name ),
        categories ( name )
      ),
      franchises ( id, name, slug )
    `)
    .eq('collection_id', collectionId)
    .eq('slug', itemSlug)
    .eq('visibility', 'public')
    .single();

  if (!item) return undefined;

  return item as unknown as PublicItemDetail;
}
