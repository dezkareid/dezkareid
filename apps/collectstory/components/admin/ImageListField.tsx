'use client';

import { useEffect, useRef, useState } from 'react';
import type { CatalogImage } from '@/lib/supabase/types';
import { processImageFile } from './image-utilities';
import { isValidHttpUrl } from './ImageField';
import fieldStyles from './ImageField.module.css';
import styles from './ImageListField.module.css';

const MAX_IMAGES = 5;
const URL_PREVIEW_DELAY_MS = 600;

type AddMode = 'url' | 'upload';

interface ImageListFieldProperties {
  defaultImages?: CatalogImage[];
  uploading: boolean;
  onImagesChange: (images: CatalogImage[]) => void;
  onUploadFile: (file: File) => Promise<string | null>;
  error: string | undefined;
  onError: (error: string | undefined) => void;
}

function useDebouncedUrlPreview(urlValue: string): string | undefined {
  const [urlPreview, setUrlPreview] = useState<string | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = urlValue.trim();
    const next = isValidHttpUrl(trimmed) ? trimmed : undefined;
    debounceRef.current = setTimeout(() => {
      setUrlPreview(next);
    }, next ? URL_PREVIEW_DELAY_MS : 0);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [urlValue]);

  return urlPreview;
}

function useAddSlot(
  imageCount: number,
  onUploadFile: (file: File) => Promise<string | null>,
) {
  const [addMode, setAddMode] = useState<AddMode>('url');
  const [urlValue, setUrlValue] = useState('');
  const urlPreview = useDebouncedUrlPreview(urlValue);
  const [pendingFile, setPendingFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | undefined>();
  const [addUploading, setAddUploading] = useState(false);
  const [slotError, setSlotError] = useState<string | undefined>();

  function reset() {
    setUrlValue('');
    setPendingFile(undefined);
    setPreview(undefined);
    setSlotError(undefined);
  }

  function handleModeChange(next: AddMode) {
    setAddMode(next);
    reset();
  }

  function handleUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUrlValue(event.target.value);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    processImageFile(file, setSlotError, () => {}, setPendingFile, setPreview);
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const file = [...event.clipboardData.items]
      .find(item => item.kind === 'file' && item.type.startsWith('image/'))
      ?.getAsFile();
    if (!file) return;
    processImageFile(file, setSlotError, () => {}, setPendingFile, setPreview);
  }

  async function resolveNewImage(): Promise<CatalogImage | string | null> {
    if (addMode === 'url') {
      const source = urlValue.trim();
      if (!source) return 'Enter an image URL.';
      return { src: source, alt: '', order: imageCount };
    }
    if (!pendingFile) return 'Select or paste an image first.';
    setAddUploading(true);
    const url = await onUploadFile(pendingFile);
    setAddUploading(false);
    if (!url) return 'Upload failed. Please try again.';
    return { src: url, alt: pendingFile.name.replace(/\.[^.]+$/, ''), order: imageCount };
  }

  return {
    addMode,
    urlValue,
    urlPreview,
    preview,
    addUploading,
    slotError,
    setSlotError,
    reset,
    handleModeChange,
    handleUrlChange,
    handleFileChange,
    handlePaste,
    resolveNewImage,
  };
}

interface AddSlotProperties {
  slot: ReturnType<typeof useAddSlot>;
  isBusy: boolean;
  onAdd: () => Promise<void>;
}

function AddSlot({ slot, isBusy, onAdd }: AddSlotProperties) {
  return (
    <div className={styles['image-list-field__slot']}>
      <div className={fieldStyles.labelRow}>
        <span className={fieldStyles.label}>Add image</span>
        <div className={fieldStyles.toggle} role="group" aria-label="Image input method">
          <button
            type="button"
            className={slot.addMode === 'url' ? fieldStyles.toggleActive : fieldStyles.toggleInactive}
            onClick={() => slot.handleModeChange('url')}
          >
            URL
          </button>
          <button
            type="button"
            className={slot.addMode === 'upload' ? fieldStyles.toggleActive : fieldStyles.toggleInactive}
            onClick={() => slot.handleModeChange('upload')}
          >
            Upload
          </button>
        </div>
      </div>

      {slot.addMode === 'url'
        ? (
            <>
              <input
                type="url"
                className={fieldStyles.input}
                placeholder="https://…"
                value={slot.urlValue}
                onChange={slot.handleUrlChange}
                disabled={isBusy}
              />
              {slot.urlPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={slot.urlPreview} alt="Preview" className={fieldStyles.preview} />
              )}
            </>
          )
        : (
            <div className={fieldStyles.uploadArea} tabIndex={0} onPaste={slot.handlePaste}>
              {slot.preview
                ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={slot.preview} alt="Preview" className={fieldStyles.preview} />
                  )
                : (
                    <div className={fieldStyles.uploadPlaceholder}>
                      <span className={fieldStyles.uploadIcon}>↑</span>
                      <span className={fieldStyles.uploadHint}>
                        JPEG, PNG, WebP or HEIC · max 5 MB · or paste
                      </span>
                    </div>
                  )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                className={fieldStyles.fileInput}
                onChange={slot.handleFileChange}
                disabled={isBusy}
              />
            </div>
          )}

      {slot.slotError && (
        <p className={fieldStyles.fieldError} role="alert">{slot.slotError}</p>
      )}

      <button
        type="button"
        className={styles['image-list-field__add-btn']}
        onClick={onAdd}
        disabled={isBusy}
      >
        {slot.addUploading ? 'Uploading…' : '+ Add'}
      </button>
    </div>
  );
}

export function ImageListField({
  defaultImages = [],
  uploading,
  onImagesChange,
  onUploadFile,
  error,
  onError,
}: ImageListFieldProperties) {
  const [images, setImages] = useState<CatalogImage[]>(defaultImages);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const atLimit = images.length >= MAX_IMAGES;
  const slot = useAddSlot(images.length, onUploadFile);
  const isBusy = uploading || slot.addUploading;

  function updateImages(next: CatalogImage[]) {
    setImages(next);
    onImagesChange(next);
  }

  function removeImage(index: number) {
    updateImages(images.filter((_, index_) => index_ !== index));
    onError(undefined);
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    updateImages(next.map((img, index) => ({ ...img, order: index })));
  }

  async function handleAdd() {
    if (atLimit || isBusy) return;
    slot.setSlotError(undefined);
    const result = await slot.resolveNewImage();
    if (typeof result === 'string') {
      slot.setSlotError(result);
      return;
    }
    if (!result) return;
    updateImages([...images, result]);
    slot.reset();
  }

  function handleDragOver(event: React.DragEvent, index: number) {
    event.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    moveImage(dragIndex, index);
    setDragIndex(index);
  }

  return (
    <div className={styles['image-list-field']}>
      <span className={styles['image-list-field__label']}>
        Additional Images
        <span className={styles['image-list-field__label-hint']}>
          {` (${images.length}/${MAX_IMAGES})`}
        </span>
        <span className={styles['image-list-field__optional']}>(optional)</span>
      </span>

      {images.length > 0 && (
        <ol className={styles['image-list-field__list']} aria-label="Additional images">
          {images.map((img, index) => (
            <li
              key={img.src}
              className={styles['image-list-field__item']}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={event => handleDragOver(event, index)}
              onDragEnd={() => setDragIndex(null)}
            >
              <span className={styles['image-list-field__drag-handle']} aria-hidden="true">⠿</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className={styles['image-list-field__thumb']} />
              <span className={styles['image-list-field__alt']}>{img.alt || img.src}</span>
              <div className={styles['image-list-field__order-buttons']}>
                <button
                  type="button"
                  className={styles['image-list-field__order-btn']}
                  onClick={() => moveImage(index, index - 1)}
                  disabled={index === 0}
                  aria-label={`Move image ${index + 1} up`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={styles['image-list-field__order-btn']}
                  onClick={() => moveImage(index, index + 1)}
                  disabled={index === images.length - 1}
                  aria-label={`Move image ${index + 1} down`}
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                className={styles['image-list-field__remove-btn']}
                onClick={() => removeImage(index)}
                aria-label={`Remove image ${index + 1}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ol>
      )}

      {!atLimit && <AddSlot slot={slot} isBusy={isBusy} onAdd={handleAdd} />}

      {atLimit && (
        <p className={styles['image-list-field__limit-msg']} role="status">
          {`Maximum of ${MAX_IMAGES} images reached. Remove one to add another.`}
        </p>
      )}

      {error && (
        <p className={styles['image-list-field__error']} role="alert">{error}</p>
      )}

      <input type="hidden" name="images" value={JSON.stringify(images)} />
    </div>
  );
}
