'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export type ResetRequestState = { success: true } | { error: string } | undefined;
export type UpdatePasswordState = { error: string } | undefined;

export async function requestPasswordReset(
  _previousState: ResetRequestState,
  formData: FormData,
): Promise<ResetRequestState> {
  const email = (formData.get('email') as string | null)?.trim() ?? '';

  if (!email) return { error: 'Email is required.' };

  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3000';
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const protocol = isLocalhost ? 'http' : 'https';
  const origin = headersList.get('origin') ?? `${protocol}://${host}`;

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/en/reset-password`,
  });

  // Always return success — never reveal whether the email is registered.
  return { success: true };
}

export async function updatePassword(
  _previousState: UpdatePasswordState,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const password = (formData.get('password') as string | null) ?? '';

  if (!password) return { error: 'Password is required.' };
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Your reset link has expired. Please request a new one.' };

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: 'Could not update password. Please try again.' };

  redirect('/en/profile/edit');
}
