'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { RESERVED_USERNAMES } from '@/lib/reserved-usernames';
import { getPasswordErrors } from '@/src/features/auth-email/lib/password';

const USERNAME_PATTERN = /^[a-z0-9][a-z0-9-]{1,}[a-z0-9]$/;

export type AuthState = { error: string } | undefined;

function validateSignUpFields(
  email: string,
  username: string,
  password: string,
  confirm: string,
): string | undefined {
  if (!email || !username || !password) return 'All fields are required.';
  if (!USERNAME_PATTERN.test(username)) {
    return 'Username must be at least 3 characters, lowercase letters, digits, and hyphens only. Cannot start or end with a hyphen.';
  }
  if (RESERVED_USERNAMES.has(username)) return `"${username}" is a reserved name and cannot be used.`;
  if (getPasswordErrors(password).length > 0) return 'Password does not meet the requirements.';
  if (password !== confirm) return 'Passwords do not match.';
  return undefined;
}

export async function signInWithEmail(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const password = (formData.get('password') as string | null) ?? '';

  if (!email || !password) return { error: 'Email and password are required.' };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) return { error: 'Invalid email or password.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', data.user.id)
    .single();

  redirect(profile?.username ? `/en/${profile.username}` : '/en/profile/edit');
}

async function resolveOrigin(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3000';
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const protocol = isLocalhost ? 'http' : 'https';
  return headersList.get('origin') ?? `${protocol}://${host}`;
}

export async function signUpWithEmail(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const username = (formData.get('username') as string | null)?.trim().toLowerCase() ?? '';
  const password = (formData.get('password') as string | null) ?? '';
  const confirm = (formData.get('confirm') as string | null) ?? '';

  const validationError = validateSignUpFields(email, username, password, confirm);
  if (validationError) return { error: validationError };

  const origin = await resolveOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/en/auth/callback` },
  });

  if (error || !data.user) {
    return { error: 'Unable to create account. An account with this email may already exist.' };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', data.user.id);

  if (profileError?.code === '23505') {
    return { error: 'That username is already taken. Please choose another.' };
  }

  redirect(`/en/${username}`);
}

export async function signInWithGoogle(next?: string) {
  const supabase = await createClient();
  const origin = await resolveOrigin();

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
