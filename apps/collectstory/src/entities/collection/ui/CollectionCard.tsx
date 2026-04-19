import type { ReactNode } from 'react';
import styles from './CollectionCard.module.css';

export type CollectionCardData = {
  name: string;
  description: string | undefined;
  item_count: number;
  itemCountLabel: string;
};

type Properties = {
  collection: CollectionCardData;
  /** Optional content rendered after the meta row (e.g. a PrivateBadge) */
  badge?: ReactNode;
};

/**
 * Pure display component for a collection card body.
 * Renders name, optional description, and item count.
 * Does not include a link, delete button, or any interactive behaviour —
 * those are added by the consumer (public profile or owner card).
 */
export function CollectionCard({ collection, badge }: Properties) {
  return (
    <>
      <div className={styles['collection-card__name-row']}>
        <p className={styles['collection-card__name']}>{collection.name}</p>
        {badge}
      </div>
      {collection.description && (
        <p className={styles['collection-card__desc']}>{collection.description}</p>
      )}
      <p className={styles['collection-card__meta']}>{collection.itemCountLabel}</p>
    </>
  );
}
