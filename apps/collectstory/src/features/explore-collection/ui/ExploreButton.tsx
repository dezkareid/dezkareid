'use client';

import { useState } from 'react';
import { Button } from '@dezkareid/components/react';
import { Shelves } from '@dezkareid/icons/react';
import { useTranslations } from 'next-intl';
import { useCollectionItems } from '@/src/features/owner-item-actions/model/CollectionItemsContext';
import { CollectionExplorerView } from './CollectionExplorerView';
import type { PublicItem, LineVariant } from '@/lib/collections';

export function ExploreButton() {
  const t = useTranslations('CollectionExplorer');
  const [isOpen, setIsOpen] = useState(false);

  const { pageData, ownerItems } = useCollectionItems();
  const { username, collection, isAuthenticated, isOwner } = pageData;

  const items: PublicItem[] = isOwner
    ? ownerItems.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        image_url: item.image_url ?? undefined,
        description: item.description ?? undefined,
        date_acquired: item.date_acquired ?? undefined,
        likes_count: item.likes_count,
        lines: item.lines
          ? {
              id: item.lines.id,
              name: item.lines.name,
              brands: item.lines.brands ?? undefined,
              categories: item.lines.categories ?? undefined,
              variants: item.lines.variants as LineVariant[],
            }
          : undefined,
      }))
    : pageData.items;

  if (items.length === 0) return null;

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        <Shelves style={{ marginRight: 'var(--spacing-8)' }} />
        {t('explore_button')}
      </Button>

      {isOpen && (
        <CollectionExplorerView
          items={items}
          username={username}
          collectionSlug={collection.slug}
          isAuthenticated={isAuthenticated}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
