'use client';

import { useState } from 'react';
import styles from './ImageField.module.css';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

type Mode = 'url' | 'upload';

interface ImageFieldProperties {
  defaultImageUrl?: string;
  uploading: boolean;
  onUploadedUrl: (url: string | undefined) => void;
  onFileError: (error: string | undefined) => void;
  fileError: string | undefined;
}

export function ImageField({
  defaultImageUrl,
  uploading,
  onUploadedUrl,
  onFileError,
  fileError,
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
    onFileError(undefined);
    onUploadedUrl(undefined);
    setPreview(undefined);
    if (!file) return;
    if (!ALLOWED_TYPES.has(file.type)) {
      onFileError('Only JPEG, PNG, and WebP images are allowed.');
      event.target.value = '';
      return;
    }
    if (file.size > MAX_BYTES) {
      onFileError('Image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <span className={styles.label}>
          Image
          <span className={styles.optional}>(optional)</span>
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
                id="image_file"
                name="image_file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
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
