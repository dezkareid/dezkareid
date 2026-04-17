'use client';

import { useEffect } from 'react';
import type { CollectionAuthData } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import { useCollectionItems } from '@/src/features/owner-item-actions/model/CollectionItemsContext';

export function AuthDataSetter({ authData }: { authData: CollectionAuthData }) {
  const { setAuthData } = useCollectionItems();

  useEffect(() => {
    setAuthData(authData);
  }, []);

  return null;
}
