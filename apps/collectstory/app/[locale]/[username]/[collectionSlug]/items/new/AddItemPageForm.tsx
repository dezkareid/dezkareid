'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { addItem } from '../../actions';
import { getLinesByBrand } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import { stripMetadata } from '@/lib/image/strip-metadata';
import { CatalogItemPicker } from '@/src/features/catalog-item-picker';
import { SlugPicker, useSlugDisambiguation } from '@/src/features/slug-picker';
import styles from '@/components/AddItemForm/AddItemForm.module.css';

function ImageUploadArea({
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
      <label className={styles.label} htmlFor="item-image">{t('field_image')}</label>
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
          disabled={uploading}
        />
      </div>
      {fileError && (
        <p className={styles.fieldError} role="alert">
          {fileError}
          {uploadFailed && <span className={styles.retryHint}>{t('field_image_retry')}</span>}
        </p>
      )}
    </div>
  );
}

function VariantSelect({
  line,
  selectedVariant,
  onVariantChange,
  t,
}: {
  line: { variants: { value: string; display_name: string }[] } | undefined;
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
          <option key={v.value} value={v.value}>{v.display_name}</option>
        ))}
      </select>
    </div>
  );
}

type Brand = { id: string; name: string };
type LineVariant = { value: string; display_name: string };
type Line = { id: string; name: string; categoryName: string | undefined; variants: LineVariant[]; brandName: string | undefined };

type Properties = {
  brands: Brand[];
  franchises: { id: string; name: string }[];
  collectionId: string;
  username: string;
  collectionSlug: string;
};

// Keep in sync with UPLOAD_CONFIG.item in app/api/upload/route.ts
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

async function uploadFile(file: File): Promise<{ url: string } | { error: string }> {
  const stripped = await stripMetadata(file);
  const uploadData = new FormData();
  uploadData.set('file', stripped);
  const response = await fetch('/api/upload', { method: 'POST', body: uploadData });
  const result = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !result.url) return { error: result.error ?? 'Upload failed. Please try again.' };
  return { url: result.url };
}

export function AddItemPageForm({ brands, franchises, collectionId, username, collectionSlug }: Properties) {
  const t = useTranslations('AddItemForm');
  const router = useRouter();
  const [state, formAction, pending] = useActionState(addItem, undefined);
  const [fileError, setFileError] = useState<string>();
  const [uploadFailed, setUploadFailed] = useState(false);
  const [preview, setPreview] = useState<string>();
  const [uploadedUrl, setUploadedUrl] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [selectedLine, setSelectedLine] = useState<Line | undefined>(undefined);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [loadingLines, startLoadingLines] = useTransition();
  const [, startTransition] = useTransition();
  const { slugOptions, selectedSlug, needsSelection, checkCollision, selectSlug, reset } = useSlugDisambiguation();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && 'success' in state && state.success) {
      router.push(`/${username}/${collectionSlug}`);
    }
  }, [state, username, collectionSlug, router]);

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

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
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
  }

  async function handleBrandChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const brandId = event.target.value;
    setLines([]);
    setSelectedLine(undefined);
    setSelectedVariant('');
    if (!brandId) return;
    startLoadingLines(async () => {
      const result = await getLinesByBrand(brandId);
      setLines(result);
    });
  }

  function handleLineChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const lineId = event.target.value;
    setSelectedLine(lines.find(l => l.id === lineId));
    setSelectedVariant('');
  }

  async function resolveImageUrl(form: HTMLFormElement, data: FormData): Promise<boolean> {
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
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fileError) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!await resolveImageUrl(form, data)) return;

    // Phase 1: options showing and slug chosen → save with chosen slug.
    if (slugOptions !== null) {
      if (!selectedSlug) return; // guard: picker visible but nothing selected
      data.set('slug', selectedSlug);
      startTransition(() => formAction(data));
      return;
    }

    // Phase 0: check for collision before first save attempt.
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
      // No collision — save immediately; server will generate slug.
      startTransition(() => formAction(data));
    }
    // Collision detected: checkCollision set slugOptions state → SlugPicker renders.
    // User selects an option and re-submits, hitting Phase 1 above.
  }

  const isBusy = pending || uploading || checking || needsSelection;

  function submitLabel() {
    if (uploading) return t('submit_uploading');
    if (checking) return t('submit_checking');
    if (pending) return t('submit_saving');
    return t('submit_add');
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.form} noValidate>
      <input type="hidden" name="collection_id" value={collectionId} />
      <input type="hidden" name="username" value={username} />
      <input type="hidden" name="collection_slug" value={collectionSlug} />

      {state && 'error' in state && (
        <p className={styles.formError} role="alert">{state.error}</p>
      )}

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
          placeholder={t('field_name_placeholder')}
          value={nameValue}
          onChange={(event) => {
            setNameValue(event.target.value);
            reset();
          }}
        />
      </div>

      {slugOptions !== null && (
        <SlugPicker
          options={slugOptions}
          selectedSlug={selectedSlug}
          onSelect={selectSlug}
          legend={t('slug_picker_legend')}
          hint={t('slug_picker_hint')}
        />
      )}

      <ImageUploadArea
        preview={preview}
        fileError={fileError}
        uploadFailed={uploadFailed}
        uploading={uploading}
        onFileChange={handleFileChange}
        t={t}
      />

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="item-brand">{t('field_brand')}</label>
          <select
            id="item-brand"
            className={styles.select}
            onChange={handleBrandChange}
            defaultValue=""
          >
            <option value="">{t('field_none')}</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="item-line">
            {t('field_line')}
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
            <option value="">{t('field_none')}</option>
            {lines.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedLine && (
        <div className={styles.field}>
          <label className={styles.label}>{t('field_category')}</label>
          <p className={styles.derivedValue}>{selectedLine.categoryName ?? '—'}</p>
        </div>
      )}

      <VariantSelect
        line={selectedLine}
        selectedVariant={selectedVariant}
        onVariantChange={event => setSelectedVariant(event.target.value)}
        t={t}
      />

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-franchise">{t('field_franchise')}</label>
        <select
          id="item-franchise"
          name="franchise_id"
          className={styles.select}
          defaultValue=""
        >
          <option value="">{t('field_none')}</option>
          {franchises.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="item-description">{t('field_description')}</label>
        <textarea
          id="item-description"
          name="description"
          className={styles.textarea}
          rows={3}
          placeholder={t('field_description_placeholder')}
        />
      </div>

      <CatalogItemPicker name="catalog_item_id" />

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="item-date">{t('field_date')}</label>
          <input
            id="item-date"
            name="date_acquired"
            type="date"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="item-visibility">{t('field_visibility')}</label>
          <select
            id="item-visibility"
            name="visibility"
            className={styles.select}
            defaultValue="public"
          >
            <option value="public">{t('visibility_public')}</option>
            <option value="private">{t('visibility_private')}</option>
            <option value="draft">{t('visibility_draft')}</option>
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton} disabled={isBusy}>
          {submitLabel()}
        </button>
      </div>
    </form>
  );
}
