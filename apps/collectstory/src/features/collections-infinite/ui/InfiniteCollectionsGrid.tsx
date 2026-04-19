'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CollectionCard } from '@/src/entities/collection';
import { InfiniteScrollSentinel } from '@/src/shared/ui/InfiniteScrollGrid';
import type { PublicCollection } from '@/lib/collections';

type Properties = {
  initialCollections: PublicCollection[];
  totalCount: number;
  username: string;
  collectionCardClassName: string;
  gridClassName: string;
};

async function fetchPage(username: string, page: number): Promise<PublicCollection[]> {
  const parameters = new URLSearchParams({ username, page: String(page) });
  const response = await fetch(`/api/collections?${parameters}`);
  if (!response.ok) return [];
  const json = await response.json() as { collections: PublicCollection[] };
  return json.collections;
}

export function InfiniteCollectionsGrid({
  initialCollections,
  totalCount,
  username,
  collectionCardClassName,
  gridClassName,
}: Properties) {
  const t = useTranslations('Common.profile');
  const [collections, setCollections] = useState<PublicCollection[]>(initialCollections);
  const [page, setPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const hasMore = collections.length < totalCount;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const next = await fetchPage(username, page);
    setCollections(previous => [...previous, ...next]);
    setPage(p => p + 1);
    setIsLoading(false);
  }, [isLoading, hasMore, username, page]);

  return (
    <>
      <div className={gridClassName}>
        {collections.map(col => (
          <Link
            key={col.id}
            href={`/${username}/${col.slug}`}
            className={collectionCardClassName}
          >
            <CollectionCard
              collection={{
                name: col.name,
                description: col.description,
                item_count: col.item_count,
                itemCountLabel: t('items_count', { count: col.item_count }),
              }}
            />
          </Link>
        ))}
      </div>
      <InfiniteScrollSentinel onIntersect={loadMore} isLoading={isLoading} hasMore={hasMore} />
    </>
  );
}
