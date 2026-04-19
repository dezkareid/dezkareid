'use client';

import { useTranslations } from 'next-intl';
import { Modal } from '@dezkareid/components/react';
import styles from './DeleteItemModal.module.css';

type Properties = {
  open: boolean;
  itemName: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteItemModal({ open, itemName, isPending, onClose, onConfirm }: Properties) {
  const t = useTranslations('Common');

  return (
    <Modal open={open} onClose={onClose} title={t('owner_actions.delete_item.modal_title')}>
      <div className={styles.body}>
        <p className={styles.message}>
          {t('owner_actions.delete_item.message', { itemName })}
        </p>
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
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? t('owner_actions.deleting') : t('owner_actions.delete')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
