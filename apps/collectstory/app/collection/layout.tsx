import { Suspense } from 'react';
import { SignOutButton } from '@/components/SignOutButton';
import { createClient } from '@/lib/supabase/server';
import styles from './layout.module.css';

async function CollectionHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <span className={styles.brand}>Collectstory</span>
        <nav className={styles.nav} aria-label="Collection navigation">
          {user && (
            <span className={styles.userEmail}>{user.email}</span>
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
