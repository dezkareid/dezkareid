'use client';

import { useActionState, useState, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@dezkareid/components/react';
import { signInWithEmail, type AuthState } from '@/app/[locale]/login/actions';
import { SignUpModal } from './SignUpModal';
import styles from './EmailPasswordForm.module.css';

export function EmailPasswordForm() {
  const t = useTranslations('Login');
  const [state, formAction, isPending] = useActionState(signInWithEmail, undefined as AuthState);
  const [modalOpen, setModalOpen] = useState(false);
  const errorMessage = state && 'error' in state ? state.error : undefined;

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <form action={formAction} className={styles['auth-form']} noValidate>
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={styles['auth-form__live-region']}
        >
          {errorMessage && (
            <p className={styles['auth-form__error']} id="auth-form-error">
              {errorMessage}
            </p>
          )}
        </div>

        <div className={styles['auth-form__field']}>
          <label htmlFor="auth-email" className={styles['auth-form__label']}>
            {t('sign_in.email_label')}
          </label>
          <input
            id="auth-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t('sign_in.email_placeholder')}
            className={styles['auth-form__input']}
            disabled={isPending}
            aria-describedby={errorMessage ? 'auth-form-error' : undefined}
          />
        </div>

        <div className={styles['auth-form__field']}>
          <label htmlFor="auth-password" className={styles['auth-form__label']}>
            {t('sign_in.password_label')}
          </label>
          <input
            id="auth-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            placeholder={t('sign_in.password_placeholder')}
            className={styles['auth-form__input']}
            disabled={isPending}
            aria-describedby={errorMessage ? 'auth-form-error' : undefined}
          />
        </div>

        <Link href="/en/reset-password" className={styles['auth-form__forgot']}>
          {t('sign_in.forgot_password')}
        </Link>

        <Button
          type="submit"
          variant="primary"
          className={styles['auth-form__button']}
          disabled={isPending}
        >
          {isPending ? t('sign_in.submitting') : t('sign_in.submit')}
        </Button>
      </form>

      <div className={styles['auth-form__divider']} aria-hidden="true">
        <span className={styles['auth-form__divider-text']}>{t('or')}</span>
      </div>

      <Button
        type="button"
        variant="secondary"
        className={styles['auth-form__button']}
        onClick={openModal}
      >
        {t('sign_up.button')}
      </Button>

      <SignUpModal open={modalOpen} onClose={closeModal} />
    </>
  );
}
