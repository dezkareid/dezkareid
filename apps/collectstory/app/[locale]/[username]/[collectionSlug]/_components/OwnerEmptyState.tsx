'use client';

import { useRef } from 'react';
import { AddItemModal, type AddItemModalHandle } from '@/components/AddItemModal/AddItemModal';
import styles from './OwnerEmptyState.module.css';

type Brand = { id: string; name: string };
type Franchise = { id: string; name: string };

type Properties = {
  collectionId: string;
  username: string;
  collectionSlug: string;
  brands: Brand[];
  franchises: Franchise[];
};

export function OwnerEmptyState({ collectionId, username, collectionSlug, brands, franchises }: Properties) {
  const modalRef = useRef<AddItemModalHandle>(null);

  return (
    <div className={styles.container}>
      <AddItemModal ref={modalRef} brands={brands} franchises={franchises} collectionId={collectionId} username={username} collectionSlug={collectionSlug} />
      <p className={styles.title}>Your collection is empty</p>
      <p className={styles.desc}>Add your first item to get started.</p>
      <button
        type="button"
        className={styles.addButton}
        onClick={() => modalRef.current?.open()}
      >
        + Add Item
      </button>
    </div>
  );
}
