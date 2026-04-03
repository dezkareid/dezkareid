'use client';

import { useActionState, useState, useTransition } from 'react';
import Link from 'next/link';
import { ImageField } from './ImageField';
import styles from './form.module.css';

async function uploadFile(file: File): Promise<{ url: string } | { error: string }> {
  const data = new FormData();
  data.set('file', file);
  const response = await fetch('/api/upload', { method: 'POST', body: data });
  const result = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !result.url) return { error: result.error ?? 'Upload failed. Please try again.' };
  return { url: result.url };
}

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

  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>();
  const [fileError, setFileError] = useState<string | undefined>();
  const [, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fileError) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const fileInput = form.elements.namedItem('image_file') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (file && !uploadedUrl) {
      setUploading(true);
      const result = await uploadFile(file).catch(() => ({ error: 'Upload failed. Please try again.' }));
      setUploading(false);
      if ('error' in result) {
        setFileError(result.error);
        return;
      }
      setUploadedUrl(result.url);
      data.set('image_url', result.url);
    }
    else if (uploadedUrl) {
      data.set('image_url', uploadedUrl);
    }

    startTransition(() => formAction(data));
  }

  const isBusy = pending || uploading;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
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
      <ImageField
        defaultImageUrl={defaultImageUrl}
        uploading={uploading}
        onUploadedUrl={setUploadedUrl}
        onFileError={setFileError}
        fileError={fileError}
      />
      <div className={styles.actions}>
        <button type="submit" disabled={isBusy} className={styles.submitButton}>
          {uploading ? 'Uploading…' : (pending ? 'Saving…' : submitLabel)}
        </button>
        <Link href="/admin/lines" className={styles.cancelLink}>Cancel</Link>
      </div>
    </form>
  );
}
