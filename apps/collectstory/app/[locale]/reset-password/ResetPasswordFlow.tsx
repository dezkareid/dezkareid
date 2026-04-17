'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { ResetPasswordRequestForm } from '@/src/features/auth-email';

const NewPasswordForm = dynamic(
  () => import('@/src/features/auth-email/ui/NewPasswordForm').then(m => m.NewPasswordForm),
  { ssr: false },
);

export function ResetPasswordFlow() {
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return isRecovery ? <NewPasswordForm /> : <ResetPasswordRequestForm />;
}
