'use client';

import { useState, useEffect } from 'react';
import { Button } from '@dezkareid/components/react';
import styles from './ConsentBanner.module.css';

/**
 * A lightweight consent banner that lazy loads to minimize performance impact.
 * Controls whether Google Analytics tracking is enabled.
 */
export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or denied
    const consent = localStorage.getItem('ga_consent');

    if (consent === null) {
      // Wait for 3 seconds before showing the banner to ensure site load is fast
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ga_consent', 'true');
    setIsVisible(false);
    // Reload to apply consent (or trigger a custom event if using a more complex state)
    globalThis.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem('ga_consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return;

  return (
    <div className={styles.banner} role="alert" aria-live="polite">
      <div className={styles.content}>
        <p className={styles.text}>
          We use cookies to understand how you use Collecstory and to improve your experience.
        </p>
        <div className={styles.actions}>
          <Button variant="ghost" size="sm" onClick={handleDecline}>
            Decline
          </Button>
          <Button variant="primary" size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
