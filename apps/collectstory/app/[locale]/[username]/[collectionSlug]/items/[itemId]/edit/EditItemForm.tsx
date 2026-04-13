'use client';

import { useActionState, useState, useTransition, useEffect } from 'react';
import { updateItem } from '../../../actions';
import { getLinesByBrand } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import { stripMetadata } from '@/lib/image/strip-metadata';
import { CatalogItemPicker } from '@/src/features/catalog-item-picker';
import type { CatalogItemSearchResult } from '@/src/features/catalog-item-picker';
import styles from '@/components/AddItemForm/AddItemForm.module.css';

type Brand = { id: string; name: string };
type LineVariant = { value: string; display_name: string };
type Line = { id: string; name: string; categoryName: string | undefined; variants: LineVariant[] };

type Properties = {
  itemId: string;
  currentName: string;
  currentImageUrl: string | undefined;
  currentDescription: string | undefined;
  currentDateAcquired: string | undefined;
  currentVisibility: string;
  currentLineId: string | undefined;
  currentBrandId: string | undefined;
  currentFranchiseId: string | undefined;
  currentVariant: string | undefined;
  currentLineVariants: LineVariant[];
  currentCatalogItem: Pick<CatalogItemSearchResult, 'id' | 'name'> | undefined;
  franchises: { id: string; name: string }[];
  brands: Brand[];
  username: string;
  collectionSlug: string;
};

// Keep in sync with UPLOAD_CONFIG.item in app/api/upload/route.ts
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

function validateFile(file: File): string | undefined {
  if (!ALLOWED_TYPES.has(file.type)) return 'Only JPEG, PNG, and WebP images are allowed.';
  if (file.size > MAX_BYTES) return 'Image must be 5 MB or smaller.';
  return undefined;
}

async function uploadFile(file: File): Promise<{ url: string } | { error: string }> {
  const stripped = await stripMetadata(file);
  const uploadData = new FormData();
  uploadData.set('file', stripped);
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

function useEditItemForm(
  currentImageUrl: string | undefined,
  currentBrandId: string | undefined,
  currentLineId: string | undefined,
  currentLineVariants: LineVariant[],
  currentVariant: string | undefined,
) {
  const [state, formAction, pending] = useActionState(updateItem, undefined);
  const [fileError, setFileError] = useState<string>();
  const [uploadFailed, setUploadFailed] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImageUrl);
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [linesLoading, setLinesLoading] = useState(false);
  const [lineVariants, setLineVariants] = useState<LineVariant[]>(currentLineVariants);
  const [selectedVariant, setSelectedVariant] = useState(currentVariant ?? '');
  const [, startTransition] = useTransition();
  const [selectedBrand, setSelectedBrand] = useState(currentBrandId ?? '');
  const [selectedLine, setSelectedLine] = useState(currentLineId ?? '');

  // On mount, load lines for the existing brand so the line select is pre-populated
  useEffect(() => {
    if (!currentBrandId) return;
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect -- intentional: loading flag managed inside async effect
    setLinesLoading(true);
    getLinesByBrand(currentBrandId)
      .then(setLines)
      .finally(() => setLinesLoading(false));
  }, []); // mount-only; currentBrandId is stable initial prop

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
    setSelectedLine('');
    setLines([]);
    setLineVariants([]);
    setSelectedVariant('');
    if (!brandId) return;
    setLinesLoading(true);
    getLinesByBrand(brandId)
      .then(setLines)
      .finally(() => setLinesLoading(false));
  }

  function handleLineChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const lineId = event.target.value;
    setSelectedLine(lineId);
    const line = lines.find(l => l.id === lineId);
    setLineVariants(line?.variants ?? []);
    setSelectedVariant('');
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
    lines, linesLoading, selectedBrand, selectedLine, lineVariants, selectedVariant, setSelectedVariant,
    handleFileChange, handleBrandChange, handleLineChange,
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

function ImagePreview({ preview, styles }: { preview: string | undefined; styles: Record<string, string> }) {
  if (preview) {
    // eslint-disable-next-line @next/next/no-img-element -- preview is a local blob URL, next/image doesn't support blob URLs
    return <img src={preview} alt="Preview" className={styles.preview} />;
  }
  return (
    <div className={styles.uploadPlaceholder}>
      <span className={styles.uploadIcon}>↑</span>
      <span className={styles.uploadHint}>JPEG, PNG or WebP · max 5 MB</span>
    </div>
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
  currentFranchiseId,
  currentVariant,
  currentLineVariants,
  currentCatalogItem,
  franchises,
  brands,
  username,
  collectionSlug,
}: Properties) {
  const {
    state, formAction: handleSubmit,
    fileError, uploadFailed, preview, uploading,
    lines, linesLoading, selectedBrand, selectedLine, lineVariants, selectedVariant, setSelectedVariant,
    handleFileChange, handleBrandChange, handleLineChange,
    pending,
  } = useEditItemForm(currentImageUrl, currentBrandId, currentLineId, currentLineVariants, currentVariant);

  const submitDisabled = pending || uploading;
  const submitLabel = uploading ? 'Uploading…' : 'Save Changes';

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
          <ImagePreview preview={preview} styles={styles} />
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
            {linesLoading && <span className={styles.loadingDot} aria-hidden="true" />}
          </label>
          <select
            id="item-line"
            name="line_id"
            className={styles.select}
            disabled={lines.length === 0}
            value={selectedLine}
            onChange={handleLineChange}
          >
            <option value="">— none —</option>
            {lines.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {lineVariants.length > 0 && (
        <div className={styles.field}>
          <label className={styles.label} htmlFor="item-variant">Variant</label>
          <select
            id="item-variant"
            name="variant"
            className={styles.select}
            value={selectedVariant}
            onChange={event => setSelectedVariant(event.target.value)}
          >
            <option value="">— none —</option>
            {lineVariants.map(v => (
              <option key={v.value} value={v.value}>{v.display_name}</option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-franchise">Franchise</label>
        <select
          id="item-franchise"
          name="franchise_id"
          className={styles.select}
          defaultValue={currentFranchiseId ?? ''}
        >
          <option value="">— none —</option>
          {franchises.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
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

      <CatalogItemPicker
        name="catalog_item_id"
        defaultValue={currentCatalogItem}
      />

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton} disabled={submitDisabled}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
