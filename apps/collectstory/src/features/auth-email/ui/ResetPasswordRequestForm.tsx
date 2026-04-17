'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@dezkareid/components/react';
import { requestPasswordReset } from '@/app/[locale]/reset-password/actions';
import styles from './ResetPasswordRequestForm.module.css';

export function ResetPasswordRequestForm() {
  const t = useTranslations('Login');
  const [state, formAction, isPending] = useActionState(requestPasswordReset, undefined);
  const isSuccess = state && 'success' in state;
  const errorMessage = state && 'error' in state ? state.error : undefined;

  if (isSuccess) {
    return (
      <div className={styles['reset-request__success']} role="status">
        <p className={styles['reset-request__success-message']}>
          {t('reset_password.success')}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={styles['reset-request']} noValidate>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles['reset-request__live-region']}
      >
        {errorMessage && (
          <p className={styles['reset-request__error']} id="reset-request-error">
            {errorMessage}
          </p>
        )}
      </div>

      <div className={styles['reset-request__field']}>
        <label htmlFor="reset-email" className={styles['reset-request__label']}>
          {t('reset_password.email_label')}
        </label>
        <input
          id="reset-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t('reset_password.email_placeholder')}
          className={styles['reset-request__input']}
          disabled={isPending}
          aria-describedby={errorMessage ? 'reset-request-error' : undefined}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className={styles['reset-request__button']}
        disabled={isPending}
      >
        {isPending ? t('reset_password.submitting') : t('reset_password.submit')}
      </Button>
    </form>
  );
}
