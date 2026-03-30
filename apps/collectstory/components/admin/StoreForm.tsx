'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import styles from './form.module.css';

interface StoreDefaults {
  name?: string;
  url?: string | undefined;
  country?: string | undefined;
  city?: string | undefined;
  lat?: number | undefined;
  lng?: number | undefined;
}

interface StoreFormProperties {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: StoreDefaults;
  submitLabel: string;
}

function StoreFields({ defaultValues }: { defaultValues?: StoreDefaults }) {
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
        <label htmlFor="url" className={styles.label}>URL</label>
        <input
          id="url"
          name="url"
          type="url"
          defaultValue={defaultValues?.url ?? ''}
          className={styles.input}
          placeholder="https://"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="country" className={styles.label}>Country</label>
        <input
          id="country"
          name="country"
          type="text"
          defaultValue={defaultValues?.country ?? ''}
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="city" className={styles.label}>City</label>
        <input
          id="city"
          name="city"
          type="text"
          defaultValue={defaultValues?.city ?? ''}
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="lat" className={styles.label}>Latitude</label>
        <input
          id="lat"
          name="lat"
          type="number"
          step="any"
          defaultValue={defaultValues?.lat ?? ''}
          className={styles.input}
          placeholder="e.g. 35.6762"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="lng" className={styles.label}>Longitude</label>
        <input
          id="lng"
          name="lng"
          type="number"
          step="any"
          defaultValue={defaultValues?.lng ?? ''}
          className={styles.input}
          placeholder="e.g. 139.6503"
        />
      </div>
    </>
  );
}

export function StoreForm({ action, defaultValues, submitLabel }: StoreFormProperties) {
  const [, formAction, pending] = useActionState(
    async (_previous: undefined, formData: FormData) => {
      await action(formData);
      return undefined;
    },
    undefined,
  );

  return (
    <form action={formAction} className={styles.form}>
      <StoreFields defaultValues={defaultValues} />
      <div className={styles.actions}>
        <button type="submit" disabled={pending} className={styles.submitButton}>
          {pending ? 'Saving…' : submitLabel}
        </button>
        <Link href="/admin/stores" className={styles.cancelLink}>Cancel</Link>
      </div>
    </form>
  );
}
