'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

type Provider = 'google' | 'facebook' | 'twitter';

export async function signInWithGoogle() {
  return signInWithProvider('google');
}

export async function signInWithFacebook() {
  return signInWithProvider('facebook');
}

export async function signInWithX() {
  return signInWithProvider('twitter');
}

async function signInWithProvider(provider: Provider) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get('origin');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.url;
}
