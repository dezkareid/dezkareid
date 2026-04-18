import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrivateBadge } from '@/src/shared/ui/PrivateBadge';
import { OwnerProfileCollectionCard } from './OwnerProfileCollectionCard';
import styles from './OwnerProfileActions.module.css';

type Properties = {
  username: string;
};

/**
 * Dynamic RSC — opts out of caching via connection().
 * Renders the owner-aware collection grid (with delete buttons) only for
 * the authenticated owner. Returns null for visitors so the cached public
 * grid remains visible.
 *
 * Fetches directly from Supabase (no 'use cache') so the owner always
 * sees up-to-date item counts and collection list.
 */
export async function OwnerProfileGrid({ username }: Properties) {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Verify the authenticated user owns this profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (!profile || user.id !== profile.id) return;

  // Fetch all collections (public + private) fresh — owner always sees current state
  const { data: collections } = await supabase
    .from('collections')
    .select('id, name, slug, description, visibility')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!collections || collections.length === 0) return;

  // Count all items (public + private) per collection so the owner sees the real total
  const collectionsWithCount = await Promise.all(
    collections.map(async (col) => {
      const { count } = await supabase
        .from('collection_items')
        .select('id', { count: 'exact', head: true })
        .eq('collection_id', col.id);
      return {
        id: col.id,
        name: col.name,
        slug: col.slug,
        description: col.description ?? undefined,
        item_count: count ?? 0,
        visibility: col.visibility as string,
      };
    }),
  );

  return (
    <div className={styles.ownerGrid}>
      {collectionsWithCount.map(col => (
        <OwnerProfileCollectionCard
          key={col.id}
          collection={col}
          username={username}
          privateBadge={col.visibility === 'public' ? undefined : <PrivateBadge />}
        />
      ))}
    </div>
  );
}
