import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionAndRole } from '@/lib/auth/role';
import styles from './layout.module.css';

async function AdminGuard({ children }: { children: React.ReactNode }) {
  const session = await getSessionAndRole();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'admin') {
    redirect('/collection');
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/admin" className={styles.brand}>
            Admin
          </Link>
          <nav className={styles.nav} aria-label="Admin navigation">
            <Link href="/admin/brands" className={styles.navLink}>Brands</Link>
            <Link href="/admin/lines" className={styles.navLink}>Lines</Link>
            <Link href="/admin/categories" className={styles.navLink}>Categories</Link>
            <Link href="/admin/stores" className={styles.navLink}>Stores</Link>
          </nav>
          <Link href="/collection" className={styles.backLink}>← My Collection</Link>
        </div>
      </header>
      <main className={styles.main}>
        <Suspense>
          <AdminGuard>
            {children}
          </AdminGuard>
        </Suspense>
      </main>
    </div>
  );
}
