'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import styles from './form.module.css';

interface Brand {
  id: string;
  name: string;
}

interface LineFormProperties {
  action: (formData: FormData) => Promise<{ error: string } | void>;
  brands: Brand[];
  defaultName?: string;
  defaultBrandId?: string;
  submitLabel: string;
}

export function LineForm({ action, brands, defaultName, defaultBrandId, submitLabel }: LineFormProperties) {
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
        <label htmlFor="brand_id" className={styles.label}>Brand</label>
        <select id="brand_id" name="brand_id" required defaultValue={defaultBrandId ?? ''} className={styles.select}>
          <option value="" disabled>Select a brand…</option>
          {brands.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
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
      <div className={styles.actions}>
        <button type="submit" disabled={pending} className={styles.submitButton}>
          {pending ? 'Saving…' : submitLabel}
        </button>
        <Link href="/admin/lines" className={styles.cancelLink}>Cancel</Link>
      </div>
    </form>
  );
}
