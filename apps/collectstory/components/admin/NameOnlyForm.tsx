'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import styles from './form.module.css';

interface NameOnlyFormProperties {
  action: (formData: FormData) => Promise<{ error: string } | void>;
  cancelHref: string;
  defaultName?: string;
  defaultImageUrl?: string;
  submitLabel: string;
}

export function NameOnlyForm({ action, cancelHref, defaultName, defaultImageUrl, submitLabel }: NameOnlyFormProperties) {
  const [state, formAction, pending] = useActionState(
    async (_previous: { error: string } | undefined, formData: FormData) => {
      const result = await action(formData);
      return result ?? undefined;
    },
    undefined,
  );

  return (
    <form action={formAction} className={styles.form}>
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultName}
          className={styles.input}
          autoFocus
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="image_url" className={styles.label}>
          Image URL
          <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={defaultImageUrl}
          className={styles.input}
          placeholder="https://…"
        />
      </div>
      <div className={styles.actions}>
        <button type="submit" disabled={pending} className={styles.submitButton}>
          {pending ? 'Saving…' : submitLabel}
        </button>
        <Link href={cancelHref} className={styles.cancelLink}>Cancel</Link>
      </div>
    </form>
  );
}
