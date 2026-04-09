import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ItemLinksManager } from '@/components/ItemLinksManager/ItemLinksManager';
import type { ItemLink, Store } from '@/app/[username]/[collectionSlug]/actions';
import styles from '../page.module.css';

type Properties = {
  itemId: string;
  userId: string;
  linkedStores: Store[];
};

/**
 * Dynamic Server Component — always rendered fresh, never cached.
 * Responsible for owner-only UI: ItemLinksManager and empty-state prompt.
 * Wrapped in <Suspense> on the parent page so it streams in without blocking
 * the cached static shell.
 */
export async function OwnerItemExtras({ itemId, userId, linkedStores }: Properties) {
  // connection() opts this subtree out of static rendering so it is always
  // executed per-request, giving the owner up-to-date data.
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.id !== userId) return;

  const { data: linkRows } = await supabase
    .from('item_links')
    .select('id, item_id, url, label, created_at')
    .eq('item_id', itemId)
    .order('created_at');

  const initialLinks: ItemLink[] = (linkRows ?? []).map(l => ({
    id: l.id,
    item_id: l.item_id,
    url: l.url,
    label: (l.label as string | null) ?? undefined,
    created_at: l.created_at,
  }));

  const hasStores = linkedStores.length > 0;
  const hasLinks = initialLinks.length > 0;

  return (
    <>
      {!hasStores && !hasLinks && (
        <p className={styles.emptyPrompt}>
          Add a link to where this item can be found.
        </p>
      )}
      <ItemLinksManager itemId={itemId} initialLinks={initialLinks} />
    </>
  );
}
