'use client';

import { useEffect, useRef } from 'react';
import styles from './Toast.module.css';

interface ToastProperties {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProperties) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && ref.current) {
      ref.current.focus();
    }
  }, [visible]);

  if (!visible) return;

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={-1}
      className={styles.toast}
    >
      {message}
    </div>
  );
}
