'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import styles from './form.module.css';

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface LineFormProperties {
  action: (formData: FormData) => Promise<{ error: string } | void>;
  brands: Brand[];
  categories: Category[];
  defaultName?: string;
  defaultBrandId?: string;
  defaultCategoryId?: string;
  defaultImageUrl?: string;
  submitLabel: string;
}

export function LineForm({ action, brands, categories, defaultName, defaultBrandId, defaultCategoryId, defaultImageUrl, submitLabel }: LineFormProperties) {
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
      <div className={styles.field}>
        <label htmlFor="category_id" className={styles.label}>
          Category
          <span className={styles.optional}>(optional)</span>
        </label>
        <select id="category_id" name="category_id" defaultValue={defaultCategoryId ?? ''} className={styles.select}>
          <option value="">— none —</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
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
        <Link href="/admin/lines" className={styles.cancelLink}>Cancel</Link>
      </div>
    </form>
  );
}
