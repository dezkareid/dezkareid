'use client';

import { useCallback, useImperativeHandle, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@dezkareid/components/react';
import { AddItemForm, type InitialItemData } from '@/components/AddItemForm/AddItemForm';
import { updateItemSilent, type CollectionOwnerItem } from '@/app/[locale]/[username]/[collectionSlug]/actions';

type Brand = { id: string; name: string };
type Franchise = { id: string; name: string };

export type FullItemData = InitialItemData & {
  id: string;
};

type Properties = {
  brands: Brand[];
  franchises: Franchise[];
  collectionId: string;
  username: string;
  collectionSlug: string;
  onSuccess?: (item?: CollectionOwnerItem) => void;
  initialData: FullItemData;
};

export type EditItemModalHandle = {
  open: () => void;
};

export const EditItemModal = function EditItemModal({ ref, brands, franchises, collectionId, username, collectionSlug, onSuccess, initialData }: Properties & { ref?: React.RefObject<EditItemModalHandle | null> }) {
  const t = useTranslations('Common.owner_actions.edit_item');
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setIsOpen(true);
    },
  }));

  const close = useCallback(() => setIsOpen(false), []);

  const handleSuccess = useCallback((state: Awaited<ReturnType<typeof updateItemSilent>>) => {
    close();
    const item = state && 'item' in state ? state.item : undefined;
    onSuccess?.(item);
  }, [close, onSuccess]);

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title={t('modal_title')}
    >
      {isOpen && (
        <AddItemForm
          brands={brands}
          franchises={franchises}
          collectionId={collectionId}
          username={username}
          collectionSlug={collectionSlug}
          onSuccess={handleSuccess}
          initialData={initialData}
          action={updateItemSilent}
          submitLabel={t('submit_label')}
          isEditing={true}
        />
      )}
    </Modal>
  );
};
