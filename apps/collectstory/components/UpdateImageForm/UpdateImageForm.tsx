'use client';

import { useState } from 'react';
import { updateItemImage } from '@/app/collection/actions';
import styles from './UpdateImageForm.module.css';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

type Properties = {
  itemId: string;
  onSuccess: (newUrl: string) => void;
};

export function UpdateImageForm({ itemId, onSuccess }: Properties) {
  const [fileError, setFileError] = useState<string>();
  const [preview, setPreview] = useState<string>();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'saving' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFileError(undefined);
    setPreview(undefined);
    setStatus('idle');

    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      setFileError('Only JPEG, PNG, and WebP images are allowed.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_BYTES) {
      setFileError('Image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fileError) return;

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem('image') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) return;

    setStatus('uploading');
    setErrorMessage(undefined);

    try {
      const uploadData = new FormData();
      uploadData.set('file', file);
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
      const saveResult = await updateItemImage(itemId, result.url);

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
      <div className={styles.uploadArea}>
        {preview
          ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="New image preview" className={styles.preview} />
            )
          : (
              <div className={styles.placeholder}>
                <span className={styles.placeholderIcon}>↑</span>
                <span className={styles.placeholderHint}>Replace image</span>
              </div>
            )}
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
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
