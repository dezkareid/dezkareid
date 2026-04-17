'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Close, ChevronLeft, ChevronRight } from '@dezkareid/icons/react';
import { Image } from '@dezkareid/components/react';
import { LikeButton } from '@/src/features/like-item';
import type { PublicItem } from '@/lib/collections';
import styles from './CollectionExplorerView.module.css';

type Properties = {
  items: PublicItem[];
  username: string;
  collectionSlug: string;
  isAuthenticated: boolean;
  onClose: () => void;
};

export function CollectionExplorerView({ items, isAuthenticated, onClose }: Properties) {
  const t = useTranslations('CollectionExplorer');
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = items[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex(previous => (previous + 1) % items.length);
  }, [items.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(previous => (previous - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') handleNext();
      if (event.key === 'ArrowLeft') handlePrevious();
      if (event.key === 'Escape') onClose();
    };
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const [touchStart, setTouchStart] = useState<number | undefined>(undefined);
  const [touchEnd, setTouchEnd] = useState<number | undefined>(undefined);

  const minSwipeDistance = 50;

  const onTouchStart = (event: React.TouchEvent) => {
    setTouchEnd(undefined);
    setTouchStart(event.targetTouches[0].clientX);
  };

  const onTouchMove = (event: React.TouchEvent) => {
    setTouchEnd(event.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === undefined || touchEnd === undefined) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrevious();
  };

  return createPortal(
    <div
      className={styles.overlay}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button className={styles.closeBtn} onClick={onClose} aria-label={t('close_aria')} type="button">
        <Close />
      </button>

      <div className={styles.content}>
        <button className={styles.navBtn} onClick={handlePrevious} aria-label={t('prev_aria')} type="button">
          <ChevronLeft />
        </button>

        <div className={styles.imageContainer}>
          {currentItem.image_url
            ? (
                <Image
                  src={currentItem.image_url}
                  alt={currentItem.name}
                  strategy="cloudinary"
                  sizes="90vw"
                  className={styles.image}
                  priority
                />
              )
            : (
                <div className={styles.placeholder}>📦</div>
              )}
          <div className={styles.info}>
            <h2 className={styles.name}>{currentItem.name}</h2>
            {currentItem.lines?.name && <p className={styles.line}>{currentItem.lines.name}</p>}

            <div className={styles.actions}>
              <LikeButton
                key={currentItem.id}
                itemId={currentItem.id}
                initialCount={currentItem.likes_count}
                initialLiked={false}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </div>

        <button className={styles.navBtn} onClick={handleNext} aria-label={t('next_aria')} type="button">
          <ChevronRight />
        </button>
      </div>

      <div className={styles.footer}>
        <p>
          {t('counter', { current: currentIndex + 1, total: items.length })}
        </p>
      </div>
    </div>,
    document.body,
  );
}
