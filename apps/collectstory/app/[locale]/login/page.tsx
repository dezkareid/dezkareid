import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Button } from '@dezkareid/components/react-server';
import { signInWithGoogle } from './actions';
import styles from './login.module.css';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Collectstory to manage your collection.',
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  async function handleGoogle() {
    'use server';
    const { next } = await searchParams;
    const url = await signInWithGoogle(next);
    redirect(url);
  }

  return (
    <main className={styles['login']}>
      <div className={styles['login__card']}>
        <h1 className={styles['login__title']}>Welcome to Collectstory</h1>
        <p className={styles['login__subtitle']}>Sign in to manage your collection</p>

        <div className={styles['login__actions']}>
          <form action={handleGoogle}>
            <Button type="submit" variant="secondary" className={styles['login__provider-button']}>
              Continue with Google
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
