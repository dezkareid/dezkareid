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

function useKeyboardNav({ onNext, onPrevious, onClose }: { onNext: () => void; onPrevious: () => void; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') onNext();
      if (event.key === 'ArrowLeft') onPrevious();
      if (event.key === 'Escape') onClose();
    };
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrevious, onClose]);
}

function useSwipe({ onSwipeLeft, onSwipeRight }: { onSwipeLeft: () => void; onSwipeRight: () => void }) {
  const touchStartXRef = useRef<number | undefined>(undefined);
  const touchEndXRef = useRef<number | undefined>(undefined);
  const MIN_SWIPE = 50;

  return {
    onTouchStart: (event: React.TouchEvent) => {
      touchStartXRef.current = event.targetTouches[0].clientX;
      touchEndXRef.current = undefined;
    },
    onTouchMove: (event: React.TouchEvent) => {
      touchEndXRef.current = event.targetTouches[0].clientX;
    },
    onTouchEnd: () => {
      if (touchStartXRef.current === undefined || touchEndXRef.current === undefined) return;
      const distance = touchStartXRef.current - touchEndXRef.current;
      if (distance > MIN_SWIPE) onSwipeLeft();
      if (distance < -MIN_SWIPE) onSwipeRight();
    },
  };
}

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

function useEagerItemPages({
  effectiveTotalPages,
  collectionId,
  username,
  collectionSlug,
  onLoaded,
}: {
  effectiveTotalPages: number;
  collectionId: string;
  username: string;
  collectionSlug: string;
  onLoaded: (items: PublicItem[]) => void;
}) {
  const fetchedPagesRef = useRef<Set<number>>(new Set([1]));
  const [isLoading, setIsLoading] = useState(false);

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
      onLoaded(results.flat());
      setIsLoading(false);
    }

    void fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  return isLoading;
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

  // For owners, initialItems already contains all items (from context) — no fetch needed.
  // Also skip fetching if initialItems already covers all items (e.g. < 1 page total).
  const effectiveTotalPages = (isOwner || initialItems.length >= totalItems)
    ? 1
    : Math.ceil(totalItems / DEFAULT_PAGE_SIZE);

  const isLoading = useEagerItemPages({
    effectiveTotalPages,
    collectionId,
    username,
    collectionSlug,
    onLoaded: items => setAllItems(previous => [...previous, ...items]),
  });

  const currentItem = allItems[currentIndex];

  const handleNext = useCallback(() => {
    setDirection('next');
    setCurrentIndex(previous => (previous + 1) % allItems.length);
  }, [allItems.length]);

  const handlePrevious = useCallback(() => {
    setDirection('prev');
    setCurrentIndex(previous => (previous - 1 + allItems.length) % allItems.length);
  }, [allItems.length]);

  useKeyboardNav({ onNext: handleNext, onPrevious: handlePrevious, onClose });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const swipeHandlers = useSwipe({ onSwipeLeft: handleNext, onSwipeRight: handlePrevious });

  const directionClassMap: Record<Direction, string> = {
    next: styles['explorer__item--next'],
    prev: styles['explorer__item--prev'],
    initial: styles['explorer__item--initial'],
  };
  const itemDirectionClass = directionClassMap[direction];

  if (!currentItem) return null;

  return createPortal(
    <div
      className={styles.explorer}
      {...swipeHandlers}
    >
      <button className={styles['explorer__close']} onClick={onClose} aria-label={t('close_aria')} type="button">
        <Close />
      </button>

      <div className={styles['explorer__content']}>
        <button className={styles['explorer__nav']} onClick={handlePrevious} aria-label={t('prev_aria')} type="button">
          <ChevronLeft />
        </button>

        <div key={currentItem.id} className={`${styles['explorer__item']} ${itemDirectionClass}`}>
          <div className={styles['explorer__image-wrapper']}>
            {currentItem.image_url
              ? (
                  <Image
                    src={currentItem.image_url}
                    alt={currentItem.name}
                    strategy="cloudinary"
                    sizes="(max-width: 768px) 90vw, 60vh"
                    className={styles['explorer__image']}
                    priority
                  />
                )
              : (
                  <div className={styles['explorer__placeholder']}>📦</div>
                )}
          </div>
          <div className={styles['explorer__info']}>
            <h2 className={styles['explorer__name']}>{currentItem.name}</h2>
            <p className={styles['explorer__line']} aria-hidden={!currentItem.lines?.name}>
              {currentItem.lines?.name ?? '\u00A0'}
            </p>

            <div className={styles['explorer__actions']}>
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

        <button className={styles['explorer__nav']} onClick={handleNext} aria-label={t('next_aria')} type="button">
          <ChevronRight />
        </button>
      </div>

      <div className={styles['explorer__footer']}>
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
        {isLoading && <div className={styles['explorer__loading-bar']} aria-hidden="true" />}
      </div>
    </div>,
    document.body,
  );
}
