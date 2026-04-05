'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { generateUniqueSlug, generateUniqueCollectionSlug } from '@/lib/slug';

export type Store = {
  id: string;
  name: string;
  verified: boolean;
  url: string | undefined;
};

export type ItemLink = {
  id: string;
  item_id: string;
  url: string;
  label: string | undefined;
  created_at: string;
};

export async function addItemLink(
  itemId: string,
  url: string,
  label?: string,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const trimmedUrl = url.trim();
  try {
    new URL(trimmedUrl);
  }
  catch {
    return { error: 'Please enter a valid URL (e.g. https://example.com).' };
  }

  const trimmedLabel = label?.trim() || undefined;

  const { error } = await supabase
    .from('item_links')
    .insert({ item_id: itemId, url: trimmedUrl, label: trimmedLabel });

  if (error) return { error: 'Failed to add link. Please try again.' };

  return { success: true };
}

export async function removeItemLink(
  linkId: string,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { error } = await supabase
    .from('item_links')
    .delete()
    .eq('id', linkId);

  if (error) return { error: 'Failed to remove link. Please try again.' };

  return { success: true };
}

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

  const collection_id = getOptional(formData, 'collection_id');
  if (!collection_id) return { error: 'Collection is required.' };

  const { error } = await supabase.from('collection_items').insert({
    user_id: user.id,
    collection_id,
    name,
    slug,
    image_url: getOptional(formData, 'image_url'),
    line_id: getOptional(formData, 'line_id'),
    franchise_id: getOptional(formData, 'franchise_id'),
    description: getOptional(formData, 'description'),
    date_acquired: getOptional(formData, 'date_acquired'),
    visibility: getOptional(formData, 'visibility') ?? 'public',
  });

  if (error) {
    if (error.code === '23505') return { error: 'An item with this name already exists in your collection.' };
    if (error.code === '23503') return { error: 'The selected brand or line no longer exists. Please refresh and try again.' };
    return { error: 'Failed to save item. Please try again.' };
  }

  revalidatePath('/collection');
  return { success: true };
}

type CollectionState
  = | { error: string }
    | { success: true; slug: string }
    | undefined;

export async function createCollection(
  _previousState: CollectionState,
  formData: FormData,
): Promise<CollectionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const name = getOptional(formData, 'name') ?? '';
  if (!name) return { error: 'Name is required.' };

  const slug = await generateUniqueCollectionSlug(supabase, user.id, name);

  const { error } = await supabase.from('collections').insert({
    user_id: user.id,
    name,
    slug,
    description: getOptional(formData, 'description'),
    visibility: getOptional(formData, 'visibility') ?? 'public',
  });

  if (error) return { error: 'Failed to create collection. Please try again.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/${profile.username}`);
  }

  return { success: true, slug };
}

export async function deleteCollection(collectionId: string): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', collectionId)
    .eq('user_id', user.id);

  if (error) return { error: 'Failed to delete collection.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/${profile.username}`);
  }

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

export async function getAllFranchises(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('franchises')
    .select('id, name')
    .order('name');
  return data ?? [];
}

export async function getLinesByBrand(
  brandId: string,
): Promise<{ id: string; name: string; categoryName: string | undefined }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lines')
    .select('id, name, categories ( name )')
    .eq('brand_id', brandId)
    .order('name');

  return (data ?? []).map(l => ({
    id: l.id,
    name: l.name,
    categoryName: (l.categories as unknown as { name: string } | undefined)?.name ?? undefined,
  }));
}
