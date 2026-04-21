'use client';

import { useEffect, useRef, useState } from 'react';
import { processImageFile } from './image-utilities';
import styles from './ImageField.module.css';

const URL_PREVIEW_DELAY_MS = 600;

type Mode = 'url' | 'upload';

interface ImageFieldProperties {
  defaultImageUrl?: string;
  uploading: boolean;
  onUploadedUrl: (url: string | undefined) => void;
  onFile: (file: File | undefined) => void;
  onFileError: (error: string | undefined) => void;
  fileError: string | undefined;
  label?: string;
  required?: boolean;
  /** Prefix for input name/id attributes. Defaults to "image" → names "image_url"/"image_file" */
  fieldName?: string;
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  }
  catch {
    return false;
  }
}

function useDebouncedUrlPreview(urlValue: string): string | undefined {
  const [urlPreview, setUrlPreview] = useState<string | undefined>(() => {
    const trimmed = urlValue.trim();
    return isValidHttpUrl(trimmed) ? trimmed : undefined;
  });
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

type UploadAreaProperties = {
  fileInputId: string;
  fileInputName: string;
  preview: string | undefined;
  uploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPaste: (event: React.ClipboardEvent<HTMLDivElement>) => void;
};

function UploadArea({ fileInputId, fileInputName, preview, uploading, onFileChange, onPaste }: UploadAreaProperties) {
  return (
    <div className={styles.uploadArea} tabIndex={0} onPaste={onPaste}>
      {preview
        ? (
          // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className={styles.preview} />
          )
        : (
            <div className={styles.uploadPlaceholder}>
              <span className={styles.uploadIcon}>↑</span>
              <span className={styles.uploadHint}>
                JPEG, PNG, WebP or HEIC · max 5 MB · or paste
              </span>
            </div>
          )}
      <input
        id={fileInputId}
        name={fileInputName}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        className={styles.fileInput}
        onChange={onFileChange}
        disabled={uploading}
      />
    </div>
  );
}

export function ImageField({
  defaultImageUrl,
  uploading,
  onUploadedUrl,
  onFile,
  onFileError,
  fileError,
  label = 'Image',
  required = false,
  fieldName = 'image',
}: ImageFieldProperties) {
  const urlInputId = `${fieldName}_url`;
  const urlInputName = `${fieldName}_url`;
  const fileInputId = `${fieldName}_file`;
  const fileInputName = `${fieldName}_file`;
  const [mode, setMode] = useState<Mode>('url');
  const [preview, setPreview] = useState<string | undefined>();
  const [urlValue, setUrlValue] = useState(defaultImageUrl ?? '');
  const urlPreview = useDebouncedUrlPreview(urlValue);

  function handleModeChange(next: Mode) {
    setMode(next);
    onFileError(undefined);
    onUploadedUrl(undefined);
    setPreview(undefined);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    processImageFile(file, onFileError, onUploadedUrl, onFile, setPreview);
    event.target.value = '';
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const file = [...event.clipboardData.items]
      .find(item => item.kind === 'file' && item.type.startsWith('image/'))
      ?.getAsFile();
    if (!file) return;
    processImageFile(file, onFileError, onUploadedUrl, onFile, setPreview);
  }

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <span className={styles.label}>
          {label}
          {!required && <span className={styles.optional}>(optional)</span>}
        </span>
        <div className={styles.toggle} role="group" aria-label="Image input method">
          <button
            type="button"
            className={mode === 'url' ? styles.toggleActive : styles.toggleInactive}
            onClick={() => handleModeChange('url')}
          >
            URL
          </button>
          <button
            type="button"
            className={mode === 'upload' ? styles.toggleActive : styles.toggleInactive}
            onClick={() => handleModeChange('upload')}
          >
            Upload
          </button>
        </div>
      </div>

      {mode === 'url'
        ? (
            <>
              <input
                id={urlInputId}
                name={urlInputName}
                type="url"
                className={styles.input}
                placeholder="https://…"
                value={urlValue}
                onChange={event => setUrlValue(event.target.value)}
              />
              {urlPreview && (
              // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={urlPreview}
                  alt="Preview"
                  className={styles.preview}
                />
              )}
            </>
          )
        : (
            <UploadArea
              fileInputId={fileInputId}
              fileInputName={fileInputName}
              preview={preview}
              uploading={uploading}
              onFileChange={handleFileChange}
              onPaste={handlePaste}
            />
          )}

      {fileError && (
        <p className={styles.fieldError} role="alert">{fileError}</p>
      )}
    </div>
  );
}
