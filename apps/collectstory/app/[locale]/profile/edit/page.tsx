import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EditProfileForm } from '@/components/EditProfileForm/EditProfileForm';
import { ChangePasswordForm } from '@/src/features/auth-email';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Edit Profile',
};

async function ProfileFormLoader() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .single();

  const hasEmailIdentity = user.identities?.some(identity => identity.provider === 'email') ?? false;

  return (
    <>
      <EditProfileForm
        currentUsername={profile?.username ?? undefined}
        currentAvatarUrl={profile?.avatar_url ?? undefined}
      />
      {hasEmailIdentity && <ChangePasswordForm />}
    </>
  );
}

export default function EditProfilePage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Edit Profile</h1>
        <Suspense>
          <ProfileFormLoader />
        </Suspense>
      </div>
    </div>
  );
}
