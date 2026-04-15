import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPublicCollectionsByUsername } from '@/lib/collections';
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
 */
export async function OwnerProfileGrid({ username }: Properties) {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const result = await getPublicCollectionsByUsername(username);
  if (!result || user.id !== result.userId) return;
  if (result.collections.length === 0) return;

  return (
    <div className={styles.ownerGrid}>
      {result.collections.map(col => (
        <OwnerProfileCollectionCard
          key={col.id}
          collection={col}
          username={username}
        />
      ))}
    </div>
  );
}
