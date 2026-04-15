'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OPEN_ADD_ITEM_MODAL_EVENT } from '@/src/shared/lib/owner-events';
import { DeleteCollectionModal } from './DeleteCollectionModal';
import styles from './OwnerCollectionActions.module.css';

type Properties = {
  username: string;
  collectionSlug: string;
  collectionId: string;
  collectionName: string;
  itemCount: number;
};

export function OwnerCollectionActionsClient({
  username,
  collectionSlug,
  collectionId,
  collectionName,
  itemCount,
}: Properties) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className={styles.actions}>
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
        onClick={() => globalThis.dispatchEvent(new CustomEvent(OPEN_ADD_ITEM_MODAL_EVENT))}
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
