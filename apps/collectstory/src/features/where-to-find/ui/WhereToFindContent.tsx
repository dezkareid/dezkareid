import { VerifiedBadge } from '@dezkareid/components/react';
import { ItemLinksManager } from '@/components/ItemLinksManager/ItemLinksManager';
import type { Store, ItemLink } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import styles from './WhereToFind.module.css';

interface WhereToFindContentProperties {
  itemId: string;
  isOwner: boolean;
  linkedStores: Store[];
  initialLinks: ItemLink[];
}

export function WhereToFindContent({
  itemId,
  isOwner,
  linkedStores,
  initialLinks,
}: WhereToFindContentProperties) {
  const hasStores = linkedStores.length > 0;
  const hasLinks = initialLinks.length > 0;

  return (
    <div className={styles['where-to-find__content']}>
      {hasStores && (
        <section aria-label="Stores">
          <p className={styles['where-to-find__section-label']}>Stores</p>
          <ul className={styles['where-to-find__store-list']} role="list">
            {linkedStores.map(store => (
              <li key={store.id} className={styles['where-to-find__store-item']}>
                {store.name}
                {store.verified && (
                  <VerifiedBadge className={styles['where-to-find__verified-icon']} />
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {isOwner && (
        <section aria-label="Custom links">
          <p className={styles['where-to-find__section-label']}>Links</p>
          {!hasStores && !hasLinks && (
            <p className={styles['where-to-find__empty-prompt']}>
              Add a link to where this item can be found.
            </p>
          )}
          <ItemLinksManager itemId={itemId} initialLinks={initialLinks} />
        </section>
      )}

      {!isOwner && !hasStores && hasLinks && (
        <section aria-label="Links">
          <p className={styles['where-to-find__section-label']}>Links</p>
          <ul className={styles['where-to-find__link-list']} role="list">
            {initialLinks.map(link => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['where-to-find__link']}
                >
                  {link.label ?? link.url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
