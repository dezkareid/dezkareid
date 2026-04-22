'use client';

import { useLocale } from 'next-intl';
import type { PublicItem } from '@/lib/collections';
import { useCollectionItems } from '@/src/features/owner-item-actions/model/CollectionItemsContext';
import { IHaveThisButton } from '@/src/features/copy-item';
import { BuyButton } from '@/src/features/where-to-buy/ui/BuyButton';

type Properties = {
  item: PublicItem;
};

export function NonOwnerItemActions({ item }: Properties) {
  const locale = useLocale();
  const { pageData } = useCollectionItems();
  const { isAuthenticated, isOwner } = pageData;

  const catalogSlug = item.catalog_items?.slug;

  if (isOwner) return null;

  return (
    <>
      {catalogSlug && <BuyButton catalogSlug={catalogSlug} locale={locale} />}
      {isAuthenticated && <IHaveThisButton item={item} />}
    </>
  );
}
