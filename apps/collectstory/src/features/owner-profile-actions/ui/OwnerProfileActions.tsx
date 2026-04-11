import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPublicCollectionsByUsername } from '@/lib/collections';
import { CreateCollectionModal } from '@/components/CreateCollectionModal/CreateCollectionModal';

type Properties = {
  username: string;
};

/**
 * Dynamic Server Component — always rendered fresh, never cached.
 * Resolves ownership server-side and renders the Create Collection button
 * only for the profile owner. Wrapped in <Suspense> on the parent page so
 * it streams in without blocking the cached public content shell.
 */
export async function OwnerProfileActions({ username }: Properties) {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const result = await getPublicCollectionsByUsername(username);
  if (!result || user.id !== result.userId) return;

  return <CreateCollectionModal username={username} />;
}
