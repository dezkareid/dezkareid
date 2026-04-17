'use client';

import { Button } from '@dezkareid/components/react';
import { Shelves } from '@dezkareid/icons/react';
import { useState } from 'react';
import { CollectionExplorerView } from './CollectionExplorerView';
import type { PublicItem } from '@/lib/collections';

type Properties = {
  items: PublicItem[];
  username: string;
  collectionSlug: string;
  isAuthenticated: boolean;
};

export function ExploreButton({ items, username, collectionSlug, isAuthenticated }: Properties) {
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) return;

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(true)}
        icon={<Shelves />}
      >
        Explore Collection
      </Button>

      {isOpen && (
        <CollectionExplorerView
          items={items}
          username={username}
          collectionSlug={collectionSlug}
          isAuthenticated={isAuthenticated}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
