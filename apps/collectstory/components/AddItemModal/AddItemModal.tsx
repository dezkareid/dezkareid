'use client';

import { useCallback, useImperativeHandle, useState } from 'react';
import { Modal } from '@dezkareid/components/react';
import { AddItemForm, type InitialItemData } from '@/components/AddItemForm/AddItemForm';
import type { CollectionItemState, CollectionOwnerItem } from '@/app/[locale]/[username]/[collectionSlug]/actions';

type Brand = { id: string; name: string };
type Franchise = { id: string; name: string };

type ActionState = CollectionItemState;

type Properties = {
  brands: Brand[];
  franchises: Franchise[];
  collectionId: string;
  username: string;
  collectionSlug: string;
  onSuccess?: (item?: CollectionOwnerItem) => void;
  initialData?: InitialItemData;
  action?: (previousState: ActionState, formData: FormData) => Promise<ActionState>;
};

export type AddItemModalHandle = {
  open: () => void;
};

export const AddItemModal = function AddItemModal({ ref, brands, franchises, collectionId, username, collectionSlug, onSuccess, initialData, action }: Properties & { ref?: React.RefObject<AddItemModalHandle | null> }) {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setIsOpen(true);
    },
  }));

  const close = useCallback(() => setIsOpen(false), []);

  const handleSuccess = useCallback((state: ActionState) => {
    close();
    const item = state && 'item' in state ? state.item : undefined;
    onSuccess?.(item);
  }, [close, onSuccess]);

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="Add to Collection"
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
          action={action}
        />
      )}
    </Modal>
  );
};
