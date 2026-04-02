'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

type Properties = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CollectionError({ error, reset }: Properties) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.container} role="alert">
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>
        We couldn&rsquo;t load your collection. Please try again.
      </p>
      <button type="button" className={styles.retryButton} onClick={reset}>
        Try again
      </button>
    </div>
  );
}
