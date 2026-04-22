import { useTranslations } from 'next-intl';
import styles from './EmptyState.module.css';

export function EmptyState() {
  const t = useTranslations('Catalog.stores.empty');

  return (
    <div className={styles.container}>
      <div className={styles.icon} aria-hidden="true">🏜️</div>
      <h2 className={styles.title}>{t('title')}</h2>
      <p className={styles.message}>
        {t('description')}
      </p>
    </div>
  );
}
