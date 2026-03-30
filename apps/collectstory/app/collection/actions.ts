'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { generateUniqueSlug } from '@/lib/slug';

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

type CollectionItemState
  = | { error: string }
    | { success: true }
    | undefined;

function getOptional(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return (typeof value === 'string' && value.trim()) ? value.trim() : undefined;
}

export async function createCollectionItem(
  _previousState: CollectionItemState,
  formData: FormData,
): Promise<CollectionItemState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const name = getOptional(formData, 'name') ?? '';
  if (!name) return { error: 'Name is required.' };

  const slug = await generateUniqueSlug(supabase, user.id, name);

  const { error } = await supabase.from('collection_items').insert({
    user_id: user.id,
    name,
    slug,
    image_url: getOptional(formData, 'image_url'),
    brand_id: getOptional(formData, 'brand_id'),
    line_id: getOptional(formData, 'line_id'),
    category_id: getOptional(formData, 'category_id'),
    description: getOptional(formData, 'description'),
    date_acquired: getOptional(formData, 'date_acquired'),
    visibility: getOptional(formData, 'visibility') ?? 'public',
  });

  if (error) return { error: 'Failed to save item. Please try again.' };

  revalidatePath('/collection');
  return { success: true };
}

export async function updateItemImage(
  itemId: string,
  imageUrl: string,
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { data: item } = await supabase
    .from('collection_items')
    .select('slug')
    .eq('id', itemId)
    .eq('user_id', user.id)
    .single();

  if (!item) return { error: 'Item not found.' };

  const { error } = await supabase
    .from('collection_items')
    .update({ image_url: imageUrl })
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (error) return { error: 'Failed to update image. Please try again.' };

  revalidatePath('/collection');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/${profile.username}/items/${item.slug}`);
  }

  return { success: true };
}

export async function getLinesByBrand(
  brandId: string,
): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lines')
    .select('id, name')
    .eq('brand_id', brandId)
    .order('name');
  return data ?? [];
}
