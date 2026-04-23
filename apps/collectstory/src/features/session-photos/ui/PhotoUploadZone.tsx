'use client';

import { useState, useRef } from 'react';
import type { SessionPhoto } from '@/lib/sessions';
import styles from './PhotoUploadZone.module.css';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_PHOTOS = 20;

type Properties = {
  sessionId: string;
  currentCount: number;
  onUploaded: (photo: SessionPhoto) => void;
};

export function PhotoUploadZone({ sessionId, currentCount, onUploaded }: Properties) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const atLimit = currentCount >= MAX_PHOTOS;

  async function uploadFile(file: File) {
    setError(undefined);

    if (!ALLOWED_TYPES.has(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError('File too large. Maximum size is 10 MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/sessions/${sessionId}/photos`, {
        method: 'POST',
        body: formData,
      });

      const json = await response.json() as { id?: string; image_url?: string; position?: number; error?: string };

      if (!response.ok || !json.id) {
        setError(json.error ?? 'Upload failed. Please try again.');
        return;
      }

      onUploaded({ id: json.id, session_id: sessionId, image_url: json.image_url!, position: json.position! });
    }
    catch {
      setError('Upload failed. Please try again.');
    }
    finally {
      setUploading(false);
    }
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (const file of files) {
      await uploadFile(file);
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    await handleFiles(event.dataTransfer.files);
  };

  return (
    <div className={styles['upload-zone__wrapper']}>
      <div
        className={`${styles['upload-zone']} ${isDragOver ? styles['upload-zone--drag-over'] : ''} ${atLimit ? styles['upload-zone--disabled'] : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          if (!atLimit) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={atLimit ? undefined : handleDrop}
        onClick={() => !atLimit && !uploading && inputRef.current?.click()}
        role="button"
        tabIndex={atLimit ? -1 : 0}
        aria-disabled={atLimit}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (!atLimit) inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className={styles['upload-zone__input']}
          disabled={atLimit || uploading}
          onChange={event => handleFiles(event.target.files)}
          aria-label="Upload photo"
        />

        {uploading
          ? <p className={styles['upload-zone__label']}>Uploading…</p>
          : (atLimit
              ? (
                  <p className={styles['upload-zone__label']}>
                    Maximum of
                    {MAX_PHOTOS}
                    {' '}
                    photos reached
                  </p>
                )
              : (
                  <>
                    <span className={styles['upload-zone__icon']} aria-hidden="true">📤</span>
                    <p className={styles['upload-zone__label']}>Drop a photo here or click to upload</p>
                    <p className={styles['upload-zone__hint']}>JPEG, PNG or WebP · max 10 MB</p>
                  </>
                ))}
      </div>

      {error && (
        <p className={styles['upload-zone__error']} role="alert">{error}</p>
      )}
    </div>
  );
}
