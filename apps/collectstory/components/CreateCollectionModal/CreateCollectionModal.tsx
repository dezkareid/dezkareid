'use client';

import { useActionState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createCollection } from '@/app/collection/actions';
import styles from './CreateCollectionModal.module.css';

type CollectionState
  = | { error: string }
    | { success: true; slug: string }
    | undefined;

type Properties = {
  username: string;
};

export function CreateCollectionModal({ username }: Properties) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    async (_previous: CollectionState, formData: FormData): Promise<CollectionState> => {
      const result = await createCollection(undefined, formData);
      if (result && 'success' in result) {
        dialogRef.current?.close();
        router.push(`/${username}/${result.slug}`);
      }
      return result;
    },
    undefined,
  );

  function open() {
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button type="button" className={styles.trigger} onClick={open}>
        + New Collection
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <div className={styles.panel}>
          <div className={styles.header}>
            <h2 className={styles.title}>New Collection</h2>
            <button
              type="button"
              className={styles.closeButton}
              onClick={close}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className={styles.body}>
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
          </div>
        </div>
      </dialog>
    </>
  );
}
