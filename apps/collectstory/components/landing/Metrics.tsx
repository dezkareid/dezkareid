import { getTranslations } from 'next-intl/server';
import { getGlobalMetrics } from '@/lib/metrics';
import styles from './Metrics.module.css';

export async function Metrics() {
  const t = await getTranslations('Landing.Metrics');
  const metrics = await getGlobalMetrics();

  const displayMetrics = [
    { label: t('total_collections'), value: metrics.total_collections },
    { label: t('total_items'), value: metrics.total_items },
    { label: t('total_users'), value: metrics.total_users },
  ];

  return (
    <section className={styles.metrics}>
      <div className={styles.container}>
        {displayMetrics.map(metric => (
          <div key={metric.label} className={styles.item}>
            <span className={styles.number}>
              {metric.value.toLocaleString()}
            </span>
            <span className={styles.label}>{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
