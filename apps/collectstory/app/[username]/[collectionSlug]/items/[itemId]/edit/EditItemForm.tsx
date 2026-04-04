'use client';

import { useActionState, useState, useTransition } from 'react';
import { updateItem } from '../../../actions';
import { getLinesByBrand } from '@/app/collection/actions';
import styles from '@/components/AddItemForm/AddItemForm.module.css';

type Brand = { id: string; name: string };
type Line = { id: string; name: string; categoryName: string | undefined };

type Properties = {
  itemId: string;
  currentName: string;
  currentImageUrl: string | undefined;
  currentDescription: string | undefined;
  currentDateAcquired: string | undefined;
  currentVisibility: string;
  currentLineId: string | undefined;
  currentBrandId: string | undefined;
  brands: Brand[];
  username: string;
  collectionSlug: string;
};

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

function validateFile(file: File): string | undefined {
  if (!ALLOWED_TYPES.has(file.type)) return 'Only JPEG, PNG, and WebP images are allowed.';
  if (file.size > MAX_BYTES) return 'Image must be 5 MB or smaller.';
  return undefined;
}

async function uploadFile(file: File): Promise<{ url: string } | { error: string }> {
  const uploadData = new FormData();
  uploadData.set('file', file);
  const response = await fetch('/api/upload', { method: 'POST', body: uploadData });
  const result = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !result.url) return { error: result.error ?? 'Upload failed. Please try again.' };
  return { url: result.url };
}

type ImageUploadHandlers = {
  setUploading: (v: boolean) => void;
  setFileError: (v: string) => void;
  setUploadFailed: (v: boolean) => void;
  setUploadedUrl: (v: string) => void;
};

async function resolveImageUrl(
  form: HTMLFormElement,
  data: FormData,
  uploadedUrl: string | undefined,
  handlers: ImageUploadHandlers,
): Promise<boolean> {
  const fileInput = form.elements.namedItem('image') as HTMLInputElement;
  const file = fileInput?.files?.[0];
  if (file && !uploadedUrl) {
    handlers.setUploading(true);
    const result = await uploadFile(file).catch(() => ({ error: 'Upload failed. Please try again.' }));
    handlers.setUploading(false);
    if ('error' in result) {
      handlers.setFileError(result.error);
      handlers.setUploadFailed(true);
      return false;
    }
    handlers.setUploadedUrl(result.url);
    data.set('image_url', result.url);
  }
  else if (uploadedUrl) {
    data.set('image_url', uploadedUrl);
  }
  return true;
}

function useEditItemForm(currentImageUrl: string | undefined, currentBrandId: string | undefined) {
  const [state, formAction, pending] = useActionState(updateItem, undefined);
  const [fileError, setFileError] = useState<string>();
  const [uploadFailed, setUploadFailed] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImageUrl);
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [loadingLines, startLoadingLines] = useTransition();
  const [, startTransition] = useTransition();
  const [selectedBrand, setSelectedBrand] = useState(currentBrandId ?? '');

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileError(undefined);
    setUploadFailed(false);
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      event.target.value = '';
      return;
    }
    setPreview(URL.createObjectURL(file));
    setUploadedUrl(undefined);
  }

  async function handleBrandChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const brandId = event.target.value;
    setSelectedBrand(brandId);
    setLines([]);
    if (!brandId) return;
    startLoadingLines(async () => {
      const result = await getLinesByBrand(brandId);
      setLines(result);
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fileError) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const ok = await resolveImageUrl(form, data, uploadedUrl, { setUploading, setFileError, setUploadFailed, setUploadedUrl });
    if (!ok) return;
    startTransition(() => formAction(data));
  }

  return {
    state, formAction: handleSubmit, pending,
    fileError, uploadFailed, preview, uploading,
    lines, loadingLines, selectedBrand,
    handleFileChange, handleBrandChange,
    isBusy: pending || uploading,
  };
}

function FileErrorMessage({ error, uploadFailed, styles }: { error: string | undefined; uploadFailed: boolean; styles: Record<string, string> }) {
  if (!error) return;
  return (
    <p className={styles.fieldError} role="alert">
      {error}
      {uploadFailed && <span className={styles.retryHint}> — choose the file again to retry.</span>}
    </p>
  );
}

export function EditItemForm({
  itemId,
  currentName,
  currentImageUrl,
  currentDescription,
  currentDateAcquired,
  currentVisibility,
  currentLineId,
  currentBrandId,
  brands,
  username,
  collectionSlug,
}: Properties) {
  const {
    state, formAction: handleSubmit,
    fileError, uploadFailed, preview, uploading,
    lines, loadingLines, selectedBrand,
    handleFileChange, handleBrandChange,
    pending,
  } = useEditItemForm(currentImageUrl, currentBrandId);

  const submitLabel = uploading ? 'Uploading…' : 'Save Changes';
  const submitDisabled = pending || uploading;

  const imagePreview = preview
    // eslint-disable-next-line @next/next/no-img-element -- preview is a local blob URL, next/image doesn't support blob URLs
    ? <img src={preview} alt="Preview" className={styles.preview} />
    : (
        <div className={styles.uploadPlaceholder}>
          <span className={styles.uploadIcon}>↑</span>
          <span className={styles.uploadHint}>JPEG, PNG or WebP · max 5 MB</span>
        </div>
      );

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <input type="hidden" name="item_id" value={itemId} />
      <input type="hidden" name="username" value={username} />
      <input type="hidden" name="collection_slug" value={collectionSlug} />

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
          defaultValue={currentName}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-image">Image</label>
        <div className={styles.uploadArea}>
          {imagePreview}
          <input
            id="item-image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className={styles.fileInput}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
        <FileErrorMessage error={fileError} uploadFailed={uploadFailed} styles={styles} />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="item-brand">Brand</label>
          <select
            id="item-brand"
            className={styles.select}
            value={selectedBrand}
            onChange={handleBrandChange}
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
            disabled={lines.length === 0 && !currentLineId}
            defaultValue={currentLineId ?? ''}
          >
            <option value="">— none —</option>
            {lines.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-description">Description</label>
        <textarea
          id="item-description"
          name="description"
          className={styles.textarea}
          rows={3}
          defaultValue={currentDescription ?? ''}
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
            defaultValue={currentDateAcquired ?? ''}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="item-visibility">Visibility</label>
          <select
            id="item-visibility"
            name="visibility"
            className={styles.select}
            defaultValue={currentVisibility}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton} disabled={submitDisabled}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
