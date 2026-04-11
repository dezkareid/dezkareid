import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPublicCollectionBySlug } from '@/lib/collections';
import type { PublicItem } from '@/lib/collections';
import { IHaveThisButton } from '@/src/features/copy-item';

// TODO(feature): consider consolidating NonOwnerItemActions and OwnerCollectionActions
// into a single unified owner-context provider to avoid two separate auth checks per item.

type Properties = {
  username: string;
  collectionSlug: string;
  item: PublicItem;
};

/**
 * Dynamic Server Component — always rendered fresh, never cached.
 * Resolves ownership server-side and renders IHaveThisButton only for
 * non-owners. Wrapped in <Suspense> on the parent page so it streams in
 * without blocking the cached public content shell.
 */
export async function NonOwnerItemActions({ username, collectionSlug, item }: Properties) {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const result = await getPublicCollectionBySlug(username, collectionSlug);
  const isOwner = !!user && !!result && user.id === result.userId;

  if (isOwner) return;

  return <IHaveThisButton item={item} />;
}
