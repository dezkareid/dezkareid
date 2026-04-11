'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { AddItemModal, type AddItemModalHandle } from '@/components/AddItemModal/AddItemModal';
import styles from './CollectionActions.module.css';

type Brand = { id: string; name: string };
type Franchise = { id: string; name: string };

type Properties = {
  username: string;
  collectionId: string;
  collectionSlug: string;
  brands: Brand[];
  franchises: Franchise[];
};

export function CollectionActions({ username, collectionId, collectionSlug, brands, franchises }: Properties) {
  const [isOwner, setIsOwner] = useState(false);
  const modalRef = useRef<AddItemModalHandle>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.username === username) setIsOwner(true);
        });
    });
  }, [username]);

  if (!isOwner) return;

  return (
    <div className={styles.actions}>
      <AddItemModal
        ref={modalRef}
        brands={brands}
        franchises={franchises}
        collectionId={collectionId}
      />
      <button
        type="button"
        className={styles.addButton}
        onClick={() => modalRef.current?.open()}
      >
        + Add Item
      </button>
      <Link
        href={`/${username}/${collectionSlug}/edit`}
        className={styles.editLink}
      >
        Edit
      </Link>
    </div>
  );
}
