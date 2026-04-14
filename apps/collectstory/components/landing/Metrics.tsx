'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import type { GlobalMetrics } from '@/lib/metrics';
import styles from './Metrics.module.css';

export function Metrics() {
  const t = useTranslations('Landing.Metrics');
  const [metrics, setMetrics] = React.useState<GlobalMetrics>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/metrics');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setMetrics(data);
      }
      catch (error) {
        console.error('Error fetching metrics:', error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  const displayItems = [
    { label: t('total_collections'), value: metrics?.total_collections ?? 0 },
    { label: t('total_items'), value: metrics?.total_items ?? 0 },
    { label: t('total_users'), value: metrics?.total_users ?? 0 },
  ];

  return (
    <section className={styles.metrics}>
      <div className={styles.container}>
        {displayItems.map(item => (
          <div key={item.label} className={styles.item}>
            {loading
              ? <div className={styles.skeletonNumber} aria-hidden="true" />
              : (
                  <span className={styles.number}>
                    {item.value.toLocaleString()}
                  </span>
                )}
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
