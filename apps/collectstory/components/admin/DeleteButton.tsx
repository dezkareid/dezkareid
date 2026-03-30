'use client';

import { useTransition } from 'react';
import styles from './delete-button.module.css';

interface DeleteButtonProperties {
  id: string;
  label: string;
  deleteAction: (id: string) => Promise<void>;
}

export function DeleteButton({ id, label, deleteAction }: DeleteButtonProperties) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteAction(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={styles.button}
      aria-label={`Delete ${label}`}
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
