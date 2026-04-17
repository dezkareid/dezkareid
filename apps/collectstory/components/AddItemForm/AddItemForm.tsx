'use client';

import { useActionState, useEffect, useRef, useState, useTransition, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { createCollectionItem, getLinesByBrand, type CollectionItemState } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import { SlugPicker, useSlugDisambiguation } from '@/src/features/slug-picker';

type Franchise = { id: string; name: string };
import styles from './AddItemForm.module.css';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

type Brand = { id: string; name: string };
type LineVariant = { value: string; display_name: string };
type Line = { id: string; name: string; categoryName: string | undefined; variants: LineVariant[]; brandName: string | undefined };

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

type ActionState = CollectionItemState;

type Properties<T extends ActionState = ActionState> = {
  brands: Brand[];
  franchises: Franchise[];
  collectionId: string;
  username?: string;
  collectionSlug?: string;
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
  if (!response.ok || !result.url) return { error: result.error ?? '' };
  return { url: result.url };
}

function ImageUploadField({
  preview,
  fileError,
  uploadFailed,
  uploading,
  onFileChange,
  t,
}: {
  preview: string | undefined;
  fileError: string | undefined;
  uploadFailed: boolean;
  uploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  t: ReturnType<typeof useTranslations<'AddItemForm'>>;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="item-image">
        {t('field_image')}
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
                <span className={styles.uploadHint}>{t('field_image_hint')}</span>
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
            <span className={styles.retryHint}>{t('field_image_retry')}</span>
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
  t,
}: {
  line: Line | undefined;
  selectedVariant: string;
  onVariantChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  t: ReturnType<typeof useTranslations<'AddItemForm'>>;
}) {
  if (!line || line.variants.length === 0) return;
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="item-variant">{t('field_variant')}</label>
      <select
        id="item-variant"
        name="variant"
        className={styles.select}
        value={selectedVariant}
        onChange={onVariantChange}
      >
        <option value="">{t('field_none')}</option>
        {line.variants.map(v => (
          <option key={v.value} value={v.value}>
            {v.display_name}
          </option>
        ))}
      </select>
    </div>
  );
}

function NameField({
  value,
  error,
  onChange,
  t,
}: {
  value: string;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  t: ReturnType<typeof useTranslations<'AddItemForm'>>;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="item-name">
        {t('field_name')}
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
        value={value}
        onChange={onChange}
        placeholder={t('field_name_placeholder')}
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
  t,
}: {
  brands: Brand[];
  selectedBrandId: string;
  selectedLineId: string;
  lines: Line[];
  loadingLines: boolean;
  onBrandChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onLineChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  t: ReturnType<typeof useTranslations<'AddItemForm'>>;
}) {
  return (
    <div className={styles.row}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-brand">{t('field_brand')}</label>
        <select id="item-brand" className={styles.select} onChange={onBrandChange} value={selectedBrandId}>
          <option value="">{t('field_none')}</option>
          {brands.map(b => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-line">
          {t('field_line')}
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
          <option value="">{t('field_none')}</option>
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

function MetaFields({ franchises, initialData, t }: { franchises: Franchise[]; initialData?: InitialItemData; t: ReturnType<typeof useTranslations<'AddItemForm'>> }) {
  return (
    <>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-franchise">{t('field_franchise')}</label>
        <select id="item-franchise" name="franchise_id" className={styles.select} defaultValue={initialData?.franchise_id ?? ''}>
          <option value="">{t('field_none')}</option>
          {franchises.map(f => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-description">{t('field_description')}</label>
        <textarea id="item-description" name="description" className={styles.textarea} rows={3} defaultValue={initialData?.description} placeholder={t('field_description_placeholder')} />
      </div>
    </>
  );
}

function AcquisitionFields({ initialData, t }: { initialData?: InitialItemData; t: ReturnType<typeof useTranslations<'AddItemForm'>> }) {
  return (
    <div className={styles.row}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-date">{t('field_date')}</label>
        <input id="item-date" name="date_acquired" type="date" className={styles.input} defaultValue={initialData?.date_acquired} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-visibility">{t('field_visibility')}</label>
        <select id="item-visibility" name="visibility" className={styles.select} defaultValue={initialData?.visibility ?? 'public'}>
          <option value="public">{t('visibility_public')}</option>
          <option value="private">{t('visibility_private')}</option>
          <option value="draft">{t('visibility_draft')}</option>
        </select>
      </div>
    </div>
  );
}

function CategoryDisplay({ line, t }: { line: Line | undefined; t: ReturnType<typeof useTranslations<'AddItemForm'>> }) {
  if (!line) return <></>;
  return (
    <div className={styles.field}>
      <label className={styles.label}>{t('field_category')}</label>
      <p className={styles.derivedValue}>{line.categoryName ?? '—'}</p>
    </div>
  );
}

function FormActions({ uploading, checking, pending, needsSelection, submitLabel, t }: { uploading: boolean; checking: boolean; pending: boolean; needsSelection: boolean; submitLabel?: string; t: ReturnType<typeof useTranslations<'AddItemForm'>> }) {
  const isBusy = pending || uploading || checking || needsSelection;
  function computeLabel() {
    if (uploading) return t('submit_uploading');
    if (checking) return t('submit_checking');
    if (pending) return t('submit_saving');
    return submitLabel ?? t('submit_add');
  }
  const label = computeLabel();

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
  t: ReturnType<typeof useTranslations<'AddItemForm'>>,
) {
  const defaultAction = useCallback(async (previousState: ActionState, formData: FormData) => createCollectionItem(previousState, formData), []) as unknown as (state: Awaited<T>, payload: FormData) => Promise<T>;
  const finalAction = (action as unknown as (state: Awaited<T>, payload: FormData) => Promise<T>) || defaultAction;
  const [state, formAction, pending] = useActionState(finalAction, undefined as unknown as Awaited<T>);

  // Keep onSuccess in a ref so the effect below only re-runs when `state`
  // changes — not when the parent re-renders and recreates the callback.
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const [fileError, setFileError] = useState<string>();
  const [uploadFailed, setUploadFailed] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(initialData?.image_url);
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(initialData?.image_url);
  const [uploading, setUploading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string>(initialData?.brand_id ?? '');
  const [selectedLine, setSelectedLine] = useState<Line | undefined>(undefined);
  const [selectedVariant, setSelectedVariant] = useState(initialData?.variant ?? '');
  const [nameValue, setNameValue] = useState(initialData?.name ?? '');
  const [, startTransition] = useTransition();
  const { slugOptions, selectedSlug, needsSelection, checkCollision, selectSlug, reset } = useSlugDisambiguation();
  const formRef = useRef<HTMLFormElement>(null);

  // Deduplicated lines fetch — React Query caches by brandId across re-renders.
  const { data: lines = [], isFetching: loadingLines } = useQuery({
    queryKey: ['lines', selectedBrandId],
    queryFn: () => getLinesByBrand(selectedBrandId),
    enabled: !!selectedBrandId,
    staleTime: 5 * 60 * 1000,
  });

  // Depend only on `state` — reading onSuccess via ref means a new callback
  // identity on a parent re-render won't re-trigger this effect.
  useEffect(() => {
    if (state && typeof state === 'object' && 'success' in state) onSuccessRef.current(state as T);
  }, [state]); // intentional: onSuccess is read via ref, not listed as a dep

  useEffect(() => {
    if (slugOptions === null) return;
    let element: HTMLElement | null = formRef.current?.parentElement ?? null;
    while (element) {
      if (element.scrollHeight > element.clientHeight) {
        element.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      }
      element = element.parentElement;
    }
  }, [slugOptions]);

  // When lines load and there's an initial lineId, select the matching line.
  useEffect(() => {
    if (initialData?.line_id && lines.length > 0) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect -- syncing derived state from async data load
      setSelectedLine(lines.find(l => l.id === initialData.line_id));
    }
  }, [lines, initialData?.line_id]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(undefined);
    setUploadFailed(false);
    setPreview(undefined);
    setUploadedUrl(undefined);
    if (!file) return;
    if (!ALLOWED_TYPES.has(file.type)) {
      setFileError(t('error_image_type'));
      event.target.value = '';
      return;
    }
    if (file.size > MAX_BYTES) {
      setFileError(t('error_image_size'));
      event.target.value = '';
      return;
    }
    setPreview(URL.createObjectURL(file));
  }, [t]);

  const handleBrandChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = event.target.value;
    setSelectedBrandId(brandId);
    setSelectedLine(undefined);
    setSelectedVariant('');
  }, []);

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
      const result = await uploadFile(file).catch(() => ({ error: t('error_upload') }));
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
    if (!ok) return;

    const collectionId = (form.elements.namedItem('collection_id') as HTMLInputElement)?.value;

    // Phase 1: options showing and slug chosen → attach chosen slug and save.
    if (slugOptions !== null) {
      if (!selectedSlug) return;
      data.set('slug', selectedSlug);
      startTransition(() => formAction(data));
      return;
    }

    // Phase 0: check for collision before first save.
    setChecking(true);
    const options = await checkCollision(
      nameValue,
      collectionId,
      selectedLine?.name,
      selectedVariant || undefined,
      selectedLine?.brandName,
    );
    setChecking(false);
    if (options === null) {
      startTransition(() => formAction(data));
    }
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
    nameValue,
    setNameValue,
    slugOptions,
    selectedSlug,
    needsSelection,
    selectSlug,
    reset,
    loadingLines,
    handleFileChange,
    handleBrandChange,
    handleLineChange,
    handleSubmit,
    formRef,
    checking,
  };
}

function FormBody<T extends ActionState>({
  properties,
  logic,
  t,
}: {
  properties: Properties<T>;
  logic: ReturnType<typeof useAddItemFormLogic<T>>;
  t: ReturnType<typeof useTranslations<'AddItemForm'>>;
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
    nameValue,
    setNameValue,
    slugOptions,
    selectedSlug,
    needsSelection,
    selectSlug,
    reset,
    handleFileChange,
    handleBrandChange,
    handleLineChange,
    pending,
    checking,
  } = logic;

  const stateAsError = state && typeof state === 'object' && 'error' in state ? (state as { error: string }).error : undefined;

  return (
    <>
      <NameField
        value={nameValue}
        error={stateAsError}
        onChange={(event) => {
          setNameValue(event.target.value);
          reset();
        }}
        t={t}
      />

      {slugOptions !== null && (
        <SlugPicker
          options={slugOptions}
          selectedSlug={selectedSlug}
          onSelect={selectSlug}
          legend={t('slug_picker_legend')}
          hint={t('slug_picker_hint')}
        />
      )}

      <ImageUploadField
        preview={preview}
        fileError={fileError}
        uploadFailed={uploadFailed}
        uploading={uploading}
        onFileChange={handleFileChange}
        t={t}
      />

      <BrandLineFields
        brands={brands}
        selectedBrandId={selectedBrandId}
        selectedLineId={selectedLine?.id ?? ''}
        lines={lines}
        loadingLines={loadingLines}
        onBrandChange={handleBrandChange}
        onLineChange={handleLineChange}
        t={t}
      />

      <CategoryDisplay line={selectedLine} t={t} />

      <VariantSelectField
        line={selectedLine}
        selectedVariant={selectedVariant}
        onVariantChange={event => setSelectedVariant(event.target.value)}
        t={t}
      />

      <MetaFields franchises={franchises} initialData={initialData} t={t} />

      <AcquisitionFields initialData={initialData} t={t} />

      <FormActions uploading={uploading} checking={checking} pending={pending} needsSelection={needsSelection} submitLabel={submitLabel} t={t} />
    </>
  );
}

export function AddItemForm<T extends ActionState = ActionState>(properties: Properties<T>) {
  const t = useTranslations('AddItemForm');
  const logic = useAddItemFormLogic<T>(properties.initialData, properties.action, properties.onSuccess, t);
  const { state, handleSubmit, formRef } = logic;
  const stateAsError = state && typeof state === 'object' && 'error' in state ? (state as { error: string }).error : undefined;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.form} noValidate>
      <input type="hidden" name="collection_id" value={properties.collectionId} />
      {properties.username && <input type="hidden" name="username" value={properties.username} />}
      {properties.collectionSlug && <input type="hidden" name="collection_slug" value={properties.collectionSlug} />}
      {properties.initialData && 'id' in properties.initialData && (properties.initialData as { id: string }).id && (
        <input type="hidden" name="item_id" value={(properties.initialData as { id: string }).id} />
      )}

      {stateAsError && (
        <p id="form-error" className={styles.formError} role="alert">{stateAsError}</p>
      )}

      <FormBody<T> properties={properties} logic={logic} t={t} />
    </form>
  );
}
