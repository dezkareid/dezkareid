'use client';

import { useTranslations } from 'next-intl';
import styles from './PrivateBadge.module.css';

/**
 * Client component version of the overlay PrivateBadge.
 * Use this inside client components (e.g. OwnerItemCard) where
 * getTranslations (server-only) is not available.
 * The parent container must have `position: relative`.
 */
export function PrivateBadgeOverlay() {
  const t = useTranslations('Common');
  return (
    <span
      className={`${styles.badge} ${styles['badge--overlay']}`}
      aria-label={t('private_badge.aria_label')}
    >
      {t('private_badge.label')}
    </span>
  );
}
