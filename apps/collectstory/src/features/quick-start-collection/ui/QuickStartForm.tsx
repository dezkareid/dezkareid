'use client';

import { useActionState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { quickStartCollection } from '@/app/[locale]/[username]/actions';
import { useAnalytics } from '@/src/shared/lib/analytics/useAnalytics';
import styles from './QuickStartForm.module.css';

type QuickStartFormProperties = {
  username: string;
  onClose: () => void;
};

type FormFieldProperties = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  hasError: boolean;
  errorId: string;
  errorMessage: string | undefined;
  disabled: boolean;
};

function FormField({
  id,
  name,
  label,
  placeholder,
  inputRef,
  hasError,
  errorId,
  errorMessage,
  disabled,
}: FormFieldProperties) {
  return (
    <div className={styles['quick-start__field']}>
      <label htmlFor={id} className={styles['quick-start__label']}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        required
        placeholder={placeholder}
        className={`${styles['quick-start__input']} ${hasError ? styles['quick-start__input--error'] : ''}`}
        disabled={disabled}
        aria-describedby={hasError ? errorId : undefined}
      />
      {hasError && errorMessage && (
        <p id={errorId} className={styles['quick-start__field-error']} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export function QuickStartForm({ username, onClose }: QuickStartFormProperties) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(quickStartCollection, undefined);
  const { track } = useAnalytics();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state && 'success' in state && state.success) {
      track({
        action: 'onboarding_complete',
        category: 'onboarding',
        label: 'quick_start',
      });
      router.push(`/${username}/${state.collectionSlug}`);
    }
  }, [state, username, router, track]);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );

  const errorField = state && 'field' in state ? state.field : undefined;
  const errorMessage = state && 'error' in state ? state.error : undefined;

  return (
    <div
      className={styles['quick-start-overlay']}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-start-title"
      onClick={handleOverlayClick}
    >
      <div className={styles['quick-start']} ref={dialogRef}>
        <button
          type="button"
          className={styles['quick-start__close']}
          aria-label="Close"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 id="quick-start-title" className={styles['quick-start__title']}>
          Add your first item
        </h2>
        <p className={styles['quick-start__subtitle']}>
          Give your collection a name, then add your first piece.
        </p>

        <form action={formAction} className={styles['quick-start__form']}>
          <input type="hidden" name="username" value={username} />

          <FormField
            id="qs-collection-name"
            name="collectionName"
            label="Collection name"
            placeholder="e.g. Vintage Cameras"
            inputRef={firstInputRef}
            hasError={errorField === 'collectionName'}
            errorId="qs-collection-error"
            errorMessage={errorMessage}
            disabled={isPending}
          />

          <FormField
            id="qs-item-name"
            name="itemName"
            label="First item name"
            placeholder="e.g. Leica M3 (1955)"
            hasError={errorField === 'itemName'}
            errorId="qs-item-error"
            errorMessage={errorMessage}
            disabled={isPending}
          />

          {errorMessage && !errorField && (
            <p className={styles['quick-start__form-error']} role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className={styles['quick-start__submit']}
            disabled={isPending}
          >
            {isPending ? 'Creating…' : 'Create collection'}
          </button>
        </form>
      </div>
    </div>
  );
}
