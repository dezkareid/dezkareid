'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { generateUniqueSlug, generateUniqueCollectionSlug } from '@/lib/slug';

// ─── Shared types ─────────────────────────────────────────────────────────────

export type Store = {
  id: string;
  name: string;
  verified: boolean;
  url: string | undefined;
};

export type LineVariant = {
  value: string;
  display_name: string;
};

export type ItemLink = {
  id: string;
  item_id: string;
  url: string;
  label: string | undefined;
  created_at: string;
};

// ─── Collection actions ───────────────────────────────────────────────────────

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
    revalidateTag(`profile:${profile.username}`, 'max');
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
    // Invalidate both the collection and the profile page (collection list changes).
    revalidateTag(`profile:${profile.username}`, 'max');
  }

  return { success: true };
}

// ─── Collection item actions ──────────────────────────────────────────────────

type CollectionItemState
  = | { error: string }
    | { success: true }
    | undefined;

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
    variant: getOptional(formData, 'variant') ?? null, // eslint-disable-line unicorn/no-null -- null required to clear value in database
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
  if (username && collectionSlug) {
    revalidateTag(`collection:${username}:${collectionSlug}`, 'max');
  }
  return { success: true };
}

export async function updateItemImage(
  itemId: string,
  imageUrl: string,
  username: string,
  collectionSlug: string,
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

  revalidatePath(`/${username}/${collectionSlug}/${item.slug}`);
  revalidateTag(`item:${username}:${collectionSlug}:${item.slug}`, 'max');

  return { success: true };
}

// ─── Item link actions ────────────────────────────────────────────────────────

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

// ─── Query helpers ────────────────────────────────────────────────────────────

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
): Promise<{ id: string; name: string; categoryName: string | undefined; variants: LineVariant[] }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lines')
    .select('id, name, variants, categories ( name )')
    .eq('brand_id', brandId)
    .order('name');

  return (data ?? []).map(l => ({
    id: l.id,
    name: l.name,
    categoryName: (l.categories as unknown as { name: string } | undefined)?.name ?? undefined,
    variants: Array.isArray(l.variants) ? (l.variants as LineVariant[]) : [],
  }));
}

// Aliases used by the original addItem / updateItem / updateCollection functions below.
type ItemState = CollectionItemState;

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
  if (username && collectionSlug) {
    revalidateTag(`collection:${username}:${collectionSlug}`, 'max');
  }
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
  if (username) {
    revalidateTag(`collection:${username}:${updated.slug}`, 'max');
  }

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
  if (username && collectionSlug) {
    revalidateTag(`item:${username}:${collectionSlug}:${item.slug}`, 'max');
  }

  redirect(`/${username}/${collectionSlug}/${item.slug}`);
}
