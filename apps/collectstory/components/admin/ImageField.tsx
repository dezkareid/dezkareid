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

export function ImageField({
  defaultImageUrl,
  uploading,
  onUploadedUrl,
  onFile,
  onFileError,
  fileError,
  label = 'Image',
  required = false,
}: ImageFieldProperties) {
  const [mode, setMode] = useState<Mode>('url');
  const [uploadPreview, setUploadPreview] = useState<string | undefined>();
  const [urlValue, setUrlValue] = useState(defaultImageUrl ?? '');
  const urlPreview = useDebouncedUrlPreview(urlValue);

  function handleModeChange(next: Mode) {
    setMode(next);
    onFileError(undefined);
    onUploadedUrl(undefined);
    setUploadPreview(undefined);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    processImageFile(file, onFileError, onUploadedUrl, onFile, setUploadPreview);
    event.target.value = '';
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const file = [...event.clipboardData.items]
      .find(item => item.kind === 'file' && item.type.startsWith('image/'))
      ?.getAsFile();
    if (!file) return;
    processImageFile(file, onFileError, onUploadedUrl, onFile, setUploadPreview);
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
                id="image_url"
                name="image_url"
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
            <div
              className={styles.uploadArea}
              tabIndex={0}
              onPaste={handlePaste}
            >
              {uploadPreview
                ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={uploadPreview} alt="Preview" className={styles.preview} />
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
                id="image_file"
                name="image_file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                className={styles.fileInput}
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
          )}

      {fileError && (
        <p className={styles.fieldError} role="alert">{fileError}</p>
      )}
    </div>
  );
}
