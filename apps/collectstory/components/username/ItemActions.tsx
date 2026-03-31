'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Properties = {
  username: string;
  collectionSlug: string;
  itemId: string;
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

export function ItemActions({ username, collectionSlug, itemId }: Properties) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from('collection_items')
        .select('id')
        .eq('id', itemId)
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setIsOwner(true);
        });
    });
  }, [itemId]);

  if (!isOwner) return;

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
