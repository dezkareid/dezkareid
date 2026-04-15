'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function signInWithGoogle(next?: string) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get('origin')
    ?? `https://${headersList.get('host')}`;

  // Validate next is a safe internal path before appending to callback URL.
  const safeNext
    = next && next.startsWith('/') && !next.startsWith('//') && next !== '/'
      ? `?next=${encodeURIComponent(next)}`
      : '';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/en/auth/callback${safeNext}`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.url;
}
