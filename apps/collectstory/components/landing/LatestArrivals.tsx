'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Tag } from '@dezkareid/components/react';
import { ChevronLeft, ChevronRight } from '@dezkareid/icons/react';
import type { LatestArrival } from '@/lib/collections';
import styles from './LatestArrivals.module.css';

export function LatestArrivals() {
  const [items, setItems] = React.useState<LatestArrival[]>([]);
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
    return; // Don't show the section if no items
  }

  return (
    <section className={styles.latestArrivals}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Latest Arrivals</h2>
            <p className={styles.subtitle}>Discover what the community is adding to their vaults today.</p>
          </div>
          <div className={styles.controls}>
            <button className={styles.controlBtn} aria-label="Previous">
              <ChevronLeft aria-hidden />
            </button>
            <button className={styles.controlBtn} aria-label="Next">
              <ChevronRight aria-hidden />
            </button>
          </div>
        </div>
        <div className={styles.grid}>
          {loading
            ? ['s1', 's2', 's3', 's4'].map(id => (
                <div key={id} className={styles.item}>
                  <Card elevation="raised" className={`${styles.card} ${styles.skeletonCard}`}>

                    <div className={styles.imageWrapper} />
                    <div className={styles.info}>
                      <div className={styles.skeletonText} />
                      <div className={styles.skeletonTextSmall} />
                    </div>
                  </Card>
                </div>
              ))
            : items.map((item, index) => (
                <div key={item.id} className={styles.item}>
                  <Link href={`/${item.author}/${item.collection_slug}/${item.slug}`} className={styles.itemLink}>
                    <Card elevation="raised" className={styles.card}>
                      <div className={styles.imageWrapper}>
                        {item.image_url
                          ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                sizes="(min-width: 60rem) 25vw, (min-width: 37.5rem) 50vw, 100vw"
                                loading={index === 0 ? 'eager' : undefined}
                                className={styles.image}
                              />
                            )
                          : (
                              <div className={styles.placeholderImage}>📦</div>
                            )}
                        {item.category && <Tag className={styles.tag}>{item.category}</Tag>}
                      </div>
                      <div className={styles.info}>
                        <h3 className={styles.itemTitle}>{item.name}</h3>
                        <p className={styles.itemAuthor}>
                          Added by
                          {' '}
                          @
                          {item.author}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
