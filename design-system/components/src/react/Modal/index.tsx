'use client';

import { useEffect, useId, useRef, type HTMLAttributes } from 'react';
import cx from 'classnames';
import type { ModalProperties } from '../../shared/types/modal';
import styles from '../../css/modal.module.css';

export interface Properties extends ModalProperties, Omit<HTMLAttributes<HTMLDialogElement>, 'title' | 'children'> {}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  closeLabel = 'Close',
  ...rest
}: Properties) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `modal-title-${useId().replaceAll(':', '')}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    }
    else if (dialog.open) {
      dialog.close();
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
      className={cx(styles.modal, className)}
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
      {...rest}
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
            aria-label={closeLabel}
          >
            ✕
          </button>
        </div>
        <div className={styles.modal__body}>{children}</div>
      </div>
    </dialog>
  );
}
