'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { RESERVED_USERNAMES } from '@/lib/reserved-usernames';

export type ChangePasswordState = { success: true } | { error: string } | undefined;

export async function changePassword(
  _previousState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const password = (formData.get('password') as string | null) ?? '';

  if (!password) return { error: 'Password is required.' };
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated.' };

  // Only allow password change for users with an email/password identity.
  const hasEmailIdentity = user.identities?.some(identity => identity.provider === 'email');
  if (!hasEmailIdentity) return { error: 'Password change is not available for your account.' };

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: 'Could not update password. Please try again.' };

  return { success: true };
}

const USERNAME_PATTERN = /^[a-z0-9][a-z0-9-]{1,}[a-z0-9]$/;

type ProfileState
  = | { error: string }
    | { success: true }
    | undefined;

export async function updateProfile(
  _previousState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const username = (formData.get('username') as string | undefined)?.trim().toLowerCase() ?? '';
  const avatarUrl = (formData.get('avatar_url') as string | undefined) || undefined;

  if (!username) return { error: 'Username is required.' };
  if (!USERNAME_PATTERN.test(username)) {
    return { error: 'Username must be at least 3 characters, lowercase letters, digits, and hyphens only. Cannot start or end with a hyphen.' };
  }
  if (RESERVED_USERNAMES.has(username)) {
    return { error: `"${username}" is a reserved name and cannot be used.` };
  }

  const updates: Record<string, string> = { username };
  if (avatarUrl) updates.avatar_url = avatarUrl;

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error?.code === '23505') {
    return { error: 'That username is already taken. Please choose another.' };
  }
  if (error) return { error: 'Failed to save profile. Please try again.' };

  revalidatePath(`/${username}`);
  revalidateTag(`profile:${username}`, 'max');
  return { success: true };
}

export async function checkUsernameAvailable(
  username: string,
): Promise<{ available: boolean }> {
  if (!username || !USERNAME_PATTERN.test(username) || RESERVED_USERNAMES.has(username)) {
    return { available: false };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  return { available: data === undefined || data === null };
}
