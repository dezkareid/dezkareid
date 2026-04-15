import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPublicCollectionBySlug } from '@/lib/collections';
import { getAllBrands, getAllFranchises } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import type { OwnerItem } from '../model/types';
import { OwnerItemGrid } from './OwnerItemGrid';

type Properties = {
  username: string;
  collectionSlug: string;
};

/**
 * Dynamic RSC — opts out of caching via connection().
 * Checks if the current user owns the collection. If yes, fetches items
 * fresh (no cache) and renders the interactive OwnerItemGrid. If not,
 * returns null so the cached non-owner grid remains visible.
 */
export async function OwnerItemActions({ username, collectionSlug }: Properties) {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const result = await getPublicCollectionBySlug(username, collectionSlug);
  if (!result || user.id !== result.userId) return;

  const [items, brands, franchises] = await Promise.all([
    // Fetch directly without cache — owner always sees fresh data
    supabase
      .from('collection_items')
      .select(`
        id,
        name,
        slug,
        image_url,
        description,
        date_acquired,
        likes_count,
        lines (
          id,
          name,
          brands ( id, name ),
          categories ( name ),
          variants
        )
      `)
      .eq('collection_id', result.collection.id)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .then(({ data }) => (data ?? []) as unknown as OwnerItem[]),
    getAllBrands(),
    getAllFranchises(),
  ]);

  return (
    <OwnerItemGrid
      initialItems={items}
      collectionId={result.collection.id}
      username={username}
      collectionSlug={collectionSlug}
      brands={brands}
      franchises={franchises}
    />
  );
}
