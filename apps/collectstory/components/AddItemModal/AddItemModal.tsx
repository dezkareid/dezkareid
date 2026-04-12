'use client';

import { useImperativeHandle, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@dezkareid/components/react';
import { AddItemForm } from '@/components/AddItemForm/AddItemForm';

type Brand = { id: string; name: string };
type Franchise = { id: string; name: string };

type Properties = {
  brands: Brand[];
  franchises: Franchise[];
  collectionId: string;
};

export type AddItemModalHandle = {
  open: () => void;
};

export const AddItemModal = function AddItemModal({ ref, brands, franchises, collectionId }: Properties & { ref?: React.RefObject<AddItemModalHandle | null> }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    open() {
      setIsOpen(true);
    },
  }));

  function close() {
    setIsOpen(false);
  }

  function handleSuccess() {
    close();
    router.refresh();
  }

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
        onSuccess={handleSuccess}
      />
    </Modal>
  );
};
