'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { Image } from '@dezkareid/components/react';
import { NonOwnerItemActions } from '@/src/features/non-owner-item-actions';
import { InfiniteScrollSentinel } from '@/src/shared/ui/InfiniteScrollGrid';
import type { PublicItem } from '@/lib/collections';

type Properties = {
  initialItems: PublicItem[];
  totalCount: number;
  collectionId: string;
  username: string;
  collectionSlug: string;
  gridClassName: string;
  itemCardWrapperClassName: string;
  itemCardClassName: string;
  itemImageClassName: string;
  itemImagePlaceholderClassName: string;
  itemNameClassName: string;
  itemLineClassName: string;
  itemActionsClassName: string;
  likeCountClassName: string;
};

async function fetchPage(
  collectionId: string,
  username: string,
  collectionSlug: string,
  page: number,
): Promise<PublicItem[]> {
  const parameters = new URLSearchParams({ collectionId, username, collectionSlug, page: String(page) });
  const response = await fetch(`/api/collection-items?${parameters}`);
  if (!response.ok) return [];
  const json = await response.json() as { data: PublicItem[] };
  return json.data;
}

export function InfiniteItemGrid({
  initialItems,
  totalCount,
  collectionId,
  username,
  collectionSlug,
  gridClassName,
  itemCardWrapperClassName,
  itemCardClassName,
  itemImageClassName,
  itemImagePlaceholderClassName,
  itemNameClassName,
  itemLineClassName,
  itemActionsClassName,
  likeCountClassName,
}: Properties) {
  const [items, setItems] = useState<PublicItem[]>(initialItems);
  const [page, setPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const hasMore = items.length < totalCount;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const next = await fetchPage(collectionId, username, collectionSlug, page);
    setItems(previous => [...previous, ...next]);
    setPage(p => p + 1);
    setIsLoading(false);
  }, [isLoading, hasMore, collectionId, username, collectionSlug, page]);

  return (
    <>
      <div className={gridClassName}>
        {items.map(item => (
          <div key={item.id} className={itemCardWrapperClassName}>
            <Link href={`/${username}/${collectionSlug}/${item.slug}`} className={itemCardClassName}>
              <div className={itemImageClassName}>
                {item.image_url
                  ? (
                      <ViewTransition name={`item-image-${item.slug}`}>
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          strategy="cloudinary"
                          sizes="(max-width: 420px) 100vw, (max-width: 720px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </ViewTransition>
                    )
                  : <div className={itemImagePlaceholderClassName}>📦</div>}
              </div>
              <p className={itemNameClassName}>{item.name}</p>
              <p className={itemLineClassName} aria-hidden={!item.lines?.name}>
                {item.lines?.name ?? '\u00A0'}
              </p>
              {item.likes_count > 0 && (
                <span className={likeCountClassName}>
                  {/* TODO(design-system): needs tokens --color-like-gradient-from and --color-like-gradient-to */}
                  <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <defs>
                      <linearGradient id="like-count-gradient" x1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f6e" />
                        <stop offset="100%" stopColor="#fb923c" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#like-count-gradient)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {item.likes_count}
                </span>
              )}
            </Link>
            <div className={itemActionsClassName}>
              <NonOwnerItemActions item={item} />
            </div>
          </div>
        ))}
      </div>
      <InfiniteScrollSentinel onIntersect={loadMore} isLoading={isLoading} hasMore={hasMore} />
    </>
  );
}
