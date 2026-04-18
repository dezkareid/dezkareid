import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Button } from '@dezkareid/components/react-server';
import { EmailPasswordForm } from '@/src/features/auth-email';
import { signInWithGoogle } from './actions';
import styles from './login.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Login.metadata');
  return {
    title: t('title'),
    description: t('description'),
  };
}

async function GoogleSignInForm({
  searchParams,
  continueWithGoogle,
}: {
  searchParams: Promise<{ next?: string }>;
  continueWithGoogle: string;
}) {
  const { next } = await searchParams;

  async function handleGoogle() {
    'use server';
    const url = await signInWithGoogle(next);
    redirect(url);
  }

  return (
    <form action={handleGoogle}>
      <Button type="submit" variant="secondary" className={styles['login__provider-button']}>
        {continueWithGoogle}
      </Button>
    </form>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const t = await getTranslations('Login');

  return (
    <div className={styles['login']}>
      <div className={styles['login__card']}>
        <h1 className={styles['login__title']}>{t('welcome')}</h1>
        <p className={styles['login__subtitle']}>{t('subtitle')}</p>

        <div className={styles['login__actions']}>
          <Suspense fallback={(
            <Button type="submit" variant="secondary" className={styles['login__provider-button']} disabled>
              {t('continue_google')}
            </Button>
          )}
          >
            <GoogleSignInForm searchParams={searchParams} continueWithGoogle={t('continue_google')} />
          </Suspense>

          <div className={styles['login__divider']} aria-hidden="true">
            <span className={styles['login__divider-text']}>{t('or')}</span>
          </div>

          <EmailPasswordForm />
        </div>
      </div>
    </div>
  );
}
