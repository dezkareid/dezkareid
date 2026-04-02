'use client';

import { useTransition } from 'react';
import styles from './verified-toggle.module.css';

interface VerifiedToggleProperties {
  id: string;
  verified: boolean;
  toggleAction: (id: string, verified: boolean) => Promise<void>;
}

export function VerifiedToggle({ id, verified, toggleAction }: VerifiedToggleProperties) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await toggleAction(id, !verified);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={verified ? styles.buttonVerified : styles.button}
      aria-label={verified ? `Remove verified status` : `Mark as verified`}
      aria-pressed={verified}
    >
      {pending && '…'}
      {!pending && (verified
        ? (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="7" cy="7" r="7" fill="currentColor" opacity="0.2" />
                <path
                  d="M4 7l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {' Verified'}
            </>
          )
        : 'Unverified')}
    </button>
  );
}
