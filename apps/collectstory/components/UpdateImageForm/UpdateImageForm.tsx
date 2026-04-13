'use client';

import { useState } from 'react';
import { updateItemImage } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import styles from './UpdateImageForm.module.css';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);
const MAX_BYTES = 5 * 1024 * 1024;

type Properties = {
  itemId: string;
  username: string;
  collectionSlug: string;
  onSuccess: (newUrl: string) => void;
};

function isHeicFile(file: File) {
  return file.type === 'image/heic' || file.type === 'image/heif'
    || /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name);
}

async function toUploadBlob(file: File): Promise<{ blob: Blob; error?: never } | { blob?: never; error: string }> {
  if (isHeicFile(file)) {
    try {
      const heic2anyModule = await import('heic2any');
      const heic2any = heic2anyModule.default ?? heic2anyModule;
      const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
      const blob = Array.isArray(result) ? result[0] : result;
      return { blob };
    }
    catch {
      return { error: 'Could not convert HEIC image. Please try a different format.' };
    }
  }
  return { blob: file };
}

export function UpdateImageForm({ itemId, username, collectionSlug, onSuccess }: Properties) {
  const [fileError, setFileError] = useState<string>();
  const [preview, setPreview] = useState<string>();
  const [pendingBlob, setPendingBlob] = useState<Blob>();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'saving' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleFile(file: File) {
    setFileError(undefined);
    setPreview(undefined);
    setPendingBlob(undefined);
    setStatus('idle');

    if (!ALLOWED_TYPES.has(file.type) && !isHeicFile(file)) {
      setFileError('Only JPEG, PNG, WebP, or HEIC images are allowed.');
      return;
    }

    if (file.size > MAX_BYTES) {
      setFileError('Image must be 5 MB or smaller.');
      return;
    }

    const result = await toUploadBlob(file);
    if (result.error) {
      setFileError(result.error);
      return;
    }

    const blob = result.blob as Blob;
    setPendingBlob(blob);
    setPreview(URL.createObjectURL(blob));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    handleFile(file);
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const file = [...event.clipboardData.items]
      .find(item => item.kind === 'file' && item.type.startsWith('image/'))
      ?.getAsFile();
    if (!file) return;
    handleFile(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fileError || !pendingBlob) return;

    setStatus('uploading');
    setErrorMessage(undefined);

    try {
      const uploadData = new FormData();
      uploadData.set('file', pendingBlob, 'image.jpg');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const result = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !result.url) {
        setStatus('error');
        setErrorMessage(result.error ?? 'Upload failed. Please try again.');
        return;
      }

      setStatus('saving');
      const saveResult = await updateItemImage(itemId, result.url, username, collectionSlug);

      if ('error' in saveResult) {
        setStatus('error');
        setErrorMessage(saveResult.error);
        return;
      }

      setStatus('done');
      onSuccess(result.url);
    }
    catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  }

  const isBusy = status === 'uploading' || status === 'saving';

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div
        className={styles.uploadArea}
        tabIndex={0}
        onPaste={handlePaste}
      >
        {preview
          ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="New image preview" className={styles.preview} />
            )
          : (
              <div className={styles.placeholder}>
                <span className={styles.placeholderIcon}>↑</span>
                <span className={styles.placeholderHint}>Replace image · or paste</span>
              </div>
            )}
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          className={styles.fileInput}
          onChange={handleFileChange}
          disabled={isBusy}
        />
      </div>

      {fileError && <p className={styles.fieldError} role="alert">{fileError}</p>}
      {status === 'error' && errorMessage && (
        <p className={styles.fieldError} role="alert">{errorMessage}</p>
      )}
      {status === 'done' && (
        <p className={styles.success} role="status">Image updated!</p>
      )}

      {preview && !isBusy && status !== 'done' && (
        <button type="submit" className={styles.submitButton} disabled={isBusy}>
          Save Image
        </button>
      )}

      {isBusy && (
        <p className={styles.statusText}>
          {status === 'uploading' ? 'Uploading…' : 'Saving…'}
        </p>
      )}
    </form>
  );
}
