'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@dezkareid/components/react';
import { createCollection } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import styles from './CreateCollectionModal.module.css';

type CollectionState
  = | { error: string }
    | { success: true; slug: string }
    | undefined;

type Properties = {
  username: string;
};

export function CreateCollectionModal({ username }: Properties) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    async (_previous: CollectionState, formData: FormData): Promise<CollectionState> => {
      const result = await createCollection(undefined, formData);
      if (result && 'success' in result) {
        setIsOpen(false);
        router.push(`/${username}/${result.slug}`);
      }
      return result;
    },
    undefined,
  );

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <button type="button" className={styles.trigger} onClick={open}>
        + New Collection
      </button>

      <Modal
        open={isOpen}
        onClose={close}
        title="New Collection"
      >
        <form action={formAction} className={styles.form}>
          {state && 'error' in state && (
            <p className={styles.formError} role="alert">{state.error}</p>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="collection-name">
              Name
              {' '}
              <span className={styles.required}>*</span>
            </label>
            <input
              id="collection-name"
              name="name"
              type="text"
              className={styles.input}
              required
              autoComplete="off"
              placeholder="e.g. S.H. Figuarts"
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="collection-description">Description</label>
            <textarea
              id="collection-description"
              name="description"
              className={styles.textarea}
              rows={3}
              placeholder="What do you collect here?"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="collection-visibility">Visibility</label>
            <select
              id="collection-visibility"
              name="visibility"
              className={styles.select}
              defaultValue="public"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton} disabled={pending}>
              {pending ? 'Creating…' : 'Create Collection'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
