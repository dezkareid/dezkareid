import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggleWrapper } from './ThemeToggleWrapper';
import { ShelvesIcon } from './icons/ShelvesIcon';
import { getSessionAndRole } from '@/lib/auth/role';
import { createClient } from '@/lib/supabase/server';
import { siteData } from '@/lib/mock-data';
import styles from './SiteHeader.module.css';

async function getHeaderData() {
  const session = await getSessionAndRole();
  if (!session) return { session: undefined, profile: undefined };
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', session.user.id)
    .single();
  return { session, profile };
}

export async function SiteHeader() {
  const { session, profile } = await getHeaderData();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Collectstory home">
          <ShelvesIcon size={24} />
          <span className={styles.brandName}>{siteData.name}</span>
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
          <ThemeToggleWrapper />
          {session
            ? (
                <Link
                  href={profile?.username ? `/${profile.username}` : '/collection'}
                  className={styles.userAvatar}
                  aria-label="My profile"
                >
                  {profile?.avatar_url
                    ? (
                        <Image
                          src={profile.avatar_url}
                          alt={profile.username ?? 'User avatar'}
                          width={32}
                          height={32}
                          className={styles.avatarImage}
                        />
                      )
                    : (
                        session.user.email?.[0]?.toUpperCase() ?? '?'
                      )}
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
