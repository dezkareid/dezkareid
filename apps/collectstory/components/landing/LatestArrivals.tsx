import { ViewTransition } from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card, Image } from '@dezkareid/components/react';
import { getLastArrivals } from '@/lib/collections';
import styles from './LatestArrivals.module.css';

export async function LatestArrivals() {
  const [t, items] = await Promise.all([
    getTranslations('Landing.LatestArrivals'),
    getLastArrivals(),
  ]);

  if (items.length === 0) return;

  return (
    <section className={styles['latest-arrivals']} aria-label={t('aria_label')}>
      <div className={styles['latest-arrivals__container']}>
        <div className={styles['latest-arrivals__header']}>
          <div>
            <h2 className={styles['latest-arrivals__title']}>{t('title')}</h2>
            <p className={styles['latest-arrivals__subtitle']}>{t('subtitle')}</p>
          </div>
        </div>
        <div className={styles['latest-arrivals__grid']} role="list">
          {items.map((item, index) => {
            const label = [item.brand_name, item.line_name].filter(Boolean).join(' · ');
            return (
              <div key={item.id} className={styles['latest-arrivals__item']} role="listitem">
                <Link
                  href={`/${item.username}/${item.collection_slug}/${item.slug}`}
                  className={styles['latest-arrivals__item-link']}
                >
                  <Card elevation="raised" className={styles['latest-arrivals__card']}>
                    <div className={styles['latest-arrivals__image-wrapper']}>
                      {item.image_url
                        ? (
                            <ViewTransition name={`item-image-${item.slug}`}>
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                strategy="cloudinary"
                                sizes="(min-width: 60rem) 25vw, (min-width: 37.5rem) 50vw, 100vw"
                                priority={index === 0}
                                className={styles['latest-arrivals__image']}
                              />
                            </ViewTransition>
                          )
                        : (
                            <div className={styles['latest-arrivals__image-placeholder']} aria-hidden="true">📦</div>
                          )}
                    </div>
                    <div className={styles['latest-arrivals__info']}>
                      <h3 className={styles['latest-arrivals__item-title']}>{item.name}</h3>
                      {label && <p className={styles['latest-arrivals__item-label']}>{label}</p>}
                      <p className={styles['latest-arrivals__item-author']}>
                        {item.avatar_url && (
                          <Image
                            strategy="cloudinary"
                            mode="fixed"
                            src={item.avatar_url}
                            alt={item.username}
                            width={16}
                            height={16}
                            loading="lazy"
                            className={styles['latest-arrivals__avatar']}
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
