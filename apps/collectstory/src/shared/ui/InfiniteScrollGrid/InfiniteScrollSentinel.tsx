'use client';

import { useEffect, useRef } from 'react';
import styles from './InfiniteScrollGrid.module.css';

type Properties = {
  onIntersect: () => void;
  isLoading: boolean;
  hasMore: boolean;
};

export function InfiniteScrollSentinel({ onIntersect, isLoading, hasMore }: Properties) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onIntersect(); },
      { rootMargin: '200px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [onIntersect, isLoading, hasMore]);

  if (!hasMore) return null;

  return (
    <>
      {isLoading && (
        <div className={styles.loader} aria-label="Loading more items">
          <div className={styles.loaderDots} aria-hidden="true">
            <span className={styles.loaderDot} />
            <span className={styles.loaderDot} />
            <span className={styles.loaderDot} />
          </div>
        </div>
      )}
      <div ref={ref} className={styles.sentinel} aria-hidden="true" />
    </>
  );
}
