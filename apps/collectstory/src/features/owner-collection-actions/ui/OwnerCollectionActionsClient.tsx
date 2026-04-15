'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { AddItemModal, type AddItemModalHandle } from '@/components/AddItemModal/AddItemModal';
import { DeleteCollectionModal } from './DeleteCollectionModal';
import styles from './OwnerCollectionActions.module.css';

type Brand = { id: string; name: string };
type Franchise = { id: string; name: string };

type Properties = {
  username: string;
  collectionSlug: string;
  collectionId: string;
  collectionName: string;
  itemCount: number;
  brands: Brand[];
  franchises: Franchise[];
};

export function OwnerCollectionActionsClient({
  username,
  collectionSlug,
  collectionId,
  collectionName,
  itemCount,
  brands,
  franchises,
}: Properties) {
  const modalRef = useRef<AddItemModalHandle>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className={styles.actions}>
      <AddItemModal
        ref={modalRef}
        brands={brands}
        franchises={franchises}
        collectionId={collectionId}
        username={username}
        collectionSlug={collectionSlug}
      />
      <DeleteCollectionModal
        open={deleteOpen}
        collectionId={collectionId}
        collectionName={collectionName}
        itemCount={itemCount}
        username={username}
        onClose={() => setDeleteOpen(false)}
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
      <button
        type="button"
        className={styles.deleteButton}
        onClick={() => setDeleteOpen(true)}
      >
        Delete
      </button>
    </div>
  );
}
