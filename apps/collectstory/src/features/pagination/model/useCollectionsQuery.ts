'use client';

import { useQuery } from '@tanstack/react-query';
import type { PublicCollection } from '@/lib/collections';

type CollectionsResult = {
  collections: PublicCollection[];
  total_count: number;
  userId: string;
  avatarUrl: string | undefined;
};

async function fetchCollections(username: string, page: number): Promise<CollectionsResult> {
  const parameters = new URLSearchParams({ username, page: String(page) });
  const response = await fetch(`/api/collections?${parameters}`);
  if (!response.ok) throw new Error('Failed to fetch collections');
  return response.json() as Promise<CollectionsResult>;
}

export function useCollectionsQuery(username: string, page: number) {
  return useQuery({
    queryKey: ['collections', username, page],
    queryFn: () => fetchCollections(username, page),
    staleTime: 60 * 1000,
  });
}
