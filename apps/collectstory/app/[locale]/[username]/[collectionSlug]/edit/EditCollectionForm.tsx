'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateCollection } from '../actions';
import styles from '@/components/AddItemForm/AddItemForm.module.css';

type Properties = {
  collectionId: string;
  currentName: string;
  currentDescription: string | undefined;
  username: string;
  collectionSlug: string;
};

export function EditCollectionForm({
  collectionId,
  currentName,
  currentDescription,
  username,
  collectionSlug,
}: Properties) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateCollection, undefined);

  useEffect(() => {
    if (state && 'success' in state) {
      router.push(`/${username}/${state.slug}`);
    }
  }, [state, username, router]);

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="collection_id" value={collectionId} />
      <input type="hidden" name="username" value={username} />
      <input type="hidden" name="collection_slug" value={collectionSlug} />

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
          defaultValue={currentName}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="collection-description">Description</label>
        <textarea
          id="collection-description"
          name="description"
          className={styles.textarea}
          rows={3}
          defaultValue={currentDescription ?? ''}
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton} disabled={pending}>
          {pending ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
