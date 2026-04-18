import { getTranslations } from 'next-intl/server';
import styles from './PrivateBadge.module.css';

/**
 * Server component — renders a "Private" pill badge.
 * The parent container must have `position: relative` for the badge to
 * position correctly when used in overlay mode (via the `overlay` prop).
 */
export async function PrivateBadge({ overlay = false }: { overlay?: boolean }) {
  const t = await getTranslations('Common');
  return (
    <span
      className={`${styles.badge} ${overlay ? styles['badge--overlay'] : ''}`}
      aria-label={t('private_badge.aria_label')}
    >
      {t('private_badge.label')}
    </span>
  );
}
