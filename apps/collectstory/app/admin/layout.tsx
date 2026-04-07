import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getSessionAndRole } from '@/lib/auth/role';
import styles from './layout.module.css';

async function AdminGuard({ children }: { children: React.ReactNode }) {
  await connection();
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
      <div className={`container ${styles.main}`}>
        <Suspense>
          <AdminGuard>
            {children}
          </AdminGuard>
        </Suspense>
      </div>
    </div>
  );
}
