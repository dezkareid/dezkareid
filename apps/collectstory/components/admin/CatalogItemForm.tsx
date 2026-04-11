'use client';

import { useActionState, useState, useTransition } from 'react';
import Link from 'next/link';
import { ImageField } from './ImageField';
import styles from './form.module.css';

interface FranchiseOption {
  id: string;
  name: string;
}

interface LineOption {
  id: string;
  name: string;
  franchise_id: string | null | undefined;
}

interface CatalogItemDefaults {
  name?: string;
  description?: string | null;
  image_url?: string | null;
  franchise_id?: string | null;
  line_id?: string | null;
}

interface CatalogItemFormProperties {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: CatalogItemDefaults;
  franchises: FranchiseOption[];
  lines: LineOption[];
  submitLabel: string;
  cancelHref: string;
}

async function uploadFile(file: File): Promise<{ url: string } | { error: string }> {
  const data = new FormData();
  data.set('file', file);
  const response = await fetch('/api/upload', { method: 'POST', body: data });
  const result = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !result.url) return { error: result.error ?? 'Upload failed. Please try again.' };
  return { url: result.url };
}

function submitButtonLabel(uploading: boolean, pending: boolean, submitLabel: string): string {
  if (uploading) return 'Uploading…';
  if (pending) return 'Saving…';
  return submitLabel;
}

function makeFormAction(action: (formData: FormData) => Promise<void>) {
  return async (_previous: { error: string } | undefined, formData: FormData) => {
    try {
      await action(formData);
      return;
    }
    catch (error) {
      return { error: error instanceof Error ? error.message : 'An unexpected error occurred.' };
    }
  };
}

async function resolveImageUrl(
  form: HTMLFormElement,
  pendingFile: File | undefined,
  uploadedUrl: string | undefined,
  setUploading: (v: boolean) => void,
  setUploadedUrl: (v: string) => void,
  setPendingFile: (v: File | undefined) => void,
  setFileError: (v: string) => void,
  data: FormData,
): Promise<boolean> {
  const fileInput = form.elements.namedItem('image_file') as HTMLInputElement;
  const file = fileInput?.files?.[0] ?? pendingFile;

  if (file) {
    setUploading(true);
    const result = await uploadFile(file).catch(() => ({ error: 'Upload failed. Please try again.' }));
    setUploading(false);
    if ('error' in result) {
      setFileError(result.error);
      return false;
    }
    setUploadedUrl(result.url);
    setPendingFile(undefined);
    data.set('image_url', result.url);
  }
  else if (uploadedUrl) {
    data.set('image_url', uploadedUrl);
  }
  return true;
}

// eslint-disable-next-line complexity -- form component with multiple optional fields; splitting would require excessive prop drilling
export function CatalogItemForm({
  action,
  defaultValues,
  franchises,
  lines,
  submitLabel,
  cancelHref,
}: CatalogItemFormProperties) {
  const [state, formAction, pending] = useActionState(makeFormAction(action), undefined);

  const [selectedFranchiseId, setSelectedFranchiseId] = useState(defaultValues?.franchise_id ?? '');

  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(defaultValues?.image_url ?? undefined);
  const [pendingFile, setPendingFile] = useState<File | undefined>();
  const [fileError, setFileError] = useState<string | undefined>();
  const [, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fileError) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const ok = await resolveImageUrl(
      form, pendingFile, uploadedUrl,
      setUploading, setUploadedUrl, setPendingFile, setFileError,
      data,
    );
    if (!ok) return;

    startTransition(() => formAction(data));
  }

  const isBusy = pending || uploading;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {state?.error && <p className={styles.error} role="alert">{state.error}</p>}

      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          {'Name '}
          <span aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name ?? ''}
          className={styles.input}
          autoFocus
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
          defaultValue={defaultValues?.description ?? ''}
          rows={3}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="franchise_id" className={styles.label}>
          Franchise
          <span className={styles.optional}> (optional)</span>
        </label>
        <select
          id="franchise_id"
          name="franchise_id"
          className={styles.select}
          value={selectedFranchiseId}
          onChange={(event) => {
            setSelectedFranchiseId(event.target.value);
          }}
        >
          <option value="">— None —</option>
          {franchises.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="line_id" className={styles.label}>
          Line
          <span className={styles.optional}> (optional)</span>
        </label>
        <select
          id="line_id"
          name="line_id"
          className={styles.select}
          defaultValue={defaultValues?.line_id ?? ''}
        >
          <option value="">— None —</option>
          {lines.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      <ImageField
        defaultImageUrl={defaultValues?.image_url ?? undefined}
        uploading={uploading}
        onUploadedUrl={url => setUploadedUrl(url)}
        onFile={(file) => {
          setPendingFile(file);
          setFileError(undefined);
        }}
        onFileError={setFileError}
        fileError={fileError}
        label="Image"
        required={false}
      />

      <div className={styles.actions}>
        <button type="submit" disabled={isBusy} className={styles.submitButton}>
          {submitButtonLabel(uploading, pending, submitLabel)}
        </button>
        <Link href={cancelHref} className={styles.cancelLink}>Cancel</Link>
      </div>
    </form>
  );
}
