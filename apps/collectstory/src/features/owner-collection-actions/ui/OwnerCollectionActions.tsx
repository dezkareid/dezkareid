import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPublicCollectionBySlug } from '@/lib/collections';
import { getAllBrands, getAllFranchises } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import { OwnerCollectionActionsClient } from './OwnerCollectionActionsClient';

type Properties = {
  username: string;
  collectionSlug: string;
};

/**
 * Dynamic Server Component — always rendered fresh, never cached.
 * Resolves ownership and fetches brands/franchises server-side, then
 * renders the modal-based client UI only for the collection owner.
 * Wrapped in <Suspense> on the parent page so it streams in without
 * blocking the cached public content shell.
 */
export async function OwnerCollectionActions({ username, collectionSlug }: Properties) {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const result = await getPublicCollectionBySlug(username, collectionSlug);
  if (!result || user.id !== result.userId) return;

  const [brands, franchises, itemCountResult] = await Promise.all([
    getAllBrands(),
    getAllFranchises(),
    supabase
      .from('collection_items')
      .select('id', { count: 'exact', head: true })
      .eq('collection_id', result.collection.id),
  ]);
  const itemCount = itemCountResult.count ?? 0;

  return (
    <OwnerCollectionActionsClient
      username={username}
      collectionSlug={collectionSlug}
      collectionId={result.collection.id}
      collectionName={result.collection.name}
      itemCount={itemCount}
      brands={brands}
      franchises={franchises}
    />
  );
}
