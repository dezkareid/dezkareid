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
  /** Prefix for input name/id attributes. Defaults to "image" → names "image_url"/"image_file" */
  fieldName?: string;
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
              id={urlInputId}
              name={urlInputName}
              type="url"
              className={styles.input}
              placeholder="https://…"
              value={urlValue}
              onChange={event => setUrlValue(event.target.value)}
            />
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
