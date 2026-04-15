import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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

  // Fetch collections fresh — no cache so the owner always sees current counts
  const { data: collections } = await supabase
    .from('collections')
    .select('id, name, slug, description')
    .eq('user_id', user.id)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  if (!collections || collections.length === 0) return;

  // Count public items per collection directly (bypass the cached query)
  const collectionsWithCount = await Promise.all(
    collections.map(async (col) => {
      const { count } = await supabase
        .from('collection_items')
        .select('id', { count: 'exact', head: true })
        .eq('collection_id', col.id)
        .eq('visibility', 'public');
      return {
        id: col.id,
        name: col.name,
        slug: col.slug,
        description: col.description ?? undefined,
        item_count: count ?? 0,
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
        />
      ))}
    </div>
  );
}
