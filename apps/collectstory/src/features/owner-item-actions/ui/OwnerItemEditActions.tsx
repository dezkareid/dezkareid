import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type Properties = {
  username: string;
  collectionSlug: string;
  itemId: string;
  userId: string;
};

const buttonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: 'var(--spacing-8) var(--spacing-16)',
  borderRadius: 'var(--border-radius-medium)',
  fontSize: 'var(--font-size-200)',
  fontWeight: 'var(--font-weight-medium)',
  fontFamily: 'inherit',
  cursor: 'pointer',
  border: '1px solid var(--color-background-secondary)',
  background: 'transparent',
  color: 'var(--color-text-secondary)',
  whiteSpace: 'nowrap' as const,
  textDecoration: 'none',
};

/**
 * Dynamic Server Component — always rendered fresh, never cached.
 * Accepts the item's userId as a prop (already fetched by the parent cached
 * shell) to avoid an extra DB round-trip. Resolves ownership via
 * auth.getUser() server-side and renders the Edit item link only for owners.
 * Wrapped in <Suspense> on the parent page so it streams in without blocking
 * the cached public content shell.
 */
export async function OwnerItemEditActions({ username, collectionSlug, itemId, userId }: Properties) {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) return;

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-8)', paddingTop: 'var(--spacing-8)' }}>
      <a
        href={`/${username}/${collectionSlug}/items/${itemId}/edit`}
        style={buttonStyle}
      >
        Edit item
      </a>
    </div>
  );
}
