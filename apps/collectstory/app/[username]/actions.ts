'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { generateUniqueCollectionSlug } from '@/lib/slug';

function getOptional(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return (typeof value === 'string' && value.trim()) ? value.trim() : undefined;
}

type CollectionState
  = | { error: string }
    | { success: true }
    | undefined;

export async function updateCollection(
  collectionId: string,
  _previousState: CollectionState,
  formData: FormData,
): Promise<CollectionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const name = getOptional(formData, 'name') ?? '';
  if (!name) return { error: 'Name is required.' };

  const slug = await generateUniqueCollectionSlug(supabase, user.id, name);

  const { error } = await supabase
    .from('collections')
    .update({
      name,
      slug,
      description: getOptional(formData, 'description'),
      visibility: getOptional(formData, 'visibility') ?? 'public',
    })
    .eq('id', collectionId)
    .eq('user_id', user.id);

  if (error) return { error: 'Failed to update collection.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/${profile.username}`);
    revalidatePath(`/${profile.username}/${slug}`);
  }

  return { success: true };
}

export async function updateCollectionItem(
  itemId: string,
  _previousState: CollectionState,
  formData: FormData,
): Promise<CollectionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const name = getOptional(formData, 'name') ?? '';
  if (!name) return { error: 'Name is required.' };

  const { error } = await supabase
    .from('collection_items')
    .update({
      name,
      line_id: getOptional(formData, 'line_id'),
      description: getOptional(formData, 'description'),
      date_acquired: getOptional(formData, 'date_acquired'),
      visibility: getOptional(formData, 'visibility') ?? 'public',
    })
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (error) return { error: 'Failed to update item.' };

  revalidatePath('/collection');
  return { success: true };
}

export async function deleteCollectionItem(
  itemId: string,
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { error } = await supabase
    .from('collection_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (error) return { error: 'Failed to delete item.' };

  revalidatePath('/collection');
  return { success: true };
}
