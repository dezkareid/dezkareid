'use client';

import { useActionState, useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { updateProfile, checkUsernameAvailable } from '@/app/[locale]/profile/edit/actions';
import styles from './EditProfileForm.module.css';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 3 * 1024 * 1024;

type Properties = {
  currentUsername: string | undefined;
  currentAvatarUrl: string | undefined;
};

type Availability = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

type SetString = (value: string | undefined) => void;
type SetBool = (value: boolean) => void;
type SetAvail = (value: Availability) => void;

async function uploadAvatar(file: File): Promise<{ url: string } | { error: string }> {
  const uploadData = new FormData();
  uploadData.set('file', file);
  uploadData.set('type', 'avatar');
  const response = await fetch('/api/upload', { method: 'POST', body: uploadData });
  const result = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !result.url) return { error: result.error ?? 'Upload failed. Please try again.' };
  return { url: result.url };
}

function onFileChange(
  event: React.ChangeEvent<HTMLInputElement>,
  setFileError: SetString,
  setUploadedAvatarUrl: SetString,
  setAvatarPreview: SetString,
) {
  const file = event.target.files?.[0];
  setFileError(undefined);
  setUploadedAvatarUrl(undefined);
  if (!file) return;
  if (!ALLOWED_TYPES.has(file.type)) {
    setFileError('Only JPEG, PNG, and WebP images are allowed.');
    event.target.value = '';
    return;
  }
  if (file.size > MAX_BYTES) {
    setFileError('Image must be 3 MB or smaller.');
    event.target.value = '';
    return;
  }
  setAvatarPreview(URL.createObjectURL(file));
}

function onUsernameChange(
  event: React.ChangeEvent<HTMLInputElement>,
  currentUsername: string | undefined,
  checkTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | undefined>,
  setAvailability: SetAvail,
) {
  const value = event.target.value.trim().toLowerCase();
  if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
  if (!value || value === currentUsername) {
    setAvailability('idle');
    return;
  }
  setAvailability('checking');
  checkTimeoutRef.current = setTimeout(async () => {
    const result = await checkUsernameAvailable(value);
    setAvailability(result.available ? 'available' : 'taken');
  }, 400);
}

async function onSubmit(
  event: React.FormEvent<HTMLFormElement>,
  fileError: string | undefined,
  uploadedAvatarUrl: string | undefined,
  setUploading: SetBool,
  setFileError: SetString,
  setUploadedAvatarUrl: SetString,
  startTransition: (callback: () => void) => void,
  formAction: (data: FormData) => void,
) {
  event.preventDefault();
  if (fileError) return;
  const form = event.currentTarget;
  const data = new FormData(form);
  const fileInput = form.elements.namedItem('avatar') as HTMLInputElement;
  const file = fileInput?.files?.[0];
  if (file && !uploadedAvatarUrl) {
    setUploading(true);
    const result = await uploadAvatar(file).catch(() => ({ error: 'Upload failed. Please try again.' }));
    setUploading(false);
    if ('error' in result) {
      setFileError(result.error);
      return;
    }
    setUploadedAvatarUrl(result.url);
    data.set('avatar_url', result.url);
  }
  else if (uploadedAvatarUrl) {
    data.set('avatar_url', uploadedAvatarUrl);
  }
  startTransition(() => formAction(data));
}

function AvatarPreviewSection({
  avatarPreview,
  currentUsername,
  fileError,
  onFileInputChange,
}: {
  avatarPreview: string | undefined;
  currentUsername: string | undefined;
  fileError: string | undefined;
  onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={styles.avatarRow}>
      <div className={styles.avatarPreview}>
        {avatarPreview
          ? (
              <Image
                src={avatarPreview}
                alt="Avatar preview"
                width={80}
                height={80}
                className={styles.avatarImage}
                unoptimized={avatarPreview.startsWith('blob:')}
              />
            )
          : (
              <div className={styles.avatarPlaceholder} aria-hidden="true">
                {currentUsername?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
      </div>
      <div className={styles.avatarUpload}>
        <label className={styles.avatarLabel} htmlFor="profile-avatar">
          Change photo
        </label>
        <span className={styles.avatarHint}>JPEG, PNG or WebP · max 3 MB</span>
        <input
          id="profile-avatar"
          name="avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={styles.fileInput}
          onChange={onFileInputChange}
        />
        {fileError && <p className={styles.fieldError} role="alert">{fileError}</p>}
      </div>
    </div>
  );
}

function UsernameField({
  currentUsername,
  availability,
  onUsernameInputChange,
}: {
  currentUsername: string | undefined;
  availability: Availability;
  onUsernameInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="profile-username">
        Username
        {' '}
        <span className={styles.required}>*</span>
      </label>
      <div className={styles.inputWrapper}>
        <input
          id="profile-username"
          name="username"
          type="text"
          className={styles.input}
          defaultValue={currentUsername ?? ''}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          onChange={onUsernameInputChange}
          required
        />
        {availability === 'checking' && (
          <span className={styles.availabilityChecking}>checking…</span>
        )}
        {availability === 'available' && (
          <span className={styles.availabilityOk}>✓ available</span>
        )}
        {availability === 'taken' && (
          <span className={styles.availabilityTaken}>✗ taken</span>
        )}
      </div>
      <p className={styles.hint}>
        Lowercase letters, digits, and hyphens only. Min 3 characters.
        Your items will be at /
        <em>username</em>
        /items/…
      </p>
    </div>
  );
}

export function EditProfileForm({ currentUsername, currentAvatarUrl }: Properties) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);
  const [, startTransition] = useTransition();
  const [fileError, setFileError] = useState<string>();
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(currentAvatarUrl);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [availability, setAvailability] = useState<Availability>('idle');
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isBusy = pending || uploading;

  return (
    <form
      onSubmit={event => onSubmit(event, fileError, uploadedAvatarUrl, setUploading, setFileError, setUploadedAvatarUrl, startTransition, formAction)}
      className={styles.form}
      noValidate
    >
      {state && 'error' in state && (
        <p className={styles.formError} role="alert">{state.error}</p>
      )}
      {state && 'success' in state && (
        <p className={styles.formSuccess} role="status">Profile saved!</p>
      )}

      <AvatarPreviewSection
        avatarPreview={avatarPreview}
        currentUsername={currentUsername}
        fileError={fileError}
        onFileInputChange={event => onFileChange(event, setFileError, setUploadedAvatarUrl, setAvatarPreview)}
      />

      <UsernameField
        currentUsername={currentUsername}
        availability={availability}
        onUsernameInputChange={event => onUsernameChange(event, currentUsername, checkTimeoutRef, setAvailability)}
      />

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton} disabled={isBusy}>
          {uploading ? 'Uploading…' : (pending ? 'Saving…' : 'Save Profile')}
        </button>
      </div>
    </form>
  );
}
