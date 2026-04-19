'use client';

import { useCollectionItems } from '@/src/features/owner-item-actions/model/CollectionItemsContext';
import { OwnerEmptyState } from './OwnerEmptyState';

export function OwnerEmptyStateFallback() {
  const { pageData } = useCollectionItems();
  const { username, collection, isOwner, ownerData } = pageData;

  if (!isOwner || !ownerData) return null;

  return (
    <OwnerEmptyState
      collectionId={collection.id}
      username={username}
      collectionSlug={collection.slug}
      brands={ownerData.brands}
      franchises={ownerData.franchises}
    />
  );
}
