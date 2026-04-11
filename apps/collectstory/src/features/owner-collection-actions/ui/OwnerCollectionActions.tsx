import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPublicCollectionBySlug } from '@/lib/collections';

type Properties = {
  username: string;
  collectionSlug: string;
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
  whiteSpace: 'nowrap' as const,
  textDecoration: 'none',
};

/**
 * Dynamic Server Component — always rendered fresh, never cached.
 * Resolves ownership server-side and renders Add Item + Edit links
 * only for the collection owner. Wrapped in <Suspense> on the parent page
 * so it streams in without blocking the cached public content shell.
 */
export async function OwnerCollectionActions({ username, collectionSlug }: Properties) {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const result = await getPublicCollectionBySlug(username, collectionSlug);
  if (!result || user.id !== result.userId) return;

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-8)', alignItems: 'center' }}>
      <a
        href={`/${username}/${collectionSlug}/items/new`}
        style={{
          ...buttonStyle,
          background: 'var(--color-primary)',
          color: 'var(--color-text-inverse)',
          border: 'none',
        }}
      >
        + Add Item
      </a>
      <a
        href={`/${username}/${collectionSlug}/edit`}
        style={{
          ...buttonStyle,
          background: 'transparent',
          color: 'var(--color-text-secondary)',
        }}
      >
        Edit
      </a>
    </div>
  );
}
