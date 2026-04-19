'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Modal } from '@dezkareid/components/react';
import { AddItemForm, type InitialItemData } from '@/components/AddItemForm/AddItemForm';
import { getUserCollections } from '@/app/[locale]/[username]/actions';
import { getAllBrands, getAllFranchises, copyItemToCollection, type CopyItemState } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import type { PublicItem, PublicItemDetail } from '@/lib/collections';
import styles from './CopyItemModal.module.css';

type Collection = { id: string; name: string; slug: string };

type Properties = {
  item: PublicItem | PublicItemDetail;
  onClose: () => void;
};

function LoadingState() {
  return <div className={styles.loading}>Loading collections...</div>;
}

function DefaultCollectionNotice() {
  return (
    <div className={styles.notice}>
      <p>You don&apos;t have any collections yet.</p>
      <p className={styles.hint}>
        A default collection
        {' '}
        <strong>&quot;My Collection&quot;</strong>
        {' '}
        will be created for you.
      </p>
    </div>
  );
}

function CollectionSelector({
  collections,
  value,
  onChange,
}: {
  collections: Collection[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className={styles.collectionSelector}>
      <label htmlFor="target-collection" className={styles.label}>
        Add to collection
      </label>
      {collections.length > 0
        ? (
            <select
              id="target-collection"
              value={value}
              onChange={onChange}
              className={styles.select}
            >
              {collections.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )
        : (
            <DefaultCollectionNotice />
          )}
    </div>
  );
}

function useCopyItemModalData() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [franchises, setFranchises] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [cols, bds, fchs] = await Promise.all([
        getUserCollections(),
        getAllBrands(),
        getAllFranchises(),
      ]);

      setCollections(cols);
      if (cols.length > 0) {
        setSelectedCollectionId(cols[0].id);
      }
      setBrands(bds);
      setFranchises(fchs);
      setLoading(false);
    }
    loadData();
  }, []);

  return {
    collections,
    selectedCollectionId,
    setSelectedCollectionId,
    brands,
    franchises,
    loading,
  };
}

function useCopyItemModalActions(
  onClose: () => void,
  setSelectedCollectionId: (id: string) => void,
) {
  const handleSuccess = useCallback((state: CopyItemState) => {
    if (state && 'success' in state && state.success) {
      onClose();
      // Navigation is handled by the server action redirect if applicable,
      // but here we just refresh to show the new item.
      globalThis.location.href = `/${state.username}/${state.collectionSlug}/${state.itemSlug}`;
    }
  }, [onClose]);

  const onCollectionChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCollectionId(event.target.value);
  }, [setSelectedCollectionId]);

  return { handleSuccess, onCollectionChange };
}

function resolveMetadata(item: PublicItem | PublicItemDetail) {
  const lineId = ('line_id' in item ? item.line_id : undefined) || item.lines?.id;
  const franchiseId = ('franchise_id' in item ? item.franchise_id : undefined) || ('franchises' in item ? item.franchises?.id : undefined);
  const variant = 'variant' in item ? item.variant ?? undefined : undefined;

  return { lineId, franchiseId, variant };
}

function resolveInitialData(
  item: PublicItem | PublicItemDetail,
): InitialItemData {
  const { lineId, franchiseId, variant } = resolveMetadata(item);

  return {
    name: item.name,
    description: item.description ?? undefined,
    // Use the original image URL directly
    image_url: item.image_url ?? undefined,
    brand_id: item.lines?.brands?.id,
    line_id: lineId,
    franchise_id: franchiseId,
    variant,
    date_acquired: item.date_acquired ?? undefined,
    visibility: 'public',
  };
}

function CopyItemModalContent({
  item,
  data,
  actions,
}: {
  item: PublicItem | PublicItemDetail;
  data: ReturnType<typeof useCopyItemModalData>;
  actions: ReturnType<typeof useCopyItemModalActions>;
}) {
  const { collections, selectedCollectionId, brands, franchises, loading } = data;
  const { handleSuccess, onCollectionChange } = actions;

  const initialData = useMemo(
    () => resolveInitialData(item),
    [item],
  );

  if (loading) return <LoadingState />;

  return (
    <>
      <CollectionSelector
        collections={collections}
        value={selectedCollectionId}
        onChange={onCollectionChange}
      />

      <div className={styles.formWrapper}>
        <p className={styles.formTitle}>Confirm details</p>
        <AddItemForm
          brands={brands}
          franchises={franchises}
          collectionId={selectedCollectionId}
          initialData={initialData}
          onSuccess={handleSuccess}
          action={copyItemToCollection}
          submitLabel="Copy to my collection"
        />
      </div>
    </>
  );
}

export function CopyItemModal({ item, onClose }: Properties) {
  const data = useCopyItemModalData();
  const actions = useCopyItemModalActions(onClose, data.setSelectedCollectionId);

  return (
    <Modal open onClose={onClose} title="I have this item">
      <div className={styles.container}>
        <CopyItemModalContent item={item} data={data} actions={actions} />
      </div>
    </Modal>
  );
}
