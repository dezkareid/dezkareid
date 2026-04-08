'use client';

import { useState } from 'react';
import { QuickStartForm } from './QuickStartForm';
import styles from './OnboardingEmptyState.module.css';

type OnboardingEmptyStateProperties = {
  username: string;
};

export function OnboardingEmptyState({ username }: OnboardingEmptyStateProperties) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className={styles['onboarding-empty']}>
      <div className={styles['onboarding-empty__illustration']} aria-hidden="true">
        <svg
          width="180"
          height="160"
          viewBox="0 0 180 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles['onboarding-empty__svg']}
        >
          {/* Shelf board */}
          <rect x="10" y="120" width="160" height="10" rx="3" fill="currentColor" opacity="0.15" />
          {/* Bracket left */}
          <rect x="18" y="100" width="6" height="22" rx="2" fill="currentColor" opacity="0.12" />
          {/* Bracket right */}
          <rect x="156" y="100" width="6" height="22" rx="2" fill="currentColor" opacity="0.12" />

          {/* Book 1 — tall */}
          <rect x="30" y="72" width="22" height="48" rx="2" fill="currentColor" opacity="0.2" />
          <rect x="32" y="76" width="18" height="3" rx="1" fill="currentColor" opacity="0.35" />
          <rect x="32" y="82" width="12" height="2" rx="1" fill="currentColor" opacity="0.2" />

          {/* Book 2 — short, accent */}
          <rect x="56" y="88" width="18" height="32" rx="2" fill="currentColor" opacity="0.35" />
          <rect x="58" y="92" width="14" height="2" rx="1" fill="currentColor" opacity="0.5" />

          {/* Book 3 — medium */}
          <rect x="78" y="80" width="20" height="40" rx="2" fill="currentColor" opacity="0.15" />
          <rect x="80" y="85" width="16" height="2" rx="1" fill="currentColor" opacity="0.3" />

          {/* Small object — box */}
          <rect x="102" y="100" width="24" height="20" rx="2" fill="currentColor" opacity="0.22" />
          <rect x="102" y="108" width="24" height="2" fill="currentColor" opacity="0.1" />
          <rect x="112" y="100" width="4" height="20" fill="currentColor" opacity="0.08" />

          {/* Small figurine */}
          <circle cx="146" cy="107" r="7" fill="currentColor" opacity="0.2" />
          <rect x="142" y="114" width="8" height="6" rx="1" fill="currentColor" opacity="0.2" />

          {/* Floating sparkles */}
          <circle cx="90" cy="38" r="3" fill="currentColor" opacity="0.25" className={styles['onboarding-empty__dot--1']} />
          <circle cx="60" cy="52" r="2" fill="currentColor" opacity="0.18" className={styles['onboarding-empty__dot--2']} />
          <circle cx="124" cy="45" r="2.5" fill="currentColor" opacity="0.2" className={styles['onboarding-empty__dot--3']} />

          {/* Plus sign in center-top */}
          <line x1="90" y1="10" x2="90" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
          <line x1="82" y1="18" x2="98" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
        </svg>
      </div>

      <div className={styles['onboarding-empty__body']}>
        <h2 className={styles['onboarding-empty__headline']}>Start your first collection</h2>
        <p className={styles['onboarding-empty__subline']}>
          Every great collection starts with a single item. Add yours and watch it grow.
        </p>

        <button
          type="button"
          className={styles['onboarding-empty__cta']}
          onClick={() => setIsFormOpen(true)}
        >
          Add your first item
        </button>
      </div>

      {isFormOpen && (
        <QuickStartForm
          username={username}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
