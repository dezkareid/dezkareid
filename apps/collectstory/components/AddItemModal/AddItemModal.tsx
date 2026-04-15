'use client';

import { useCallback, useImperativeHandle, useState } from 'react';
import { Modal } from '@dezkareid/components/react';
import { AddItemForm, type InitialItemData } from '@/components/AddItemForm/AddItemForm';

type Brand = { id: string; name: string };
type Franchise = { id: string; name: string };

type ActionState = { error: string; field?: string } | { success: true } | undefined;

type Properties = {
  brands: Brand[];
  franchises: Franchise[];
  collectionId: string;
  username: string;
  collectionSlug: string;
  onSuccess?: () => void;
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

  const handleSuccess = useCallback(() => {
    close();
    onSuccess?.();
  }, [close, onSuccess]);

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="Add to Collection"
    >
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
    </Modal>
  );
};
