'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { generateUniqueSlug } from '@/lib/slug';

type ItemState = { error: string } | { success: true } | undefined;
type CollectionState = { error: string } | { success: true; slug: string } | undefined;

function getOptional(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return (typeof value === 'string' && value.trim()) ? value.trim() : undefined;
}

export async function addItem(
  _previousState: ItemState,
  formData: FormData,
): Promise<ItemState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const name = getOptional(formData, 'name') ?? '';
  if (!name) return { error: 'Name is required.' };

  const collection_id = getOptional(formData, 'collection_id');
  if (!collection_id) return { error: 'Collection is required.' };

  const slug = await generateUniqueSlug(supabase, user.id, name);

  const { error } = await supabase.from('collection_items').insert({
    user_id: user.id,
    collection_id,
    name,
    slug,
    image_url: getOptional(formData, 'image_url'),
    line_id: getOptional(formData, 'line_id'),
    description: getOptional(formData, 'description'),
    date_acquired: getOptional(formData, 'date_acquired'),
    visibility: getOptional(formData, 'visibility') ?? 'public',
  });

  if (error) {
    if (error.code === '23505') return { error: 'An item with this name already exists in your collection.' };
    if (error.code === '23503') return { error: 'The selected brand or line no longer exists. Please refresh and try again.' };
    return { error: 'Failed to save item. Please try again.' };
  }

  const username = getOptional(formData, 'username');
  const collectionSlug = getOptional(formData, 'collection_slug');

  revalidatePath(`/${username}/${collectionSlug}`);
  redirect(`/${username}/${collectionSlug}`);
}

export async function updateCollection(
  _previousState: CollectionState,
  formData: FormData,
): Promise<CollectionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const collectionId = getOptional(formData, 'collection_id');
  if (!collectionId) return { error: 'Collection not found.' };

  const name = getOptional(formData, 'name') ?? '';
  if (!name) return { error: 'Name is required.' };

  const description = getOptional(formData, 'description');
  const visibility = getOptional(formData, 'visibility') ?? 'public';

  const { data: updated, error } = await supabase
    .from('collections')
    .update({ name, description, visibility })
    .eq('id', collectionId)
    .eq('user_id', user.id)
    .select('slug')
    .single();

  if (error) return { error: 'Failed to update collection. Please try again.' };

  const username = getOptional(formData, 'username');
  revalidatePath(`/${username}/${updated.slug}`);
  revalidatePath(`/${username}`);

  return { success: true, slug: updated.slug };
}

// eslint-disable-next-line unicorn/no-null -- Supabase distinguishes null (clear) from undefined (skip)
const orNull = (value: string | undefined) => value ?? null;

async function fetchItemSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  itemId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from('collection_items')
    .select('slug')
    .eq('id', itemId)
    .eq('user_id', userId)
    .single();
  return error ? undefined : data;
}

export async function updateItem(
  _previousState: ItemState,
  formData: FormData,
): Promise<ItemState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const itemId = getOptional(formData, 'item_id');
  if (!itemId) return { error: 'Item not found.' };

  const name = getOptional(formData, 'name') ?? '';
  if (!name) return { error: 'Name is required.' };

  const item = await fetchItemSlug(supabase, itemId, user.id);
  if (!item) return { error: 'Item not found.' };

  const { error } = await supabase
    .from('collection_items')
    .update({
      name,
      image_url: orNull(getOptional(formData, 'image_url')),
      line_id: orNull(getOptional(formData, 'line_id')),
      franchise_id: orNull(getOptional(formData, 'franchise_id')),
      variant: orNull(getOptional(formData, 'variant')),
      description: orNull(getOptional(formData, 'description')),
      date_acquired: orNull(getOptional(formData, 'date_acquired')),
      visibility: getOptional(formData, 'visibility') ?? 'public',
    })
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (error) return { error: 'Failed to update item. Please try again.' };

  const username = getOptional(formData, 'username');
  const collectionSlug = getOptional(formData, 'collection_slug');

  revalidatePath(`/${username}/${collectionSlug}/${item.slug}`);
  revalidatePath(`/${username}/${collectionSlug}`);

  redirect(`/${username}/${collectionSlug}/${item.slug}`);
}
