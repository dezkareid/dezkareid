'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Properties = {
  username: string;
  collectionId: string;
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

export function CollectionActions({ username, collectionSlug }: Properties) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.username === username) setIsOwner(true);
        });
    });
  }, [username]);

  if (!isOwner) return;

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
