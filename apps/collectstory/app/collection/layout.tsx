import { Suspense } from 'react';
import Link from 'next/link';
import { SignOutButton } from '@/components/SignOutButton';
import { getSessionAndRole } from '@/lib/auth/role';
import styles from './layout.module.css';

async function CollectionHeader() {
  const session = await getSessionAndRole();

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <span className={styles.brand}>Collectstory</span>
        <nav className={styles.nav} aria-label="Collection navigation">
          {session && (
            <span className={styles.userEmail}>{session.user.email}</span>
          )}
          {session?.role === 'admin' && (
            <Link href="/admin" className={styles.adminLink}>Admin</Link>
          )}
          <SignOutButton />
        </nav>
      </div>
    </header>
  );
}

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <Suspense>
        <CollectionHeader />
      </Suspense>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
