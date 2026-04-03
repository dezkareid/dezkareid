import Link from 'next/link';
import { ThemeToggle } from '@dezkareid/components/react-client';
import { getSessionAndRole } from '@/lib/auth/role';
import { createClient } from '@/lib/supabase/server';
import styles from './SiteHeader.module.css';

async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .single();
  return data;
}

export async function SiteHeader() {
  const session = await getSessionAndRole();
  const profile = session ? await getUserProfile(session.user.id) : undefined;

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
          {session?.role === 'admin' && (
            <Link href="/admin" className={styles.navLink}>
              Admin
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle cssProcessor="lightningcss" />
          {session
            ? (
                <Link
                  href={profile?.username ? `/${profile.username}` : '/collection'}
                  className={styles.userAvatar}
                  aria-label="My profile"
                >
                  {session.user.email?.[0]?.toUpperCase() ?? '?'}
                </Link>
              )
            : (
                <Link href="/login" className={styles.signIn}>
                  Sign In
                </Link>
              )}
        </div>
      </div>
    </header>
  );
}
