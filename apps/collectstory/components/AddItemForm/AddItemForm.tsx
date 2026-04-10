'use client';

import { useActionState, useEffect, useState, useTransition, useCallback } from 'react';
import { createCollectionItem, getLinesByBrand } from '@/app/[username]/[collectionSlug]/actions';

type Franchise = { id: string; name: string };
import styles from './AddItemForm.module.css';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

type Brand = { id: string; name: string };
type LineVariant = { value: string; display_name: string };
type Line = { id: string; name: string; categoryName: string | undefined; variants: LineVariant[] };

export type InitialItemData = {
  name?: string;
  description?: string;
  image_url?: string;
  brand_id?: string;
  line_id?: string;
  franchise_id?: string;
  variant?: string;
  date_acquired?: string;
  visibility?: string;
};

type ActionState = { error: string; field?: string } | { success: true } | undefined;

type Properties<T extends ActionState = ActionState> = {
  brands: Brand[];
  franchises: Franchise[];
  collectionId: string;
  onSuccess: (state: T) => void;
  initialData?: InitialItemData;
  action?: (previousState: T, formData: FormData) => Promise<T>;
  submitLabel?: string;
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

function ImageUploadField({
  preview,
  fileError,
  uploadFailed,
  uploading,
  onFileChange,
}: {
  preview: string | undefined;
  fileError: string | undefined;
  uploadFailed: boolean;
  uploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
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
          onChange={onFileChange}
          aria-describedby={fileError ? 'image-error' : undefined}
          disabled={uploading}
        />
      </div>
      {fileError && (
        <p id="image-error" className={styles.fieldError} role="alert">
          {fileError}
          {uploadFailed && (
            <span className={styles.retryHint}> — choose the file again to retry.</span>
          )}
        </p>
      )}
    </div>
  );
}

function VariantSelectField({
  line,
  selectedVariant,
  onVariantChange,
}: {
  line: Line | undefined;
  selectedVariant: string;
  onVariantChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  if (!line || line.variants.length === 0) return;
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="item-variant">Variant</label>
      <select
        id="item-variant"
        name="variant"
        className={styles.select}
        value={selectedVariant}
        onChange={onVariantChange}
      >
        <option value="">— none —</option>
        {line.variants.map(v => (
          <option key={v.value} value={v.value}>
            {v.display_name}
          </option>
        ))}
      </select>
    </div>
  );
}

function NameField({ defaultValue, error }: { defaultValue?: string; error?: string }) {
  return (
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
        defaultValue={defaultValue}
        placeholder="e.g. S.H. Figuarts Spider-Man"
        aria-describedby={error ? 'form-error' : undefined}
      />
    </div>
  );
}

function BrandLineFields({
  brands,
  selectedBrandId,
  selectedLineId,
  lines,
  loadingLines,
  onBrandChange,
  onLineChange,
}: {
  brands: Brand[];
  selectedBrandId: string;
  selectedLineId: string;
  lines: Line[];
  loadingLines: boolean;
  onBrandChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onLineChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className={styles.row}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-brand">Brand</label>
        <select id="item-brand" className={styles.select} onChange={onBrandChange} value={selectedBrandId}>
          <option value="">— none —</option>
          {brands.map(b => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-line">
          Line
          {' '}
          {loadingLines && <span className={styles.loadingDot} aria-hidden="true" />}
        </label>
        <select
          id="item-line"
          name="line_id"
          className={styles.select}
          disabled={lines.length === 0}
          value={selectedLineId}
          onChange={onLineChange}
        >
          <option value="">— none —</option>
          {lines.map(l => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function MetaFields({ franchises, initialData }: { franchises: Franchise[]; initialData?: InitialItemData }) {
  return (
    <>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-franchise">Franchise</label>
        <select id="item-franchise" name="franchise_id" className={styles.select} defaultValue={initialData?.franchise_id ?? ''}>
          <option value="">— none —</option>
          {franchises.map(f => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-description">Description</label>
        <textarea id="item-description" name="description" className={styles.textarea} rows={3} defaultValue={initialData?.description} placeholder="What makes this piece special?" />
      </div>
    </>
  );
}

function AcquisitionFields({ initialData }: { initialData?: InitialItemData }) {
  return (
    <div className={styles.row}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-date">Date Acquired</label>
        <input id="item-date" name="date_acquired" type="date" className={styles.input} defaultValue={initialData?.date_acquired} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-visibility">Visibility</label>
        <select id="item-visibility" name="visibility" className={styles.select} defaultValue={initialData?.visibility ?? 'public'}>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>
  );
}

function CategoryDisplay({ line }: { line: Line | undefined }) {
  if (!line) return <></>;
  return (
    <div className={styles.field}>
      <label className={styles.label}>Category</label>
      <p className={styles.derivedValue}>{line.categoryName ?? '—'}</p>
    </div>
  );
}

function FormActions({ uploading, pending, submitLabel }: { uploading: boolean; pending: boolean; submitLabel?: string }) {
  const isBusy = pending || uploading;
  const label = uploading ? 'Uploading…' : (pending ? 'Saving…' : (submitLabel || 'Add to Collection'));

  return (
    <div className={styles.actions}>
      <button type="submit" className={styles.submitButton} disabled={isBusy}>
        {label}
      </button>
    </div>
  );
}

function useAddItemFormLogic<T extends ActionState>(
  initialData: InitialItemData | undefined,
  action: Properties<T>['action'],
  onSuccess: Properties<T>['onSuccess'],
) {
  const defaultAction = useCallback(async (previousState: ActionState, formData: FormData) => createCollectionItem(previousState, formData), []) as unknown as (state: Awaited<T>, payload: FormData) => Promise<T>;
  const finalAction = (action as unknown as (state: Awaited<T>, payload: FormData) => Promise<T>) || defaultAction;
  const [state, formAction, pending] = useActionState(finalAction, undefined as unknown as Awaited<T>);
  const [fileError, setFileError] = useState<string>();
  const [uploadFailed, setUploadFailed] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(initialData?.image_url);
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(initialData?.image_url);
  const [uploading, setUploading] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>(initialData?.brand_id ?? '');
  const [selectedLine, setSelectedLine] = useState<Line | undefined>(undefined);
  const [selectedVariant, setSelectedVariant] = useState(initialData?.variant ?? '');
  const [loadingLines, startLoadingLines] = useTransition();
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state && typeof state === 'object' && 'success' in state) onSuccess(state as T);
  }, [state, onSuccess]);

  const loadLines = useCallback((brandId: string, lineId?: string) => {
    startLoadingLines(async () => {
      const result = await getLinesByBrand(brandId);
      setLines(result);
      if (lineId) {
        setSelectedLine(result.find(l => l.id === lineId));
      }
    });
  }, []);

  useEffect(() => {
    if (initialData?.brand_id) {
      loadLines(initialData.brand_id, initialData.line_id);
    }
  }, [initialData, loadLines]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(undefined);
    setUploadFailed(false);
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
  }, []);

  const handleBrandChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = event.target.value;
    setSelectedBrandId(brandId);
    setLines([]);
    setSelectedLine(undefined);
    setSelectedVariant('');
    if (brandId) loadLines(brandId);
  }, [loadLines]);

  const handleLineChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const lineId = event.target.value;
    setSelectedLine(lines.find(l => l.id === lineId));
    setSelectedVariant('');
  }, [lines]);

  const resolveImageUrl = async (form: HTMLFormElement, data: FormData): Promise<boolean> => {
    const fileInput = form.elements.namedItem('image') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file && !uploadedUrl) {
      setUploading(true);
      const result = await uploadFile(file).catch(() => ({ error: 'Upload failed. Please try again.' }));
      setUploading(false);
      if ('error' in result) {
        setFileError(result.error);
        setUploadFailed(true);
        return false;
      }
      setUploadedUrl(result.url);
      data.set('image_url', result.url);
    }
    else if (uploadedUrl) {
      data.set('image_url', uploadedUrl);
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (fileError) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const ok = await resolveImageUrl(form, data);
    if (ok) startTransition(() => formAction(data));
  };

  return {
    state,
    pending,
    fileError,
    uploadFailed,
    preview,
    uploading,
    lines,
    selectedBrandId,
    selectedLine,
    selectedVariant,
    setSelectedVariant,
    loadingLines,
    handleFileChange,
    handleBrandChange,
    handleLineChange,
    handleSubmit,
  };
}

function FormBody<T extends ActionState>({
  properties,
  logic,
}: {
  properties: Properties<T>;
  logic: ReturnType<typeof useAddItemFormLogic<T>>;
}) {
  const { brands, franchises, initialData, submitLabel } = properties;
  const {
    state,
    preview,
    fileError,
    uploadFailed,
    uploading,
    selectedBrandId,
    selectedLine,
    lines,
    loadingLines,
    selectedVariant,
    setSelectedVariant,
    handleFileChange,
    handleBrandChange,
    handleLineChange,
    pending,
  } = logic;

  const stateAsError = state && typeof state === 'object' && 'error' in state ? (state as { error: string }).error : undefined;

  return (
    <>
      <NameField defaultValue={initialData?.name} error={stateAsError} />

      <ImageUploadField
        preview={preview}
        fileError={fileError}
        uploadFailed={uploadFailed}
        uploading={uploading}
        onFileChange={handleFileChange}
      />

      <BrandLineFields
        brands={brands}
        selectedBrandId={selectedBrandId}
        selectedLineId={selectedLine?.id ?? ''}
        lines={lines}
        loadingLines={loadingLines}
        onBrandChange={handleBrandChange}
        onLineChange={handleLineChange}
      />

      <CategoryDisplay line={selectedLine} />

      <VariantSelectField
        line={selectedLine}
        selectedVariant={selectedVariant}
        onVariantChange={event => setSelectedVariant(event.target.value)}
      />

      <MetaFields franchises={franchises} initialData={initialData} />

      <AcquisitionFields initialData={initialData} />

      <FormActions uploading={uploading} pending={pending} submitLabel={submitLabel} />
    </>
  );
}

export function AddItemForm<T extends ActionState = ActionState>(properties: Properties<T>) {
  const logic = useAddItemFormLogic<T>(properties.initialData, properties.action, properties.onSuccess);
  const { state, handleSubmit } = logic;
  const stateAsError = state && typeof state === 'object' && 'error' in state ? (state as { error: string }).error : undefined;

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <input type="hidden" name="collection_id" value={properties.collectionId} />

      {stateAsError && (
        <p id="form-error" className={styles.formError} role="alert">{stateAsError}</p>
      )}

      <FormBody<T> properties={properties} logic={logic} />
    </form>
  );
}
