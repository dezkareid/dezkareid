'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@dezkareid/components/react';
import { deleteCollection } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import styles from './DeleteCollectionModal.module.css';

type Properties = {
  open: boolean;
  collectionId: string;
  collectionName: string;
  itemCount: number;
  username: string;
  onClose: () => void;
};

export function DeleteCollectionModal({
  open,
  collectionId,
  collectionName,
  itemCount,
  username,
  onClose,
}: Properties) {
  const t = useTranslations('Common');
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();

  async function handleConfirm() {
    setIsPending(true);
    setError(undefined);
    const result = await deleteCollection(collectionId);
    setIsPending(false);
    if ('error' in result) {
      setError(result.error);
      return;
    }
    onClose();
    router.push(`/${username}`);
  }

  const message = itemCount > 0
    ? t('owner_actions.delete_collection.message_with_items', { collectionName, count: itemCount })
    : t('owner_actions.delete_collection.message_empty', { collectionName });

  return (
    <Modal open={open} onClose={onClose} title={t('owner_actions.delete_collection.modal_title')}>
      <div className={styles.body}>
        <p className={styles.message}>
          {message}
        </p>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isPending}
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? t('owner_actions.deleting') : t('owner_actions.delete_collection.confirm_button')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
