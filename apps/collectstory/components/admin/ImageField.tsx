'use client';

import { useState } from 'react';
import styles from './ImageField.module.css';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);
const MAX_BYTES = 5 * 1024 * 1024;

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

async function processFile(
  file: File,
  onFileError: (error: string | undefined) => void,
  onUploadedUrl: (url: string | undefined) => void,
  onFile: (file: File | undefined) => void,
  setPreview: (url: string | undefined) => void,
): Promise<void> {
  onFileError(undefined);
  onUploadedUrl(undefined);
  onFile(undefined);
  setPreview(undefined);

  const isHeic = file.type === 'image/heic' || file.type === 'image/heif'
    || /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name);

  if (!ALLOWED_TYPES.has(file.type) && !isHeic) {
    onFileError('Only JPEG, PNG, WebP, or HEIC images are allowed.');
    return;
  }

  if (file.size > MAX_BYTES) {
    onFileError('Image must be 5 MB or smaller.');
    return;
  }

  if (isHeic) {
    try {
      const heic2anyModule = await import('heic2any');
      const heic2any = heic2anyModule.default ?? heic2anyModule;
      const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
      const blob = Array.isArray(result) ? result[0] : result;
      onFile(new File([blob], file.name, { type: 'image/jpeg' }));
      setPreview(URL.createObjectURL(blob));
    }
    catch {
      onFileError('Could not convert HEIC image. Please try a different format.');
    }
    return;
  }

  onFile(file);
  setPreview(URL.createObjectURL(file));
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
  const [mode, setMode] = useState<Mode>(defaultImageUrl ? 'url' : 'url');
  const [preview, setPreview] = useState<string | undefined>(
    mode === 'url' ? undefined : defaultImageUrl,
  );
  const [urlValue, setUrlValue] = useState(defaultImageUrl ?? '');

  function handleModeChange(next: Mode) {
    setMode(next);
    onFileError(undefined);
    onUploadedUrl(undefined);
    setPreview(undefined);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file, onFileError, onUploadedUrl, onFile, setPreview);
    event.target.value = '';
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const file = [...event.clipboardData.items]
      .find(item => item.kind === 'file' && item.type.startsWith('image/'))
      ?.getAsFile();
    if (!file) return;
    processFile(file, onFileError, onUploadedUrl, onFile, setPreview);
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
            <input
              id="image_url"
              name="image_url"
              type="url"
              className={styles.input}
              placeholder="https://…"
              value={urlValue}
              onChange={event => setUrlValue(event.target.value)}
            />
          )
        : (
            <div
              className={styles.uploadArea}
              tabIndex={0}
              onPaste={handlePaste}
            >
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
