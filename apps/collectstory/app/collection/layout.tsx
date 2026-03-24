import { SignOutButton } from '@/components/SignOutButton';
import { createClient } from '@/lib/supabase/server';
import styles from './layout.module.css';

export default async function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className={styles.shell}>
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
      <main className={styles.main}>{children}</main>
    </div>
  );
}
