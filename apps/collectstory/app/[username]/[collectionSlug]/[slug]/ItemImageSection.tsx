'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UpdateImageForm } from '@/components/UpdateImageForm/UpdateImageForm';
import styles from './page.module.css';

type Properties = {
  itemId: string;
  imageUrl: string | undefined;
  name: string;
  isOwner: boolean;
  username: string;
  collectionSlug: string;
};

export function ItemImageSection({ itemId, imageUrl, name, isOwner, username, collectionSlug }: Properties) {
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const [editingImage, setEditingImage] = useState(false);

  function handleImageUpdated(newUrl: string) {
    setCurrentImageUrl(newUrl);
    setEditingImage(false);
  }

  return (
    <div className={styles.imageSection}>
      <div className={styles.imageWrapper}>
        {currentImageUrl
          ? (
              <Image
                src={currentImageUrl}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className={styles.image}
                priority
              />
            )
          : (
              <div className={styles.imagePlaceholder} aria-hidden="true">
                <span className={styles.placeholderIcon}>◻</span>
              </div>
            )}
      </div>

      {isOwner && (
        <div className={styles.ownerActions}>
          {editingImage
            ? (
                <>
                  <UpdateImageForm itemId={itemId} username={username} collectionSlug={collectionSlug} onSuccess={handleImageUpdated} />
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setEditingImage(false)}
                  >
                    Cancel
                  </button>
                </>
              )
            : (
                <button
                  type="button"
                  className={styles.editImageButton}
                  onClick={() => setEditingImage(true)}
                >
                  {currentImageUrl ? 'Replace image' : 'Add image'}
                </button>
              )}
        </div>
      )}
    </div>
  );
}
