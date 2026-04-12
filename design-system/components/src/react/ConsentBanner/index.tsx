'use client';

import { useState, useEffect } from 'react';
import cx from 'classnames';
import { Button } from '../Button';
import type { ConsentBannerProperties } from '../../shared/types/consent-banner';
import styles from '../../css/consent-banner.module.css';

export function ConsentBanner({
  onAccept,
  onDecline,
  className,
}: ConsentBannerProperties) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or denied
    const consent = localStorage.getItem('ga_consent');

    if (typeof consent !== 'string') {
      // Wait for 3 seconds before showing the banner to ensure site load is fast
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ga_consent', 'true');
    setIsVisible(false);
    onAccept?.();
    // Default behavior as in collectstory
    if (!onAccept) {
      globalThis.location.reload();
    }
  };

  const handleDecline = () => {
    localStorage.setItem('ga_consent', 'false');
    setIsVisible(false);
    onDecline?.();
  };

  if (!isVisible) {
    return;
  }

  return (
    <div className={cx(styles['consent-banner'], className)} role="alert" aria-live="polite">
      <div className={styles['consent-banner__content']}>
        <p className={styles['consent-banner__text']}>
          We use cookies to understand how you use our services and to improve your experience.
        </p>
        <div className={styles['consent-banner__actions']}>
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
