'use client';

import { useCallback, useImperativeHandle, useState } from 'react';
import { Modal } from '@dezkareid/components/react';
import { AddItemForm, type InitialItemData } from '@/components/AddItemForm/AddItemForm';
import { updateItemSilent } from '@/app/[locale]/[username]/[collectionSlug]/actions';

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
  onSuccess?: () => void;
  initialData: FullItemData;
};

export type EditItemModalHandle = {
  open: () => void;
};

export const EditItemModal = function EditItemModal({ ref, brands, franchises, collectionId, username, collectionSlug, onSuccess, initialData }: Properties & { ref?: React.RefObject<EditItemModalHandle | null> }) {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setIsOpen(true);
    },
  }));

  const close = useCallback(() => setIsOpen(false), []);

  const handleSuccess = useCallback(() => {
    close();
    onSuccess?.();
  }, [close, onSuccess]);

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="Edit Item"
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
          submitLabel="Save Changes"
        />
      )}
    </Modal>
  );
};
