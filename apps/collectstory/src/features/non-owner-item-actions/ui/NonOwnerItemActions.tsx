'use client';

import type { PublicItem } from '@/lib/collections';
import { useCollectionItems } from '@/src/features/owner-item-actions/model/CollectionItemsContext';
import { IHaveThisButton } from '@/src/features/copy-item';

type Properties = {
  item: PublicItem;
};

export function NonOwnerItemActions({ item }: Properties) {
  const { pageData } = useCollectionItems();
  const { isAuthenticated, isOwner } = pageData;

  if (!isAuthenticated || isOwner) return null;

  return <IHaveThisButton item={item} />;
}
