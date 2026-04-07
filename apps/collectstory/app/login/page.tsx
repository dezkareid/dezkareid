import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { signInWithGoogle } from './actions';
import styles from './login.module.css';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Collectstory to manage your collection.',
};

async function handleGoogle() {
  'use server';
  const url = await signInWithGoogle();
  redirect(url);
}

export default function LoginPage() {
  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to Collectstory</h1>
        <p className={styles.subtitle}>Sign in to manage your collection</p>

        <div className={styles.actions}>
          <form action={handleGoogle}>
            <button type="submit" className={styles.providerButton}>
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
