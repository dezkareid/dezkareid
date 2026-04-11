'use client';

import { useImperativeHandle, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AddItemForm } from '@/components/AddItemForm/AddItemForm';
import styles from './AddItemModal.module.css';

type Brand = { id: string; name: string };
type Franchise = { id: string; name: string };

type Properties = {
  brands: Brand[];
  franchises: Franchise[];
  collectionId: string;
};

export type AddItemModalHandle = {
  open: () => void;
};

export const AddItemModal = function AddItemModal({ ref, brands, franchises, collectionId }: Properties & { ref?: React.RefObject<AddItemModalHandle | null> }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    open() {
      dialogRef.current?.showModal();
    },
  }));

  function close() {
    dialogRef.current?.close();
  }

  function handleSuccess() {
    close();
    router.refresh();
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-modal="true"
      aria-labelledby="add-item-dialog-title"
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 id="add-item-dialog-title" className={styles.title}>Add to Collection</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={close}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className={styles.body}>
          <AddItemForm
            brands={brands}
            franchises={franchises}
            collectionId={collectionId}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </dialog>
  );
};
