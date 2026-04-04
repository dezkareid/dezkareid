import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { connection } from 'next/server';
import { SignOutButton } from '@/components/SignOutButton';
import { getSessionAndRole } from '@/lib/auth/role';
import { createClient } from '@/lib/supabase/server';
import styles from './layout.module.css';

async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', userId)
    .single();
  return data;
}

function AvatarDisplay({
  avatarUrl,
  username,
  email,
}: {
  avatarUrl: string | undefined;
  username: string | undefined;
  email: string | undefined;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={username ?? 'Profile'}
        width={32}
        height={32}
        className={styles.avatar}
      />
    );
  }
  return (
    <span className={styles.avatarFallback}>
      {email?.[0]?.toUpperCase() ?? '?'}
    </span>
  );
}

async function CollectionHeader() {
  await connection();
  const session = await getSessionAndRole();
  const profile = session ? await getUserProfile(session.user.id) : undefined;

  const avatarUrl = profile?.avatar_url ?? undefined;
  const username = profile?.username ?? undefined;

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <span className={styles.brand}>Collectstory</span>
        <nav className={styles.nav} aria-label="Collection navigation">
          {session?.role === 'admin' && (
            <Link href="/admin" className={styles.adminLink}>Admin</Link>
          )}
          <Link href="/profile/edit" className={styles.profileLink}>
            <AvatarDisplay
              avatarUrl={avatarUrl}
              username={username}
              email={session?.user.email}
            />
            <span className={styles.profileLinkLabel}>
              {username ? `@${username}` : 'Edit Profile'}
            </span>
          </Link>
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
