import Link from 'next/link';
import { ThemeToggle } from '@dezkareid/components/react-client';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Collectstory home">
          Collectstory
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/stores" className={styles.navLink}>
            Stores
          </Link>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle cssProcessor="lightningcss" />
          <Link href="/login" className={styles.signIn}>
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
