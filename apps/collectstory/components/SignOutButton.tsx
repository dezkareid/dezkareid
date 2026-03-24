'use client';

import { signOut } from '@/app/collection/actions';
import styles from './SignOutButton.module.css';

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className={styles.button}>
        Sign out
      </button>
    </form>
  );
}
