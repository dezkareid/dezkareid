'use client';

import { useActionState, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@dezkareid/components/react';
import { changePassword, type ChangePasswordState } from '@/app/[locale]/profile/edit/actions';
import styles from './ChangePasswordForm.module.css';

export function ChangePasswordForm() {
  const t = useTranslations('Login');
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const confirmRef = useRef<HTMLInputElement>(null);
  const [state, formAction, isPending] = useActionState(changePassword, undefined as ChangePasswordState);
  const isSuccess = state && 'success' in state;
  const errorMessage = state && 'error' in state ? state.error : undefined;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirm = confirmRef.current?.value ?? '';

    if (password === confirm) {
      setConfirmError(undefined);
    }
    else {
      event.preventDefault();
      setConfirmError(t('change_password.confirm_error'));
      confirmRef.current?.focus();
    }
  }

  return (
    <section className={styles['change-password']} aria-labelledby="change-password-heading">
      <h2 id="change-password-heading" className={styles['change-password__heading']}>
        {t('change_password.section_title')}
      </h2>

      <form action={formAction} onSubmit={handleSubmit} className={styles['change-password__form']} noValidate>
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={styles['change-password__live-region']}
        >
          {isSuccess && (
            <p className={styles['change-password__success']}>
              {t('change_password.success')}
            </p>
          )}
          {errorMessage && (
            <p className={styles['change-password__error']} id="change-password-error">
              {errorMessage}
            </p>
          )}
        </div>

        <div className={styles['change-password__field']}>
          <label htmlFor="change-password-input" className={styles['change-password__label']}>
            {t('change_password.password_label')}
          </label>
          <input
            id="change-password-input"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder={t('change_password.password_placeholder')}
            className={styles['change-password__input']}
            disabled={isPending}
            aria-describedby={errorMessage ? 'change-password-error' : undefined}
          />
        </div>

        <div className={styles['change-password__field']}>
          <label htmlFor="change-password-confirm" className={styles['change-password__label']}>
            {t('change_password.confirm_label')}
          </label>
          <input
            id="change-password-confirm"
            ref={confirmRef}
            type="password"
            required
            autoComplete="new-password"
            placeholder={t('change_password.confirm_placeholder')}
            className={`${styles['change-password__input']} ${confirmError ? styles['change-password__input--error'] : ''}`}
            disabled={isPending}
            aria-describedby={confirmError ? 'change-password-confirm-error' : undefined}
          />
          {confirmError && (
            <p id="change-password-confirm-error" className={styles['change-password__field-error']} role="alert">
              {confirmError}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className={styles['change-password__button']}
          disabled={isPending}
        >
          {isPending ? t('change_password.submitting') : t('change_password.submit')}
        </Button>
      </form>
    </section>
  );
}
