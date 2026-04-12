'use client';

import { useState, useEffect } from 'react';
import { Button } from '@dezkareid/components/react';
import { UpdateImageForm } from '@/components/UpdateImageForm/UpdateImageForm';
import styles from '../page.module.css';

type Properties = {
  itemId: string;
  isOwner: boolean;
  username: string;
  collectionSlug: string;
  hasImage: boolean;
};

export function OwnerImageActions({
  itemId,
  isOwner,
  username,
  collectionSlug,
  hasImage,
}: Properties) {
  const [editingImage, setEditingImage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setShowSuccess(false), 1500);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  if (!isOwner) return;

  function handleImageUpdated() {
    // When the image is updated, the updateItemImage action will trigger
    // revalidatePath, which will update the props for the image component.
    setEditingImage(false);
    setShowSuccess(true);
  }

  return (
    <>
      {!editingImage && (
        <button
          type="button"
          className={styles['item-page__image-overlay-btn']}
          onClick={() => setEditingImage(true)}
          aria-label={hasImage ? 'Replace image' : 'Add image'}
        >
          {hasImage ? 'Replace image' : 'Add image'}
        </button>
      )}

      {editingImage && (
        <div className={styles['item-page__owner-actions']}>
          <UpdateImageForm
            itemId={itemId}
            username={username}
            collectionSlug={collectionSlug}
            onSuccess={handleImageUpdated}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingImage(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {showSuccess && (
        <p className={styles['item-page__image-feedback']} role="status" aria-live="polite">
          Image updated!
        </p>
      )}
    </>
  );
}
