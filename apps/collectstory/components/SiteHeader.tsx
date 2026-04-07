import { Suspense } from 'react';
import Link from 'next/link';
import { connection } from 'next/server';
import { ThemeToggleWrapper } from './ThemeToggleWrapper';
import { AdminMenu } from './AdminMenu/AdminMenu';
import { UserMenu } from './UserMenu/UserMenu';
import { Shelves } from '@dezkareid/icons/react';
import { getSessionAndRole } from '@/lib/auth/role';
import { createClient } from '@/lib/supabase/server';
import { siteData } from '@/lib/mock-data';
import styles from './SiteHeader.module.css';

async function HeaderAuthSlot() {
  await connection();
  const session = await getSessionAndRole();

  if (!session) {
    return (
      <div className={styles.navActions}>
        <nav className={styles.nav} aria-label="Main navigation" />
        <div className={styles.actions}>
          <ThemeToggleWrapper />
          <Link href="/login" className={styles.signIn}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', session.user.id)
    .single();

  return (
    <div className={styles.navActions}>
      <nav className={styles.nav} aria-label="Main navigation">
        {profile?.username && (
          <Link href={`/${profile.username}`} className={styles.navLink}>
            Vault
          </Link>
        )}
        {session.role === 'admin' && <AdminMenu />}
      </nav>
      <div className={styles.actions}>
        <ThemeToggleWrapper />
        <UserMenu
          username={profile?.username ?? undefined}
          avatarUrl={profile?.avatar_url ?? undefined}
          email={session.user.email}
        />
      </div>
    </div>
  );
}

function HeaderAuthFallback() {
  return (
    <div className={styles.navActions}>
      <nav className={styles.nav} aria-label="Main navigation" />
      <div className={styles.actions}>
        <ThemeToggleWrapper />
        <div className={styles.avatarPlaceholder} aria-hidden="true" />
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Collectstory home">
          <Shelves aria-hidden style={{ '--icon-size': '24px' } as React.CSSProperties} />
          <span className={styles.brandName}>{siteData.name}</span>
        </Link>

        <Suspense fallback={<HeaderAuthFallback />}>
          <HeaderAuthSlot />
        </Suspense>
      </div>
    </header>
  );
}
