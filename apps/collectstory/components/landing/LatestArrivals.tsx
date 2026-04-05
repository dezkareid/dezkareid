import Image from 'next/image';
import { Card, Tag } from '@dezkareid/components/react-server';
import { ChevronLeft, ChevronRight } from '@dezkareid/icons/react';
import { latestArrivals } from '@/lib/mock-data';
import styles from './LatestArrivals.module.css';

export function LatestArrivals() {
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
          {latestArrivals.map((item, index) => (
            <div key={item.title} className={styles.item}>
              <Card elevation="raised" className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 60rem) 25vw, (min-width: 37.5rem) 50vw, 100vw"
                    loading={index === 0 ? 'eager' : undefined}
                    className={styles.image}
                  />
                  <Tag className={styles.tag}>{item.category}</Tag>
                </div>
                <div className={styles.info}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemAuthor}>
                    Added by
                    {item.author}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
