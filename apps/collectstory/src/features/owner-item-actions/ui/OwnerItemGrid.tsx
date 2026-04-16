'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Image } from '@dezkareid/components/react-server';
import { AddItemModal, type AddItemModalHandle } from '@/components/AddItemModal/AddItemModal';
import { Trash } from '@dezkareid/icons/react';
import { getCollectionItems, deleteItem, createCollectionItemSilent } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import { OPEN_ADD_ITEM_MODAL_EVENT } from '@/src/shared/lib/owner-events';
import { PrivateBadgeOverlay } from '@/src/shared/ui/PrivateBadge';
import type { OwnerItem } from '../model/types';
import { DeleteItemModal } from './DeleteItemModal';
import styles from './OwnerItemGrid.module.css';

type Brand = { id: string; name: string };
type Franchise = { id: string; name: string };

type Properties = {
  initialItems: OwnerItem[];
  collectionId: string;
  username: string;
  collectionSlug: string;
  brands: Brand[];
  franchises: Franchise[];
};

// ─── Item card — memoized so it only re-renders when its own data changes ────

type ItemCardProperties = {
  item: OwnerItem;
  href: string;
  onDelete: (itemId: string, itemName: string) => void;
  deleteAriaLabel: string;
};

const OwnerItemCard = memo(function OwnerItemCard({
  item,
  href,
  onDelete,
  deleteAriaLabel,
}: ItemCardProperties) {
  return (
    <div className={styles['item-card']}>
      <Link href={href} className={styles['item-card__link']}>
        <div className={styles['item-card__image']}>
          {item.visibility !== 'public' && <PrivateBadgeOverlay />}
          {item.image_url
            ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  strategy="cloudinary"
                  sizes="(max-width: 420px) 100vw, (max-width: 720px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )
            : (
                <div className={styles['item-card__placeholder']}>📦</div>
              )}
        </div>
        <p className={styles['item-card__name']}>{item.name}</p>
        {item.lines?.name && (
          <p className={styles['item-card__line']}>{item.lines.name}</p>
        )}
      </Link>
      <button
        type="button"
        className={styles['item-card__delete']}
        aria-label={deleteAriaLabel}
        onClick={() => onDelete(item.id, item.name)}
      >
        <Trash />
      </button>
    </div>
  );
});

// ─── Grid ─────────────────────────────────────────────────────────────────────

// Single state shape — updated atomically to avoid double renders.
type GridState = {
  itemMap: Map<string, OwnerItem>;
  itemIds: string[];
};

type DeleteTarget = { itemId: string; itemName: string } | undefined;

function buildInitialState(initialItems: OwnerItem[]): GridState {
  return {
    itemMap: new Map(initialItems.map(item => [item.id, item])),
    itemIds: initialItems.map(item => item.id),
  };
}

export function OwnerItemGrid({
  initialItems,
  collectionId,
  username,
  collectionSlug,
  brands,
  franchises,
}: Properties) {
  const t = useTranslations('Common.owner_actions');
  const tCommon = useTranslations('Common.profile.collection');
  const addModalRef = useRef<AddItemModalHandle>(null);

  // Open this grid's modal when the header "+ Add Item" button fires the event.
  useEffect(() => {
    const handler = () => addModalRef.current?.open();
    globalThis.addEventListener(OPEN_ADD_ITEM_MODAL_EVENT, handler);
    return () => globalThis.removeEventListener(OPEN_ADD_ITEM_MODAL_EVENT, handler);
  }, []);

  // Single state object — itemMap + itemIds updated together to avoid the
  // two-render cycle that caused OwnerItemCard to re-render unnecessarily.
  const [grid, setGrid] = useState<GridState>(() => buildInitialState(initialItems));

  // Keep a ref to grid so handleDeleteConfirm doesn't capture a stale closure.
  const gridRef = useRef(grid);
  gridRef.current = grid;

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  // Derive the visible items list from the ordered id list + map.
  // Only recomputes when grid changes.
  const items = useMemo(
    () => grid.itemIds
      .map(id => grid.itemMap.get(id))
      .filter((item): item is OwnerItem => item !== undefined),
    [grid],
  );

  const handleAddSuccess = useCallback(async () => {
    const fresh = await getCollectionItems(collectionId);
    if (!fresh || fresh.length === 0) return;
    setGrid((previous) => {
      const nextMap = new Map(previous.itemMap);
      for (const item of fresh as OwnerItem[]) {
        const existing = previous.itemMap.get(item.id);
        const changed = !existing
          || existing.name !== item.name
          || existing.image_url !== item.image_url
          || existing.lines?.name !== item.lines?.name;
        if (changed) nextMap.set(item.id, item);
      }
      return { itemMap: nextMap, itemIds: fresh.map(item => item.id) };
    });
  }, [collectionId]);

  const handleOpenDelete = useCallback((itemId: string, itemName: string) => {
    setDeleteTarget({ itemId, itemName });
  }, []);

  const handleCloseDelete = useCallback(() => {
    setDeleteTarget(undefined);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    const { itemId } = deleteTarget;

    const snapshot = gridRef.current;

    // Batch: close modal + optimistic remove + mark pending
    setDeleteTarget(undefined);
    setGrid(previous => ({
      itemMap: previous.itemMap,
      itemIds: previous.itemIds.filter(id => id !== itemId),
    }));
    setIsDeleting(true);

    const result = await deleteItem(itemId, username, collectionSlug);
    setIsDeleting(false);

    if ('error' in result) {
      // Roll back to snapshot taken before the optimistic update
      setGrid(snapshot);
    }
  }, [deleteTarget, username, collectionSlug]);

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

      <AddItemModal
        ref={addModalRef}
        brands={brands}
        franchises={franchises}
        collectionId={collectionId}
        username={username}
        collectionSlug={collectionSlug}
        onSuccess={handleAddSuccess}
        action={createCollectionItemSilent}
      />

      {/* Item count — rendered here so it reflects live client state and stays
          in sync after add/delete without needing a full RSC re-render.
          The RSC-rendered count in the page header is hidden via CSS :has(). */}
      <p className={styles['owner-grid__count']}>
        {tCommon('items_count', { count: items.length })}
      </p>

      <div className={styles['owner-grid']}>
        {items.length === 0
          ? (
              <div className={styles['owner-grid__empty']}>
                <p className={styles['owner-grid__empty-title']}>{t('empty_state.title')}</p>
                <p className={styles['owner-grid__empty-desc']}>{t('empty_state.description')}</p>
                <button
                  type="button"
                  className={styles['owner-grid__add-btn']}
                  onClick={() => addModalRef.current?.open()}
                >
                  {t('add_item')}
                </button>
              </div>
            )
          : items.map(item => (
              <OwnerItemCard
                key={item.id}
                item={item}
                href={`/${username}/${collectionSlug}/${item.slug}`}
                onDelete={handleOpenDelete}
                deleteAriaLabel={t('delete_item.aria_label', { name: item.name })}
              />
            ))}
      </div>

    </>
  );
}
