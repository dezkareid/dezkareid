import { StoreHero, StoreItemCard } from '@/src/entities/store';
import { StoreMapToggle, StoreReviewsEmbed } from '@/src/features/store-map';
import type { StoreDetail, StoreDetailItem } from '@/lib/stores';
import styles from './StoreDetailWidget.module.css';

export type StorePageStrings = {
  verified: string;
  visitStore: string;
  availableItems: string;
  noItemsListed: string;
  location: string;
  showMap: string;
  hideMap: string;
  reviews: string;
  viewReviews: string;
};

type Properties = {
  store: StoreDetail;
  items: StoreDetailItem[];
  locale: string;
  strings: StorePageStrings;
};

export function StoreDetailWidget({ store, items, locale, strings }: Properties) {
  const hasMap = store.lat !== null && store.lng !== null;
  const hasReviews = Boolean(store.google_place_id);
  const hasBento = hasMap || hasReviews;

  return (
    <article className={styles['store-detail']}>
      {/* Hero — full bleed, handles its own container */}
      <StoreHero
        store={store}
        verified={strings.verified}
        visitStore={strings.visitStore}
      />

      {/* Catalog items — elevated background strip */}
      <section className={styles['store-detail__items-section']} aria-labelledby="items-heading">
        <div className={styles['store-detail__container']}>
          <h2 id="items-heading" className={styles['store-detail__section-title']}>
            {strings.availableItems}
            {items.length > 0 && (
              <span className={styles['store-detail__item-count']}>{items.length}</span>
            )}
          </h2>

          {items.length > 0
            ? (
                <div className={styles['store-detail__items-scroll']} role="list" aria-label={strings.availableItems}>
                  {items.map(item => (
                    <div key={item.catalog_item_id} role="listitem">
                      <StoreItemCard item={item} locale={locale} />
                    </div>
                  ))}
                </div>
              )
            : (
                <p className={styles['store-detail__empty-state']}>{strings.noItemsListed}</p>
              )}
        </div>
      </section>

      {/* Location + Reviews bento */}
      {hasBento && (
        <section className={styles['store-detail__bento-section']}>
          <div className={styles['store-detail__container']}>
            <div className={styles['store-detail__bento-grid']}>
              {hasMap && (
                <div className={styles['store-detail__bento-card']}>
                  <h2 className={styles['store-detail__bento-title']}>{strings.location}</h2>
                  {(store.city ?? store.country) && (
                    <p className={styles['store-detail__bento-text']}>
                      {[store.city, store.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {store.address && (
                    <p className={styles['store-detail__bento-address']}>{store.address}</p>
                  )}
                  <StoreMapToggle
                    lat={store.lat!}
                    lng={store.lng!}
                    showMap={strings.showMap}
                    hideMap={strings.hideMap}
                  />
                </div>
              )}

              {hasReviews && (
                <div className={styles['store-detail__bento-card']}>
                  <h2 className={styles['store-detail__bento-title']}>{strings.reviews}</h2>
                  <StoreReviewsEmbed
                    googlePlaceId={store.google_place_id!}
                    storeName={store.name}
                    viewReviews={strings.viewReviews}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
