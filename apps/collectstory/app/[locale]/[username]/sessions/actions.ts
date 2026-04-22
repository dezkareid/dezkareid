'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { toSlug } from '@/lib/slug';
import { getUserSessionCount } from '@/lib/sessions';

const MAX_SESSIONS = 5;

async function getOwnerOrThrow(sessionId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('photo_sessions')
    .select('id, slug, user_id')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single();
  if (!data) throw new Error('Session not found or access denied');
  return data;
}

async function generateUniqueSessionSlug(userId: string, name: string): Promise<string> {
  const supabase = await createClient();
  const base = toSlug(name);

  const { data: existing } = await supabase
    .from('photo_sessions')
    .select('slug')
    .eq('user_id', userId)
    .like('slug', `${base}%`);

  const taken = new Set((existing ?? []).map(r => r.slug));
  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix++;
  return `${base}-${suffix}`;
}

export async function createSession(
  username: string,
  name: string,
  description: string | undefined,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const count = await getUserSessionCount(user.id);
  if (count >= MAX_SESSIONS) {
    return { error: `You can have at most ${MAX_SESSIONS} photo sessions.` };
  }

  const slug = await generateUniqueSessionSlug(user.id, name);

  const { error } = await supabase.from('photo_sessions').insert({
    user_id: user.id,
    name: name.trim(),
    slug,
    description: description?.trim() || null,
  });

  if (error) return { error: 'Failed to create session. Please try again.' };

  revalidateTag(`sessions:${username}`, 'max');
  revalidatePath(`/${username}/sessions`);

  return {};
}

export async function renameSession(
  username: string,
  sessionId: string,
  name: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  await getOwnerOrThrow(sessionId, user.id);

  const { error } = await supabase
    .from('photo_sessions')
    .update({ name: name.trim(), updated_at: new Date().toISOString() })
    .eq('id', sessionId)
    .eq('user_id', user.id);

  if (error) return { error: 'Failed to rename session. Please try again.' };

  revalidateTag(`sessions:${username}`, 'max');
  revalidatePath(`/${username}/sessions`);

  return {};
}

export async function deleteSession(
  username: string,
  sessionId: string,
): Promise<{ error?: string; slug?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const session = await getOwnerOrThrow(sessionId, user.id);

  const { error } = await supabase
    .from('photo_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', user.id);

  if (error) return { error: 'Failed to delete session. Please try again.' };

  revalidateTag(`sessions:${username}`, 'max');
  revalidateTag(`session:${username}:${session.slug}`, 'max');
  revalidatePath(`/${username}/sessions`);

  return { slug: session.slug };
}
