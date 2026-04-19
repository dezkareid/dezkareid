'use client';

import { useQuery } from '@tanstack/react-query';
import type { PublicItem } from '@/lib/collections';

type ItemsResult = {
  data: PublicItem[];
  total_count: number;
};

async function fetchItems(
  collectionId: string,
  username: string,
  collectionSlug: string,
  page: number,
): Promise<ItemsResult> {
  const parameters = new URLSearchParams({ collectionId, username, collectionSlug, page: String(page) });
  const response = await fetch(`/api/collection-items?${parameters}`);
  if (!response.ok) throw new Error('Failed to fetch items');
  return response.json() as Promise<ItemsResult>;
}

export function useItemsQuery(
  collectionId: string,
  username: string,
  collectionSlug: string,
  page: number,
) {
  return useQuery({
    queryKey: ['items', collectionId, username, collectionSlug, page],
    queryFn: () => fetchItems(collectionId, username, collectionSlug, page),
    staleTime: 60 * 1000,
  });
}
