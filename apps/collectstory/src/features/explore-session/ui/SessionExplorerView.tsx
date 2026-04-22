'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState, useCallback } from 'react';
import { Close, ChevronLeft, ChevronRight } from '@dezkareid/icons/react';
import { Image } from '@dezkareid/components/react';
import { useKeyboardNav, useSwipe } from '@/src/shared/lib/explorer';
import type { SessionPhoto } from '@/lib/sessions';
import styles from './SessionExplorerView.module.css';

type Direction = 'next' | 'prev' | 'initial';

type Properties = {
  photos: SessionPhoto[];
  sessionName: string;
  onClose: () => void;
};

export function SessionExplorerView({ photos, sessionName, onClose }: Properties) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>('initial');

  const handleNext = useCallback(() => {
    setDirection('next');
    setCurrentIndex(previous => (previous + 1) % photos.length);
  }, [photos.length]);

  const handlePrevious = useCallback(() => {
    setDirection('prev');
    setCurrentIndex(previous => (previous - 1 + photos.length) % photos.length);
  }, [photos.length]);

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

  const currentPhoto = photos[currentIndex];
  if (!currentPhoto) return null;

  return createPortal(
    <div className={styles.explorer} {...swipeHandlers} role="dialog" aria-modal="true" aria-label={sessionName}>
      <button className={styles['explorer__close']} onClick={onClose} aria-label="Close explorer" type="button">
        <Close />
      </button>

      <div className={styles['explorer__content']}>
        <button className={styles['explorer__nav']} onClick={handlePrevious} aria-label="Previous photo" type="button">
          <ChevronLeft />
        </button>

        <div key={currentPhoto.id} className={`${styles['explorer__item']} ${directionClassMap[direction]}`}>
          <div className={styles['explorer__image-wrapper']}>
            <Image
              src={currentPhoto.image_url}
              alt={`${sessionName} — photo ${currentIndex + 1}`}
              strategy="cloudinary"
              sizes="(max-width: 768px) 90vw, 60vh"
              className={styles['explorer__image']}
              priority
            />
          </div>
        </div>

        <button className={styles['explorer__nav']} onClick={handleNext} aria-label="Next photo" type="button">
          <ChevronRight />
        </button>
      </div>

      <div className={styles['explorer__footer']}>
        <p aria-live="polite">
          {currentIndex + 1}
          {' '}
          of
          {' '}
          {photos.length}
        </p>
      </div>
    </div>,
    document.body,
  );
}
