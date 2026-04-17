import type { Metadata } from 'next';
import { ResetPasswordFlow } from './ResetPasswordFlow';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your Collectstory password.',
};

export default function ResetPasswordPage() {
  return (
    <main className={styles['reset-password']}>
      <div className={styles['reset-password__card']}>
        <h1 className={styles['reset-password__title']}>Reset your password</h1>
        <ResetPasswordFlow />
      </div>
    </main>
  );
}
