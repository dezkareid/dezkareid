'use client';

import { useActionState, useState, useTransition } from 'react';
import Link from 'next/link';
import { ImageField } from './ImageField';
import styles from './form.module.css';

interface StoreDefaults {
  name?: string;
  url?: string | undefined;
  country?: string | undefined;
  city?: string | undefined;
  lat?: number | undefined;
  lng?: number | undefined;
  verified?: boolean;
  cover_url?: string | undefined;
  logo_url?: string | undefined;
  address?: string | undefined;
  google_place_id?: string | undefined;
}

interface StoreFormProperties {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: StoreDefaults;
  submitLabel: string;
}

async function uploadFile(file: File): Promise<{ url: string } | { error: string }> {
  const data = new FormData();
  data.set('file', file);
  const response = await fetch('/api/upload', { method: 'POST', body: data });
  const result = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !result.url) return { error: result.error ?? 'Upload failed. Please try again.' };
  return { url: result.url };
}

function makeFormAction(action: (formData: FormData) => Promise<void>) {
  return async (_previous: { error: string } | undefined, formData: FormData) => {
    try {
      await action(formData);
      return;
    }
    catch (error) {
      return { error: error instanceof Error ? error.message : 'An unexpected error occurred.' };
    }
  };
}

async function resolveImageUrl(
  fieldName: string,
  form: HTMLFormElement,
  pendingFile: File | undefined,
  uploadedUrl: string | undefined,
  setUploading: (v: boolean) => void,
  setError: (v: string) => void,
  setUrl: (v: string) => void,
  setPending: (v: File | undefined) => void,
  data: FormData,
): Promise<boolean> {
  const fileInput = form.elements.namedItem(fieldName) as HTMLInputElement;
  const file = fileInput?.files?.[0] ?? pendingFile;
  if (file) {
    setUploading(true);
    const result = await uploadFile(file).catch(() => ({ error: 'Upload failed.' }));
    setUploading(false);
    if ('error' in result) {
      setError(result.error);
      return false;
    }
    setUrl(result.url);
    setPending(undefined);
    data.set(`${fieldName.replace('_file', '_url')}`, result.url);
  }
  else if (uploadedUrl) {
    data.set(`${fieldName.replace('_file', '_url')}`, uploadedUrl);
  }

  return true;
}

function StoreBasicFields({ defaultValues }: { defaultValues?: StoreDefaults }) {
  return (
    <>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          {'Name '}
          <span aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          className={styles.input}
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="url" className={styles.label}>Website URL</label>
        <input
          id="url"
          name="url"
          type="url"
          defaultValue={defaultValues?.url ?? ''}
          className={styles.input}
          placeholder="https://"
        />
      </div>

      <div className={styles.fieldCheckbox}>
        <input
          id="verified"
          name="verified"
          type="checkbox"
          defaultChecked={defaultValues?.verified ?? false}
          className={styles.checkbox}
          value="true"
        />
        <label htmlFor="verified" className={styles.label}>Verified store</label>
      </div>
    </>
  );
}

function StoreLocationFields({ defaultValues }: { defaultValues?: StoreDefaults }) {
  return (
    <>
      <div className={styles.field}>
        <label htmlFor="country" className={styles.label}>Country</label>
        <input id="country" name="country" type="text" defaultValue={defaultValues?.country ?? ''} className={styles.input} />
      </div>

      <div className={styles.field}>
        <label htmlFor="city" className={styles.label}>City</label>
        <input id="city" name="city" type="text" defaultValue={defaultValues?.city ?? ''} className={styles.input} />
      </div>

      <div className={styles.field}>
        <label htmlFor="address" className={styles.label}>Address</label>
        <input id="address" name="address" type="text" defaultValue={defaultValues?.address ?? ''} className={styles.input} />
      </div>
    </>
  );
}

function StoreMapFields({ defaultValues }: { defaultValues?: StoreDefaults }) {
  return (
    <>
      <div className={styles.field}>
        <label htmlFor="lat" className={styles.label}>Latitude</label>
        <input id="lat" name="lat" type="number" step="any" defaultValue={defaultValues?.lat ?? ''} className={styles.input} placeholder="e.g. 35.6762" />
      </div>

      <div className={styles.field}>
        <label htmlFor="lng" className={styles.label}>Longitude</label>
        <input id="lng" name="lng" type="number" step="any" defaultValue={defaultValues?.lng ?? ''} className={styles.input} placeholder="e.g. 139.6503" />
      </div>

      <div className={styles.field}>
        <label htmlFor="google_place_id" className={styles.label}>
          Google Place ID
          <span className={styles.helpText}> — used for map embed and reviews</span>
        </label>
        <input id="google_place_id" name="google_place_id" type="text" defaultValue={defaultValues?.google_place_id ?? ''} className={styles.input} placeholder="ChIJ..." />
      </div>
    </>
  );
}

export function StoreForm({ action, defaultValues, submitLabel }: StoreFormProperties) {
  const [state, formAction, pending] = useActionState(makeFormAction(action), undefined);
  const [, startTransition] = useTransition();

  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadedUrl, setCoverUploadedUrl] = useState<string | undefined>(defaultValues?.cover_url);
  const [coverPendingFile, setCoverPendingFile] = useState<File | undefined>();
  const [coverFileError, setCoverFileError] = useState<string | undefined>();

  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadedUrl, setLogoUploadedUrl] = useState<string | undefined>(defaultValues?.logo_url);
  const [logoPendingFile, setLogoPendingFile] = useState<File | undefined>();
  const [logoFileError, setLogoFileError] = useState<string | undefined>();

  const isBusy = pending || coverUploading || logoUploading;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (coverFileError || logoFileError) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const coverOk = await resolveImageUrl(
      'cover_file', form, coverPendingFile, coverUploadedUrl,
      setCoverUploading, (error) => { setCoverFileError(error); },
      setCoverUploadedUrl, setCoverPendingFile, data,
    );
    if (!coverOk) return;

    const logoOk = await resolveImageUrl(
      'logo_file', form, logoPendingFile, logoUploadedUrl,
      setLogoUploading, (error) => { setLogoFileError(error); },
      setLogoUploadedUrl, setLogoPendingFile, data,
    );
    if (!logoOk) return;

    startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <StoreBasicFields defaultValues={defaultValues} />
      <StoreLocationFields defaultValues={defaultValues} />
      <StoreMapFields defaultValues={defaultValues} />

      <ImageField
        key="cover"
        label="Cover image"
        defaultImageUrl={defaultValues?.cover_url}
        uploading={coverUploading}
        onUploadedUrl={setCoverUploadedUrl}
        onFile={setCoverPendingFile}
        onFileError={setCoverFileError}
        fileError={coverFileError}
        fieldName="cover"
      />

      <ImageField
        key="logo"
        label="Logo"
        defaultImageUrl={defaultValues?.logo_url}
        uploading={logoUploading}
        onUploadedUrl={setLogoUploadedUrl}
        onFile={setLogoPendingFile}
        onFileError={setLogoFileError}
        fileError={logoFileError}
        fieldName="logo"
      />

      {state?.error && (
        <p className={styles.formError} role="alert">{state.error}</p>
      )}

      <div className={styles.actions}>
        <button type="submit" disabled={isBusy} className={styles.submitButton}>
          {coverUploading || logoUploading ? 'Uploading…' : (pending ? 'Saving…' : submitLabel)}
        </button>
        <Link href="/admin/stores" className={styles.cancelLink}>Cancel</Link>
      </div>
    </form>
  );
}
