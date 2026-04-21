import Image from 'next/image';
import { VerifiedBadge } from '@dezkareid/components/react-server';
import type { StoreDetail } from '@/lib/stores';
import styles from './StoreHero.module.css';

type Properties = {
  store: StoreDetail;
  verified: string;
  visitStore: string;
};

export function StoreHero({ store, verified, visitStore }: Properties) {
  const location = [store.city, store.country].filter(Boolean).join(', ');

  return (
    <section className={styles['store-hero']} aria-labelledby="store-name-heading">
      {/* Cover — capped height, overlay sits inside */}
      <div className={styles['store-hero__cover']}>
        {store.cover_url
          ? (
              <Image
                src={store.cover_url}
                alt=""
                fill
                priority
                sizes="100vw"
                className={styles['store-hero__cover-image']}
              />
            )
          : (
              <div className={styles['store-hero__cover-placeholder']} aria-hidden="true" />
            )}

        {/* Gradient overlay with identity bar — lives inside the cover */}
        <div className={styles['store-hero__overlay']}>
          <div className={styles['store-hero__inner']}>
            {store.logo_url && (
              <div className={styles['store-hero__logo-wrap']} aria-hidden="true">
                <Image
                  src={store.logo_url}
                  alt={store.name}
                  width={80}
                  height={80}
                  className={styles['store-hero__logo']}
                />
              </div>
            )}

            <div className={styles['store-hero__meta']}>
              <div className={styles['store-hero__name-row']}>
                <h1 id="store-name-heading" className={styles['store-hero__name']}>
                  {store.name}
                </h1>
                {store.verified && (
                  <span className={styles['store-hero__verified']} title={verified}>
                    <VerifiedBadge size={14} />
                    <span className={styles['store-hero__verified-text']}>{verified}</span>
                  </span>
                )}
              </div>
              {location && (
                <p className={styles['store-hero__location']}>{location}</p>
              )}
            </div>

            {store.url && (
              <a
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['store-hero__visit-link']}
              >
                {visitStore}
                <span aria-hidden="true"> ↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
