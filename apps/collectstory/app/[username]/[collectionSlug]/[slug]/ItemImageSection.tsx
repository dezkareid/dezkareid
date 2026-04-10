'use client';

import { useState, useEffect } from 'react';
import { ViewTransition } from 'react';
import { Button } from '@dezkareid/components/react';
import { CloudinaryImage } from '@/src/shared/ui/CloudinaryImage';
import { UpdateImageForm } from '@/components/UpdateImageForm/UpdateImageForm';
import styles from './page.module.css';

type Properties = {
  itemId: string;
  slug: string;
  imageUrl: string | undefined;
  name: string;
  isOwner: boolean;
  username: string;
  collectionSlug: string;
};

export function ItemImageSection({ itemId, slug, imageUrl, name, isOwner, username, collectionSlug }: Properties) {
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const [editingImage, setEditingImage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setShowSuccess(false), 1500);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  function handleImageUpdated(newUrl: string) {
    setCurrentImageUrl(newUrl);
    setEditingImage(false);
    setShowSuccess(true);
  }

  return (
    <div className={styles['item-page__image']}>
      <div className={`${styles['item-page__image-wrapper']} ${editingImage ? styles['item-page__image-wrapper--editing'] : ''}`}>
        {currentImageUrl
          ? (
              <ViewTransition name={`item-image-${slug}`}>
                <CloudinaryImage
                  src={currentImageUrl}
                  alt={name}
                  sizes="(max-width: 768px) 100vw, 480px"
                  className={styles['item-page__image-media']}
                  priority
                />
              </ViewTransition>
            )
          : (
              <div className={styles['item-page__image-placeholder']} aria-hidden="true">
                <span className={styles['item-page__placeholder-icon']}>◻</span>
              </div>
            )}

        {isOwner && !editingImage && (
          <button
            type="button"
            className={styles['item-page__image-overlay-btn']}
            onClick={() => setEditingImage(true)}
            aria-label={currentImageUrl ? 'Replace image' : 'Add image'}
          >
            {currentImageUrl ? 'Replace image' : 'Add image'}
          </button>
        )}
      </div>

      {isOwner && editingImage && (
        <div className={styles['item-page__owner-actions']}>
          <UpdateImageForm itemId={itemId} username={username} collectionSlug={collectionSlug} onSuccess={handleImageUpdated} />
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
    </div>
  );
}
