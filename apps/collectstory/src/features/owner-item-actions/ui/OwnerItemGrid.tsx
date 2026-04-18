'use client';

import { memo, useCallback, useEffect, useRef, useState, ViewTransition } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Image } from '@dezkareid/components/react';
import { AddItemModal, type AddItemModalHandle } from '@/components/AddItemModal/AddItemModal';
import { EditItemModal, type EditItemModalHandle } from '@/src/features/edit-item/ui/EditItemModal';
import { Trash, Edit } from '@dezkareid/icons/react';
import { deleteItem, createCollectionItemSilent, type CollectionOwnerItem } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import { OPEN_ADD_ITEM_MODAL_EVENT } from '@/src/shared/lib/owner-events';
import { PrivateBadgeOverlay } from '@/src/shared/ui/PrivateBadge';
import { useCollectionItems } from '../model/CollectionItemsContext';
import { DeleteItemModal } from './DeleteItemModal';
import styles from './OwnerItemGrid.module.css';

// ─── Item card — memoized so it only re-renders when its own data changes ────

type ItemCardProperties = {
  item: CollectionOwnerItem;
  href: string;
  onEdit: (item: CollectionOwnerItem) => void;
  onDelete: (itemId: string, itemName: string) => void;
  editAriaLabel: string;
  deleteAriaLabel: string;
};

const OwnerItemCard = memo(function OwnerItemCard({
  item,
  href,
  onEdit,
  onDelete,
  editAriaLabel,
  deleteAriaLabel,
}: ItemCardProperties) {
  return (
    <div className={styles['item-card']}>
      <Link href={href} className={styles['item-card__link']}>
        <div className={styles['item-card__image']}>
          {item.visibility !== 'public' && <PrivateBadgeOverlay />}
          {item.image_url
            ? (
                <ViewTransition name={`owner-item-image-${item.slug}`}>
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    strategy="cloudinary"
                    sizes="(max-width: 420px) 100vw, (max-width: 720px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </ViewTransition>
              )
            : <div className={styles['item-card__placeholder']}>📦</div>}
        </div>
        <p className={styles['item-card__name']}>{item.name}</p>
        {item.lines?.name && <p className={styles['item-card__line']}>{item.lines.name}</p>}
      </Link>
      <button type="button" className={styles['item-card__edit']} aria-label={editAriaLabel} onClick={() => onEdit(item)}>
        <Edit />
      </button>
      <button type="button" className={styles['item-card__delete']} aria-label={deleteAriaLabel} onClick={() => onDelete(item.id, item.name)}>
        <Trash />
      </button>
    </div>
  );
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

type DeleteTarget = { itemId: string; itemName: string } | undefined;

function mapItemToInitialData(item: CollectionOwnerItem) {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? undefined,
    image_url: item.image_url ?? undefined,
    brand_id: item.lines?.brands?.id ?? '',
    line_id: item.lines?.id ?? '',
    franchise_id: item.franchise_id ?? '',
    variant: item.variant ?? '',
    date_acquired: item.date_acquired ?? '',
    visibility: item.visibility ?? 'public',
  };
}

function OwnerItemEmpty({ onAdd }: { onAdd: () => void }) {
  const t = useTranslations('Common.owner_actions');
  return (
    <div className={styles['owner-grid__empty']}>
      <p className={styles['owner-grid__empty-title']}>{t('empty_state.title')}</p>
      <p className={styles['owner-grid__empty-desc']}>{t('empty_state.description')}</p>
      <button type="button" className={styles['owner-grid__add-btn']} onClick={onAdd}>
        {t('add_item')}
      </button>
    </div>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

export function OwnerItemGrid() {
  const t = useTranslations('Common.owner_actions');
  const tCommon = useTranslations('Common.profile.collection');
  const addModalRef = useRef<AddItemModalHandle>(null);
  const editModalRef = useRef<EditItemModalHandle>(null);

  const { pageData, ownerItems, addItems, removeItem, rollbackTo } = useCollectionItems();
  const { username, collection, isOwner, ownerData } = pageData;

  const itemsRef = useRef(ownerItems);
  itemsRef.current = ownerItems;

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTarget, setEditTarget] = useState<CollectionOwnerItem | undefined>(undefined);

  useEffect(() => {
    const handler = () => addModalRef.current?.open();
    globalThis.addEventListener(OPEN_ADD_ITEM_MODAL_EVENT, handler);
    return () => globalThis.removeEventListener(OPEN_ADD_ITEM_MODAL_EVENT, handler);
  }, []);

  const handleAddSuccess = useCallback((item?: CollectionOwnerItem) => {
    if (item) addItems([item]);
  }, [addItems]);

  const handleEditSuccess = useCallback((item?: CollectionOwnerItem) => {
    if (item) addItems([item]);
  }, [addItems]);

  const handleOpenDelete = useCallback((itemId: string, itemName: string) => {
    setDeleteTarget({ itemId, itemName });
  }, []);

  const handleOpenEdit = useCallback((item: CollectionOwnerItem) => {
    setEditTarget(item);
    setTimeout(() => editModalRef.current?.open(), 0);
  }, []);

  const handleCloseDelete = useCallback(() => setDeleteTarget(undefined), []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    const { itemId } = deleteTarget;
    const snapshot = itemsRef.current;

    setDeleteTarget(undefined);
    removeItem(itemId);
    setIsDeleting(true);

    const result = await deleteItem(itemId, username, collection.slug);
    setIsDeleting(false);

    if ('error' in result) rollbackTo(snapshot);
  }, [deleteTarget, username, collection.slug, removeItem, rollbackTo]);

  if (!isOwner || !ownerData) return null;

  const { brands, franchises } = ownerData;

  return (
    <>
      {deleteTarget && (
        <DeleteItemModal
          open={true}
          itemName={deleteTarget.itemName}
          isPending={isDeleting}
          onClose={handleCloseDelete}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {editTarget && (
        <EditItemModal
          ref={editModalRef}
          brands={brands}
          franchises={franchises}
          collectionId={collection.id}
          username={username}
          collectionSlug={collection.slug}
          onSuccess={handleEditSuccess}
          initialData={mapItemToInitialData(editTarget)}
        />
      )}

      <AddItemModal
        ref={addModalRef}
        brands={brands}
        franchises={franchises}
        collectionId={collection.id}
        username={username}
        collectionSlug={collection.slug}
        onSuccess={handleAddSuccess}
        action={createCollectionItemSilent}
      />

      <div className={styles['owner-grid__meta']}>
        <p className={styles['owner-grid__count']}>
          {tCommon('items_count', { count: ownerItems.length })}
        </p>
      </div>

      <div className={styles['owner-grid']}>
        {ownerItems.length === 0
          ? <OwnerItemEmpty onAdd={() => addModalRef.current?.open()} />
          : ownerItems.map(item => (
              <OwnerItemCard
                key={item.id}
                item={item}
                href={`/${username}/${collection.slug}/${item.slug}`}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                editAriaLabel={t('edit_item.aria_label', { name: item.name })}
                deleteAriaLabel={t('delete_item.aria_label', { name: item.name })}
              />
            ))}
      </div>
    </>
  );
}
