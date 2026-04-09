'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProperties {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProperties) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const titleId = `modal-title-${useId().replaceAll(':', '')}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    }
    else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      onClose();
    }

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
    >
      <div className={styles.modal__inner}>
        <div className={styles.modal__header}>
          <h2 id={titleId} className={styles.modal__title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.modal__close}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className={styles.modal__body}>{children}</div>
      </div>
    </dialog>
  );
}
