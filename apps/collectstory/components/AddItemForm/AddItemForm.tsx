'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { createCollectionItem, getLinesByBrand } from '@/app/collection/actions';
import styles from './AddItemForm.module.css';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

type Brand = { id: string; name: string };
type Line = { id: string; name: string; categoryName: string | undefined };

type Properties = {
  brands: Brand[];
  collectionId: string;
  onSuccess: () => void;
};

async function uploadFile(file: File): Promise<{ url: string } | { error: string }> {
  const uploadData = new FormData();
  uploadData.set('file', file);
  const response = await fetch('/api/upload', { method: 'POST', body: uploadData });
  const result = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !result.url) return { error: result.error ?? 'Upload failed. Please try again.' };
  return { url: result.url };
}

function validateImageFile(file: File): string | undefined {
  if (!ALLOWED_TYPES.has(file.type)) return 'Only JPEG, PNG, and WebP images are allowed.';
  if (file.size > MAX_BYTES) return 'Image must be 5 MB or smaller.';
  return undefined;
}

export function AddItemForm({ brands, collectionId, onSuccess }: Properties) {
  const [state, formAction, pending] = useActionState(createCollectionItem, undefined);
  const [fileError, setFileError] = useState<string>();
  const [preview, setPreview] = useState<string>();
  const [uploadedUrl, setUploadedUrl] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [selectedLine, setSelectedLine] = useState<Line | undefined>(undefined);
  const [loadingLines, startLoadingLines] = useTransition();
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state && 'success' in state) onSuccess();
  }, [state, onSuccess]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileError(undefined);
    setPreview(undefined);
    setUploadedUrl(undefined);
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      setFileError(error);
      event.target.value = '';
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  async function handleBrandChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const brandId = event.target.value;
    setLines([]);
    setSelectedLine(undefined);
    if (!brandId) return;
    startLoadingLines(async () => {
      const result = await getLinesByBrand(brandId);
      setLines(result);
    });
  }

  function handleLineChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const lineId = event.target.value;
    setSelectedLine(lines.find(l => l.id === lineId));
  }

  async function resolveImageUrl(form: HTMLFormElement, data: FormData): Promise<boolean> {
    const fileInput = form.elements.namedItem('image') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file && !uploadedUrl) {
      setUploading(true);
      const result = await uploadFile(file).catch(() => ({ error: 'Upload failed. Please try again.' }));
      setUploading(false);
      if ('error' in result) {
        setFileError(result.error);
        return false;
      }
      setUploadedUrl(result.url);
      data.set('image_url', result.url);
    }
    else if (uploadedUrl) {
      data.set('image_url', uploadedUrl);
    }
    return true;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fileError) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const ok = await resolveImageUrl(form, data);
    if (ok) startTransition(() => formAction(data));
  }

  const isBusy = pending || uploading;

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
      noValidate
    >
      <input type="hidden" name="collection_id" value={collectionId} />

      {state && 'error' in state && (
        <p className={styles.formError} role="alert">{state.error}</p>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-name">
          Name
          {' '}
          <span className={styles.required}>*</span>
        </label>
        <input
          id="item-name"
          name="name"
          type="text"
          className={styles.input}
          required
          autoComplete="off"
          placeholder="e.g. S.H. Figuarts Spider-Man"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-image">
          Image
        </label>
        <div className={styles.uploadArea}>
          {preview
            ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Preview" className={styles.preview} />
              )
            : (
                <div className={styles.uploadPlaceholder}>
                  <span className={styles.uploadIcon}>↑</span>
                  <span className={styles.uploadHint}>JPEG, PNG or WebP · max 5 MB</span>
                </div>
              )}
          <input
            id="item-image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className={styles.fileInput}
            onChange={handleFileChange}
          />
        </div>
        {fileError && <p className={styles.fieldError} role="alert">{fileError}</p>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="item-brand">Brand</label>
          <select
            id="item-brand"
            className={styles.select}
            onChange={handleBrandChange}
            defaultValue=""
          >
            <option value="">— none —</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="item-line">
            Line
            {loadingLines && <span className={styles.loadingDot} aria-hidden="true" />}
          </label>
          <select
            id="item-line"
            name="line_id"
            className={styles.select}
            disabled={lines.length === 0}
            defaultValue=""
            onChange={handleLineChange}
          >
            <option value="">— none —</option>
            {lines.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedLine && (
        <div className={styles.field}>
          <label className={styles.label}>Category</label>
          <p className={styles.derivedValue}>
            {selectedLine.categoryName ?? '—'}
          </p>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-description">Description</label>
        <textarea
          id="item-description"
          name="description"
          className={styles.textarea}
          rows={3}
          placeholder="What makes this piece special?"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="item-date">Date Acquired</label>
          <input
            id="item-date"
            name="date_acquired"
            type="date"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="item-visibility">Visibility</label>
          <select
            id="item-visibility"
            name="visibility"
            className={styles.select}
            defaultValue="public"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton} disabled={isBusy}>
          {uploading ? 'Uploading…' : (pending ? 'Saving…' : 'Add to Collection')}
        </button>
      </div>
    </form>
  );
}
