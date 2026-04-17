'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@dezkareid/components/react';
import { updatePassword, type UpdatePasswordState } from '@/app/[locale]/reset-password/actions';
import styles from './NewPasswordForm.module.css';

export function NewPasswordForm() {
  const t = useTranslations('Login');
  const [sessionReady, setSessionReady] = useState(false);
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const confirmRef = useRef<HTMLInputElement>(null);
  const [state, formAction, isPending] = useActionState(updatePassword, undefined as UpdatePasswordState);
  const errorMessage = state && 'error' in state ? state.error : undefined;

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!sessionReady) {
    return (
      <p className={styles['new-password__loading']} aria-live="polite">
        {t('new_password.loading')}
      </p>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirm = confirmRef.current?.value ?? '';

    if (password === confirm) {
      setConfirmError(undefined);
    }
    else {
      event.preventDefault();
      setConfirmError(t('new_password.confirm_error'));
      confirmRef.current?.focus();
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className={styles['new-password']} noValidate>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles['new-password__live-region']}
      >
        {errorMessage && (
          <p className={styles['new-password__error']} id="new-password-error">
            {errorMessage}
          </p>
        )}
      </div>

      <div className={styles['new-password__field']}>
        <label htmlFor="new-password-input" className={styles['new-password__label']}>
          {t('new_password.password_label')}
        </label>
        <input
          id="new-password-input"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder={t('new_password.password_placeholder')}
          className={styles['new-password__input']}
          disabled={isPending}
          aria-describedby={errorMessage ? 'new-password-error' : undefined}
        />
      </div>

      <div className={styles['new-password__field']}>
        <label htmlFor="new-password-confirm" className={styles['new-password__label']}>
          {t('new_password.confirm_label')}
        </label>
        <input
          id="new-password-confirm"
          ref={confirmRef}
          type="password"
          required
          autoComplete="new-password"
          placeholder={t('new_password.confirm_placeholder')}
          className={`${styles['new-password__input']} ${confirmError ? styles['new-password__input--error'] : ''}`}
          disabled={isPending}
          aria-describedby={confirmError ? 'new-password-confirm-error' : undefined}
        />
        {confirmError && (
          <p id="new-password-confirm-error" className={styles['new-password__field-error']} role="alert">
            {confirmError}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        className={styles['new-password__button']}
        disabled={isPending}
      >
        {isPending ? t('new_password.submitting') : t('new_password.submit')}
      </Button>
    </form>
  );
}
