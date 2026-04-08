import { Suspense } from 'react';
import Link from 'next/link';
import { connection } from 'next/server';
import { Shelves } from '@dezkareid/icons/react';
import { ThemeToggleWrapper } from '@/src/features/theme';
import { AdminMenu } from '@/src/features/admin-menu';
import { UserMenu } from '@/src/features/user-menu';
import { getSessionAndRole } from '@/lib/auth/role';
import { createClient } from '@/lib/supabase/server';
import { siteData } from '@/lib/mock-data';
import styles from './SiteHeader.module.css';

async function HeaderAuthSlot() {
  await connection();
  const session = await getSessionAndRole();

  if (!session) {
    return (
      <div className={styles['site-header__nav-actions']}>
        <nav className={styles['site-header__nav']} aria-label="Main navigation" />
        <div className={styles['site-header__actions']}>
          <ThemeToggleWrapper />
          <Link href="/login" className={styles['site-header__sign-in']}>
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
    <div className={styles['site-header__nav-actions']}>
      <nav className={styles['site-header__nav']} aria-label="Main navigation">
        {profile?.username && (
          <Link href={`/${profile.username}`} className={styles['site-header__nav-link']}>
            Vault
          </Link>
        )}
        {session.role === 'admin' && <AdminMenu />}
      </nav>
      <div className={styles['site-header__actions']}>
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
    <div className={styles['site-header__nav-actions']}>
      <nav className={styles['site-header__nav']} aria-label="Main navigation" />
      <div className={styles['site-header__actions']}>
        <ThemeToggleWrapper />
        <div className={styles['site-header__avatar-placeholder']} aria-hidden="true" />
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className={styles['site-header']}>
      <div className={`container ${styles['site-header__inner']}`}>
        <Link href="/" className={styles['site-header__brand']} aria-label="Collectstory home">
          <Shelves aria-hidden style={{ '--icon-size': '24px' } as React.CSSProperties} />
          <span className={styles['site-header__brand-name']}>{siteData.name}</span>
        </Link>

        <Suspense fallback={<HeaderAuthFallback />}>
          <HeaderAuthSlot />
        </Suspense>
      </div>
    </header>
  );
}
