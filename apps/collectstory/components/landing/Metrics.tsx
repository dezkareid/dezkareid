import { getTranslations } from 'next-intl/server';
import { getGlobalMetrics } from '@/lib/metrics';
import styles from './Metrics.module.css';

export async function Metrics() {
  const t = await getTranslations('Landing.Metrics');
  const metrics = await getGlobalMetrics();

  const displayItems = [
    { label: t('total_collections'), value: metrics.total_collections },
    { label: t('total_items'), value: metrics.total_items },
    { label: t('total_users'), value: metrics.total_users },
  ];

  return (
    <section className={styles.metrics}>
      <div className={styles.container}>
        {displayItems.map(item => (
          <div key={item.label} className={styles.item}>
            <span className={styles.number}>
              {item.value.toLocaleString()}
            </span>
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MetricsSkeleton() {
  return (
    <div className={styles.metrics}>
      <div className={styles.container}>
        {[1, 2, 3].map(index => (
          <div key={index} className={styles.item}>
            <div className={styles.skeletonNumber} aria-hidden="true" />
            <div className={styles.skeletonLabel} aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}
