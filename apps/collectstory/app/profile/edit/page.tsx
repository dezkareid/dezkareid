import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EditProfileForm } from '@/components/EditProfileForm/EditProfileForm';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Edit Profile',
};

async function ProfileFormLoader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <EditProfileForm
      currentUsername={profile?.username ?? undefined}
      currentAvatarUrl={profile?.avatar_url ?? undefined}
    />
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
