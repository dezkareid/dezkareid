'use client';

import { useRef } from 'react';

type Options = {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

export function useSwipe({ onSwipeLeft, onSwipeRight }: Options) {
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
