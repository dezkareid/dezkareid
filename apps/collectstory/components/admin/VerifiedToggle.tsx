'use client';

import { useTransition } from 'react';
import { Check } from '@dezkareid/icons/react';
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
              <Check aria-hidden style={{ '--icon-size': '12px' } as React.CSSProperties} />
              {' Verified'}
            </>
          )
        : 'Unverified')}
    </button>
  );
}
