import Link from 'next/link';
import { ThemeToggle } from '@dezkareid/components/react-client';
import styles from './SiteHeader.module.css';

interface SiteHeaderProperties {
  isAdmin?: boolean;
}

export function SiteHeader({ isAdmin }: SiteHeaderProperties) {
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
          {isAdmin && (
            <Link href="/admin" className={styles.navLink}>
              Admin
            </Link>
          )}
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
