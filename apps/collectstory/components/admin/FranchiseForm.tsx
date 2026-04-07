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

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');
}

interface FranchiseFormProperties {
  action: (formData: FormData) => Promise<{ error: string } | void>;
  cancelHref: string;
  defaultName?: string;
  defaultSlug?: string;
  defaultDescription?: string;
  defaultImageUrl?: string;
  submitLabel: string;
}

export function FranchiseForm({
  action,
  cancelHref,
  defaultName,
  defaultSlug,
  defaultDescription,
  defaultImageUrl,
  submitLabel,
}: FranchiseFormProperties) {
  const [state, formAction, pending] = useActionState(
    async (_previous: { error: string } | undefined, formData: FormData) => {
      const result = await action(formData);
      return result ?? undefined;
    },
    undefined,
  );

  const [name, setName] = useState(defaultName ?? '');
  const [customSlug, setCustomSlug] = useState(defaultSlug ?? '');
  const [slugEdited, setSlugEdited] = useState(!!defaultSlug);

  const slug = slugEdited ? customSlug : toSlug(name);

  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(defaultImageUrl);
  const [fileError, setFileError] = useState<string | undefined>();
  const [, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fileError) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const fileInput = form.elements.namedItem('image_file') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (file) {
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
        <label htmlFor="name" className={styles.label}>Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={event => setName(event.target.value)}
          className={styles.input}
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="slug" className={styles.label}>
          Slug
          <span className={styles.optional}> (auto-derived, editable)</span>
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={(event) => {
            setCustomSlug(event.target.value);
            setSlugEdited(true);
          }}
          className={styles.input}
          pattern="[a-z0-9][a-z0-9\-]*[a-z0-9]"
          title="Lowercase letters, digits, and hyphens only"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description
          <span className={styles.optional}> (optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={defaultDescription}
          rows={3}
          className={styles.input}
        />
      </div>

      <ImageField
        defaultImageUrl={defaultImageUrl}
        uploading={uploading}
        onUploadedUrl={url => setUploadedUrl(url)}
        onFileError={setFileError}
        fileError={fileError}
        label="Cover"
        required
      />

      <div className={styles.actions}>
        <button type="submit" disabled={isBusy} className={styles.submitButton}>
          {uploading ? 'Uploading…' : (pending ? 'Saving…' : submitLabel)}
        </button>
        <Link href={cancelHref} className={styles.cancelLink}>Cancel</Link>
      </div>
    </form>
  );
}
