'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
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
  if (username && collectionSlug) {
    revalidatePath(`/${username}/${collectionSlug}`);
    revalidateTag(`collection:${username}:${collectionSlug}`, 'max');
  }
  // Fallback: always invalidate by collectionId (always present in form data)
  revalidateTag(`collection-items:${collection_id}`, 'max');
  return { success: true };
}

/**
 * Same as createCollectionItem but skips revalidatePath — used by OwnerItemGrid
 * where handleAddSuccess already refreshes the grid client-side via getCollectionItems.
 * Skipping revalidatePath prevents the router from triggering a background RSC
 * re-render that would cause the whole grid to re-mount via the Suspense boundary.
 */
export async function createCollectionItemSilent(
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

  // Only invalidate tags — no revalidatePath. The caller (OwnerItemGrid's
  // handleAddSuccess) fetches fresh items client-side so no RSC refresh needed.
  const username = getOptional(formData, 'username');
  const collectionSlug = getOptional(formData, 'collection_slug');
  if (username && collectionSlug) {
    revalidateTag(`collection:${username}:${collectionSlug}`, 'max');
  }
  revalidateTag(`collection-items:${collection_id}`, 'max');
  return { success: true };
}

export type CopyItemState
  = | { error: string }
    | { success: true; itemSlug: string; collectionSlug: string; username: string }
    | undefined;

async function resolveTargetCollection(
  supabase: SupabaseClient,
  userId: string,
  collectionId?: string,
  collectionSlug?: string,
): Promise<{ id: string; slug: string } | { error: string }> {
  if (!collectionId) {
    const { data: existingCollections } = await supabase
      .from('collections')
      .select('id, slug')
      .eq('user_id', userId)
      .limit(1);

    if (existingCollections && existingCollections.length > 0) {
      return { id: existingCollections[0].id, slug: existingCollections[0].slug };
    }

    const defaultName = 'My Collection';
    const slug = await generateUniqueCollectionSlug(supabase, userId, defaultName);
    const { data: newCollection, error: createError } = await supabase
      .from('collections')
      .insert({
        user_id: userId,
        name: defaultName,
        slug,
        visibility: 'public',
      })
      .select('id, slug')
      .single();

    if (createError || !newCollection) {
      return { error: 'Failed to create a default collection.' };
    }
    return { id: newCollection.id, slug: newCollection.slug };
  }

  if (!collectionSlug) {
    const { data: col } = await supabase
      .from('collections')
      .select('slug')
      .eq('id', collectionId)
      .single();
    return { id: collectionId, slug: col?.slug ?? '' };
  }

  return { id: collectionId, slug: collectionSlug };
}

export async function copyItemToCollection(
  _previousState: CopyItemState,
  formData: FormData,
): Promise<CopyItemState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found.' };

  const target = await resolveTargetCollection(
    supabase,
    user.id,
    getOptional(formData, 'collection_id'),
    getOptional(formData, 'collection_slug'),
  );

  if ('error' in target) return { error: target.error };

  const { id: collectionId, slug: collectionSlug } = target;

  // 2. Map data and insert new item
  const name = getOptional(formData, 'name') ?? '';
  if (!name) return { error: 'Name is required.' };

  const itemSlug = await generateUniqueSlug(supabase, user.id, name);

  const { error: insertError } = await supabase
    .from('collection_items')
    .insert({
      user_id: user.id,
      collection_id: collectionId,
      name,
      slug: itemSlug,
      description: getOptional(formData, 'description'),
      image_url: getOptional(formData, 'image_url'),
      date_acquired: getOptional(formData, 'date_acquired') || null, // eslint-disable-line unicorn/no-null
      visibility: getOptional(formData, 'visibility') ?? 'public',
      variant: getOptional(formData, 'variant'),
      line_id: getOptional(formData, 'line_id'),
      franchise_id: getOptional(formData, 'franchise_id'),
    });

  if (insertError) {
    console.error('Error copying item:', insertError);
    if (insertError.code === '23505') return { error: 'An item with this name already exists in your collection.' };
    return { error: 'Failed to copy item to your collection.' };
  }

  revalidatePath(`/${profile.username}`);
  revalidatePath(`/${profile.username}/${collectionSlug}`);
  revalidateTag(`collection:${profile.username}:${collectionSlug}`, 'max');
  revalidateTag(`collection-items:${collectionId}`, 'max');

  return {
    success: true,
    itemSlug,
    collectionSlug,
    username: profile.username,
  };
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

export async function getAllBrands(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();
  const { data: brands, error } = await supabase
    .from('brands')
    .select('id, name')
    .order('name');

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  return brands ?? [];
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

// ─── Owner item queries ───────────────────────────────────────────────────────

export async function getCollectionItems(collectionId: string): Promise<{
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  date_acquired: string | null;
  likes_count: number;
  lines: {
    id: string;
    name: string;
    brands: { id: string; name: string } | null;
    categories: { name: string } | null;
    variants: unknown[];
  } | null;
}[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('collection_items')
    .select(`
      id,
      name,
      slug,
      image_url,
      description,
      date_acquired,
      likes_count,
      lines (
        id,
        name,
        brands ( id, name ),
        categories ( name ),
        variants
      )
    `)
    .eq('collection_id', collectionId)
    .eq('user_id', user.id)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase nested select types don't match manually defined shape
  return (data ?? []) as any[];
}

// ─── Like actions ─────────────────────────────────────────────────────────────

export async function deleteItem(
  itemId: string,
  username: string,
  collectionSlug: string,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { error } = await supabase
    .from('collection_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (error) return { error: 'Failed to delete item. Please try again.' };

  // Only invalidate the tag — the optimistic update already removed the item
  // from the owner grid. Calling revalidatePath here would trigger a router
  // refresh that briefly shows the stale public grid (the flash).
  revalidateTag(`collection:${username}:${collectionSlug}`, 'max');
  revalidateTag(`collection-items:${username}:${collectionSlug}`, 'max');

  return { success: true };
}

export async function likeItem(
  itemId: string,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { error } = await supabase
    .from('item_likes')
    .insert({ user_id: user.id, item_id: itemId });

  // Ignore conflict (already liked) — idempotent
  if (error && error.code !== '23505') return { error: 'Failed to like item. Please try again.' };

  revalidateTag(`item-like:${user.id}:${itemId}`, 'max');

  return { success: true };
}

export async function unlikeItem(
  itemId: string,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { error } = await supabase
    .from('item_likes')
    .delete()
    .eq('user_id', user.id)
    .eq('item_id', itemId);

  if (error) return { error: 'Failed to unlike item. Please try again.' };

  revalidateTag(`item-like:${user.id}:${itemId}`, 'max');

  return { success: true };
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
    catalog_item_id: getOptional(formData, 'catalog_item_id') ?? null, // eslint-disable-line unicorn/no-null -- null required to clear value in database
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
      catalog_item_id: orNull(getOptional(formData, 'catalog_item_id')),
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
