'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Close, ChevronLeft, ChevronRight } from '@dezkareid/icons/react';
import { Image } from '@dezkareid/components/react';
import { LikeButton } from '@/src/features/like-item';
import { DEFAULT_PAGE_SIZE } from '@/src/shared/lib/pagination/range';
import type { PublicItem } from '@/lib/collections';
import styles from './CollectionExplorerView.module.css';

type Direction = 'next' | 'prev' | 'initial';

type Properties = {
  items: PublicItem[];
  totalItems: number;
  collectionId: string;
  username: string;
  collectionSlug: string;
  isAuthenticated: boolean;
  isOwner: boolean;
  onClose: () => void;
};

async function fetchItemsPage(
  collectionId: string,
  username: string,
  collectionSlug: string,
  page: number,
): Promise<PublicItem[]> {
  const parameters = new URLSearchParams({ collectionId, username, collectionSlug, page: String(page) });
  const response = await fetch(`/api/collection-items?${parameters}`);
  if (!response.ok) return [];
  const json = await response.json() as { data: PublicItem[] };
  return json.data;
}

export function CollectionExplorerView({
  items: initialItems,
  totalItems,
  collectionId,
  username,
  collectionSlug,
  isAuthenticated,
  isOwner,
  onClose,
}: Properties) {
  const t = useTranslations('CollectionExplorer');
  const [allItems, setAllItems] = useState<PublicItem[]>(initialItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const fetchedPagesRef = useRef<Set<number>>(new Set([1]));
  // For owners, initialItems already contains all items (from context) — no fetch needed.
  // Also skip fetching if initialItems already covers all items (e.g. < 1 page total).
  const effectiveTotalPages = (isOwner || initialItems.length >= totalItems)
    ? 1
    : Math.ceil(totalItems / DEFAULT_PAGE_SIZE);

  // Eagerly fetch remaining pages for visitors when there are more than one page
  useEffect(() => {
    if (effectiveTotalPages <= 1) return;

    let cancelled = false;

    async function fetchAll() {
      setIsLoading(true);
      const pageNumbers = Array.from({ length: effectiveTotalPages - 1 }, (_, index) => index + 2);
      const results = await Promise.all(
        pageNumbers.map(p => fetchItemsPage(collectionId, username, collectionSlug, p)),
      );
      if (cancelled) return;
      for (const p of pageNumbers) fetchedPagesRef.current.add(p);
      setAllItems(previous => [...previous, ...results.flat()]);
      setIsLoading(false);
    }

    void fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const currentItem = allItems[currentIndex];

  const handleNext = useCallback(() => {
    setDirection('next');
    setCurrentIndex(previous => (previous + 1) % allItems.length);
  }, [allItems.length]);

  const handlePrevious = useCallback(() => {
    setDirection('prev');
    setCurrentIndex(previous => (previous - 1 + allItems.length) % allItems.length);
  }, [allItems.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') handleNext();
      if (event.key === 'ArrowLeft') handlePrevious();
      if (event.key === 'Escape') onClose();
    };
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, onClose]);

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
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrevious();
  };

  const directionClass = direction === 'next'
    ? styles['imageContainer--next']
    : (direction === 'prev'
        ? styles['imageContainer--prev']
        : styles['imageContainer--initial']);

  if (!currentItem) return null;

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

        <div key={currentItem.id} className={`${styles.imageContainer} ${directionClass}`}>
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
          {t('counter', { current: currentIndex + 1, total: allItems.length })}
          {isLoading && allItems.length < totalItems && (
            <span>
              {' '}
              /
              {totalItems}
            </span>
          )}
        </p>
        {isLoading && <div className={styles.loadingBar} aria-hidden="true" />}
      </div>
    </div>,
    document.body,
  );
}
