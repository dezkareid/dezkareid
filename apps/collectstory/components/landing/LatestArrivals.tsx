'use client';

import * as React from 'react';
import { ViewTransition } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, Image } from '@dezkareid/components/react';
import type { LastArrivalItem } from '@/lib/collections';
import styles from './LatestArrivals.module.css';

export function LatestArrivals() {
  const t = useTranslations('Landing.LatestArrivals');
  const [items, setItems] = React.useState<LastArrivalItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchArrivals() {
      try {
        const response = await fetch('/api/latest-arrivals');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setItems(data);
      }
      catch (error) {
        console.error('Error fetching latest arrivals:', error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchArrivals();
  }, []);

  if (!loading && items.length === 0) {
    return;
  }

  return (
    <section className={styles.latestArrivals} aria-label={t('aria_label')}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </div>
        </div>
        <div className={styles.grid} role="list">
          {loading
            ? ['s1', 's2', 's3', 's4'].map(id => (
              <div key={id} className={styles.item} role="listitem" aria-hidden="true">
                <Card elevation="raised" className={`${styles.card} ${styles.skeletonCard}`}>
                  <div className={styles.imageWrapper} />
                  <div className={styles.info}>
                    <div className={styles.skeletonText} />
                    <div className={styles.skeletonTextSmall} />
                  </div>
                </Card>
              </div>
            ))
            : items.map((item, index) => {
              const label = [item.brand_name, item.line_name].filter(Boolean).join(' · ');
              return (
                <div key={item.id} className={styles.item} role="listitem">
                  <Link
                    href={`/${item.username}/${item.collection_slug}/${item.slug}`}
                    className={styles.itemLink}
                  >
                    <Card elevation="raised" className={styles.card}>
                      <div className={styles.imageWrapper}>
                        {item.image_url
                          ? (
                            <ViewTransition name={`item-image-${item.slug}`}>
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                strategy="cloudinary"
                                sizes="(min-width: 60rem) 25vw, (min-width: 37.5rem) 50vw, 100vw"
                                priority={index === 0}
                                className={styles.image}
                              />
                            </ViewTransition>
                          )
                          : (
                            <div className={styles.placeholderImage} aria-hidden="true">📦</div>
                          )}
                      </div>
                      <div className={styles.info}>
                        <h3 className={styles.itemTitle}>{item.name}</h3>
                        {label && <p className={styles.itemLabel}>{label}</p>}
                        <p className={styles.itemAuthor}>
                          {item.avatar_url && (
                            <Image
                              strategy="cloudinary"
                              mode="fixed"
                              src={item.avatar_url}
                              alt={item.username}
                              width={16}
                              height={16}
                              className={styles.avatar}
                            />
                          )}
                          @
                          {item.username}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
