'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function signInWithGoogle(next?: string) {
  const supabase = await createClient();
  const headersList = await headers();

  // The Origin header is always accurate for browser-initiated requests (correct
  // protocol on localhost too). Fall back to constructing from Host using the
  // configured base URL's protocol, or http for localhost.
  const host = headersList.get('host') ?? 'localhost:3000';
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const protocol = isLocalhost ? 'http' : 'https';
  const origin = headersList.get('origin') ?? `${protocol}://${host}`;

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
