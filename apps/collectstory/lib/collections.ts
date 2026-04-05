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
  } | undefined;
};

export type PublicItemDetail = PublicItem & {
  visibility: string;
  user_id: string;
  franchises: { name: string; slug: string } | undefined;
};

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
      lines (
        name,
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
