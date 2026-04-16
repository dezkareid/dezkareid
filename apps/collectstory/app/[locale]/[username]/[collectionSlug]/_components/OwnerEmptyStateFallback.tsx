import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPublicCollectionBySlug, getOwnerCollectionBySlug } from '@/lib/collections';
import { getAllBrands, getAllFranchises } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import { OwnerEmptyState } from './OwnerEmptyState';

type Properties = {
  username: string;
  collectionSlug: string;
};

/**
 * Dynamic Server Component — checks ownership before rendering OwnerEmptyState.
 * Wrapped in <Suspense> on the parent page so it streams in without blocking
 * the cached public content shell. Falls back to owner path for private collections.
 */
export async function OwnerEmptyStateFallback({ username, collectionSlug }: Properties) {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Try public path first; fall back to owner path for private collections.
  const publicResult = await getPublicCollectionBySlug(username, collectionSlug);
  const result = publicResult ?? await getOwnerCollectionBySlug(username, collectionSlug);
  if (!result || user.id !== result.userId) return;

  const [brands, franchises] = await Promise.all([getAllBrands(), getAllFranchises()]);

  return (
    <OwnerEmptyState
      collectionId={result.collection.id}
      username={username}
      collectionSlug={collectionSlug}
      brands={brands}
      franchises={franchises}
    />
  );
}
