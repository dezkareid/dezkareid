import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPublicCollectionBySlug, getOwnerCollectionBySlug } from '@/lib/collections';
import { OwnerCollectionActionsClient } from './OwnerCollectionActionsClient';

type Properties = {
  username: string;
  collectionSlug: string;
};

/**
 * Dynamic RSC — opts out of caching via connection().
 * Resolves ownership server-side and renders the client action buttons
 * only for the authenticated owner. Wrapped in <Suspense> on the parent
 * page so it streams in without blocking the cached public content shell.
 * Falls back to getOwnerCollectionBySlug for private collections.
 */
export async function OwnerCollectionActions({ username, collectionSlug }: Properties) {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Try public path first; fall back to owner path for private collections.
  const publicResult = await getPublicCollectionBySlug(username, collectionSlug);
  const result = publicResult ?? await getOwnerCollectionBySlug(username, collectionSlug);
  if (!result || user.id !== result.userId) return;

  const { count: itemCount } = await supabase
    .from('collection_items')
    .select('id', { count: 'exact', head: true })
    .eq('collection_id', result.collection.id);

  return (
    <OwnerCollectionActionsClient
      username={username}
      collectionSlug={collectionSlug}
      collectionId={result.collection.id}
      collectionName={result.collection.name}
      itemCount={itemCount ?? 0}
    />
  );
}
