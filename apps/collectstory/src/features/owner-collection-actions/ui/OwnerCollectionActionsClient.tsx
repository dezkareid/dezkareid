'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { AddItemModal, type AddItemModalHandle } from '@/components/AddItemModal/AddItemModal';
import styles from './OwnerCollectionActions.module.css';

type Brand = { id: string; name: string };
type Franchise = { id: string; name: string };

type Properties = {
  username: string;
  collectionSlug: string;
  collectionId: string;
  brands: Brand[];
  franchises: Franchise[];
};

export function OwnerCollectionActionsClient({
  username,
  collectionSlug,
  collectionId,
  brands,
  franchises,
}: Properties) {
  const modalRef = useRef<AddItemModalHandle>(null);

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
