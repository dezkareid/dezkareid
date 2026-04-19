'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Trash } from '@dezkareid/icons/react';
import { DeleteCollectionModal } from '@/src/features/owner-collection-actions/ui/DeleteCollectionModal';
import { CollectionCard } from '@/src/entities/collection';
import styles from './OwnerProfileCollectionCard.module.css';

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | undefined;
  item_count: number;
  visibility: string;
};

type Properties = {
  collection: Collection;
  username: string;
  /** Pre-rendered PrivateBadge node passed from the RSC parent (server component) */
  privateBadge?: React.ReactNode;
};

export function OwnerProfileCollectionCard({ collection, username, privateBadge }: Properties) {
  const t = useTranslations('Common');
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className={styles['collection-card']}>
      <Link href={`/${username}/${collection.slug}`} className={styles['collection-card__link']}>
        <CollectionCard
          collection={{
            name: collection.name,
            description: collection.description,
            item_count: collection.item_count,
            itemCountLabel: t('owner_actions.items_count', { count: collection.item_count }),
          }}
          badge={privateBadge}
        />
      </Link>
      <button
        type="button"
        className={styles['collection-card__delete']}
        aria-label={t('owner_actions.delete_collection.aria_label', { name: collection.name })}
        onClick={() => setDeleteOpen(true)}
      >
        <Trash />
      </button>
      <DeleteCollectionModal
        open={deleteOpen}
        collectionId={collection.id}
        collectionName={collection.name}
        itemCount={collection.item_count}
        username={username}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}
