'use client';

import { createContext, use, useState, useCallback, type ReactNode } from 'react';
import type { CollectionPageData, CollectionAuthData, CollectionOwnerItem } from '@/app/[locale]/[username]/[collectionSlug]/actions';

type CollectionItemsContextValue = {
  pageData: CollectionPageData;
  ownerItems: CollectionOwnerItem[];
  addItems: (incoming: CollectionOwnerItem[]) => void;
  removeItem: (itemId: string) => void;
  rollbackTo: (snapshot: CollectionOwnerItem[]) => void;
  setAuthData: (auth: CollectionAuthData) => void;
};

const CollectionItemsContext = createContext<CollectionItemsContextValue | null>(null);

export function CollectionItemsProvider({
  pageData: initialPageData,
  children,
}: {
  pageData: CollectionPageData;
  children: ReactNode;
}) {
  const [pageData, setPageData] = useState<CollectionPageData>(initialPageData);
  const [ownerItems, setOwnerItems] = useState<CollectionOwnerItem[]>([]);

  const setAuthData = useCallback((auth: CollectionAuthData) => {
    setPageData(previous => ({ ...previous, ...auth }));
    setOwnerItems(auth.ownerData?.items ?? []);
  }, []);

  const addItems = useCallback((incoming: CollectionOwnerItem[]) => {
    setOwnerItems((previous) => {
      const map = new Map(previous.map(item => [item.id, item]));
      for (const item of incoming) map.set(item.id, item);
      const updatedPrevious = previous.map(item => map.get(item.id) ?? item);
      const newItems = incoming.filter(item => !previous.some(existingItem => existingItem.id === item.id));
      return [...newItems, ...updatedPrevious];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setOwnerItems(previous => previous.filter(item => item.id !== itemId));
  }, []);

  const rollbackTo = useCallback((snapshot: CollectionOwnerItem[]) => {
    setOwnerItems(snapshot);
  }, []);

  return (
    <CollectionItemsContext value={{ pageData, ownerItems, addItems, removeItem, rollbackTo, setAuthData }}>
      {children}
    </CollectionItemsContext>
  );
}

export function useCollectionItems(): CollectionItemsContextValue {
  const context = use(CollectionItemsContext);
  if (!context) throw new Error('useCollectionItems must be used inside CollectionItemsProvider');
  return context;
}
