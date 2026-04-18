import Link from 'next/link';
import { connection } from 'next/server';
import { headers } from 'next/headers';
import { ThemeToggleWrapper } from '@/src/features/theme';
import { AdminMenu } from '@/src/features/admin-menu';
import { UserMenu } from '@/src/features/user-menu';
import { LanguageSwitcher } from '@/src/features/language-switcher';
import { getSessionAndRole } from '@/lib/auth/role';
import { createClient } from '@/lib/supabase/server';
import { HeaderTracker } from './HeaderTracker';
import styles from './SiteHeader.module.css';

export async function HeaderAuthSlot() {
  await connection();
  const session = await getSessionAndRole();

  if (!session) {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') ?? '/';
    const signInHref
      = pathname && pathname !== '/'
        ? `/login?next=${encodeURIComponent(pathname)}`
        : '/login';

    return (
      <div className={styles['site-header__nav-actions']}>
        <nav className={styles['site-header__nav']} aria-label="Main navigation" />
        <div className={styles['site-header__actions']}>
          <LanguageSwitcher />
          <ThemeToggleWrapper />
          <HeaderTracker label="login">
            <Link href={signInHref} className={styles['site-header__sign-in']}>
              Sign In
            </Link>
          </HeaderTracker>
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
          <HeaderTracker label="vault">
            <Link href={`/${profile.username}`} className={styles['site-header__nav-link']}>
              Vault
            </Link>
          </HeaderTracker>
        )}
        {session.role === 'admin' && <AdminMenu />}
      </nav>
      <div className={styles['site-header__actions']}>
        <LanguageSwitcher />
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
