'use client';

import { useActionState, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Modal } from '@dezkareid/components/react';
import { signUpWithEmail, type AuthState } from '@/app/[locale]/login/actions';
import { getPasswordErrors } from '../lib/password';
import styles from './SignUpModal.module.css';

type Properties = {
  open: boolean;
  onClose: () => void;
};

const PASSWORD_RULES = ['min_length', 'max_length', 'uppercase', 'digit', 'symbol'] as const;

export function SignUpModal({ open, onClose }: Properties) {
  const t = useTranslations('Login');
  const [state, formAction, isPending] = useActionState(signUpWithEmail, undefined as AuthState);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([...PASSWORD_RULES]);
  const errorMessage = state && 'error' in state ? state.error : undefined;

  const handleClose = useCallback(() => {
    if (!isPending) onClose();
  }, [isPending, onClose]);

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPasswordErrors(getPasswordErrors(event.target.value));
  }

  const allRulesMet = passwordErrors.length === 0;

  return (
    <Modal open={open} onClose={handleClose} title={t('sign_up.modal_title')}>
      <form action={formAction} className={styles['signup']} noValidate>
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={styles['signup__live-region']}
        >
          {errorMessage && (
            <p className={styles['signup__error']} id="signup-error">
              {errorMessage}
            </p>
          )}
        </div>

        <div className={styles['signup__field']}>
          <label htmlFor="signup-email" className={styles['signup__label']}>
            {t('sign_up.email_label')}
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t('sign_up.email_placeholder')}
            className={styles['signup__input']}
            disabled={isPending}
            aria-describedby={errorMessage ? 'signup-error' : undefined}
          />
        </div>

        <div className={styles['signup__field']}>
          <label htmlFor="signup-username" className={styles['signup__label']}>
            {t('sign_up.username_label')}
          </label>
          <input
            id="signup-username"
            name="username"
            type="text"
            required
            autoComplete="username"
            placeholder={t('sign_up.username_placeholder')}
            className={styles['signup__input']}
            disabled={isPending}
            aria-describedby={errorMessage ? 'signup-error' : undefined}
          />
          <p className={styles['signup__hint']}>{t('sign_up.username_hint')}</p>
        </div>

        <div className={styles['signup__field']}>
          <label htmlFor="signup-password" className={styles['signup__label']}>
            {t('sign_up.password_label')}
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={60}
            autoComplete="new-password"
            placeholder={t('sign_up.password_placeholder')}
            className={styles['signup__input']}
            disabled={isPending}
            aria-describedby="signup-password-rules"
            onChange={handlePasswordChange}
          />
          <ul
            id="signup-password-rules"
            className={styles['signup__rules']}
            aria-label={t('sign_up.password_rules_label')}
          >
            {PASSWORD_RULES.map((rule) => {
              const met = !passwordErrors.includes(rule);
              return (
                <li
                  key={rule}
                  className={`${styles['signup__rule']} ${met ? styles['signup__rule--met'] : ''}`}
                  aria-label={`${met ? t('sign_up.rule_met') : t('sign_up.rule_unmet')}: ${t(`sign_up.rule_${rule}`)}`}
                >
                  <span className={styles['signup__rule-icon']} aria-hidden="true">
                    {met ? '✓' : '○'}
                  </span>
                  {t(`sign_up.rule_${rule}`)}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles['signup__field']}>
          <label htmlFor="signup-confirm" className={styles['signup__label']}>
            {t('sign_up.confirm_label')}
          </label>
          <input
            id="signup-confirm"
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
            placeholder={t('sign_up.confirm_placeholder')}
            className={styles['signup__input']}
            disabled={isPending}
            aria-describedby={errorMessage ? 'signup-error' : undefined}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className={styles['signup__button']}
          disabled={isPending || !allRulesMet}
        >
          {isPending ? t('sign_up.submitting') : t('sign_up.submit')}
        </Button>
      </form>
    </Modal>
  );
}
