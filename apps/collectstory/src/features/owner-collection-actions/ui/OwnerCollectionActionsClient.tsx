'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCollectionItems } from '@/src/features/owner-item-actions/model/CollectionItemsContext';
import { OPEN_ADD_ITEM_MODAL_EVENT } from '@/src/shared/lib/owner-events';
import { DeleteCollectionModal } from './DeleteCollectionModal';
import styles from './OwnerCollectionActions.module.css';

export function OwnerCollectionActionsClient() {
  const { pageData, ownerItems } = useCollectionItems();
  const { username, collection, isOwner } = pageData;

  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!isOwner) return null;

  return (
    <div className={styles.actions}>
      <DeleteCollectionModal
        open={deleteOpen}
        collectionId={collection.id}
        collectionName={collection.name}
        itemCount={ownerItems.length}
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
      <Link href={`/${username}/${collection.slug}/edit`} className={styles.editLink}>
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
