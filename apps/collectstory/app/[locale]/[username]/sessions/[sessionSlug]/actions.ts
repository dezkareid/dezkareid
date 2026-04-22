'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function getPhotoOwnerOrThrow(photoId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('session_photos')
    .select('id, session_id, user_id, image_url')
    .eq('id', photoId)
    .eq('user_id', userId)
    .single();
  if (!data) throw new Error('Photo not found or access denied');
  return data;
}

export async function deleteSessionPhoto(
  username: string,
  sessionSlug: string,
  photoId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const photo = await getPhotoOwnerOrThrow(photoId, user.id);

  const { error } = await supabase
    .from('session_photos')
    .delete()
    .eq('id', photoId)
    .eq('user_id', user.id);

  if (error) return { error: 'Failed to delete photo. Please try again.' };

  revalidateTag(`session:${username}:${sessionSlug}`, 'max');
  revalidateTag(`session-photos:${photo.session_id}`, 'max');
  revalidatePath(`/${username}/sessions/${sessionSlug}`);

  return {};
}

export async function likeSession(
  username: string,
  sessionSlug: string,
  sessionId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  // Upsert — ignore duplicate (already liked)
  const { error } = await supabase
    .from('session_likes')
    .upsert({ session_id: sessionId, user_id: user.id }, { onConflict: 'session_id,user_id', ignoreDuplicates: true });

  if (error) return { error: 'Failed to like session. Please try again.' };

  revalidateTag(`session:${username}:${sessionSlug}`, 'max');
  revalidatePath(`/${username}/sessions/${sessionSlug}`);

  return {};
}

export async function unlikeSession(
  username: string,
  sessionSlug: string,
  sessionId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('session_likes')
    .delete()
    .eq('session_id', sessionId)
    .eq('user_id', user.id);

  if (error) return { error: 'Failed to unlike session. Please try again.' };

  revalidateTag(`session:${username}:${sessionSlug}`, 'max');
  revalidatePath(`/${username}/sessions/${sessionSlug}`);

  return {};
}
