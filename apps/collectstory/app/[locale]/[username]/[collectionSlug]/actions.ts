'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { generateUniqueSlug, generateUniqueCollectionSlug, toSlugField } from '@/lib/slug';
import {
  getPublicCollectionBySlug,
  getPublicItemsInCollection,
  type PublicItem,
} from '@/lib/collections';

// ─── Shared types ─────────────────────────────────────────────────────────────

export type SlugOption = {
  priority: number;
  slug: string;
  label: string;
};

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

// ─── Slug collision check ─────────────────────────────────────────────────────

/**
 * Returns ranked slug options when the base slug is already taken in the collection,
 * or null when no collision is detected (base slug is free).
 */
export async function checkSlugCollision(
  collectionId: string,
  name: string,
  lineName: string | undefined,
  variant: string | undefined,
  brandName: string | undefined,
): Promise<SlugOption[] | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Strip meaningless values (e.g. "Unknown", "N/A") before sending to RPC —
  // the RPC also filters these, but doing it here avoids a pointless round-trip.
  const { data, error } = await supabase.rpc('get_slug_options', {
    p_collection_id: collectionId,
    p_name: name,
    p_line_name: toSlugField(lineName) ? lineName ?? null : null,
    p_variant: toSlugField(variant) ? variant ?? null : null,
    p_brand_name: toSlugField(brandName) ? brandName ?? null : null,
    p_exclude_slug: null,
  });

  if (error || !data) return null;

  const options = data as SlugOption[];

  // If only the ID fallback came back, or if options include non-fallback entries
  // alongside the fallback, a collision exists. If no options returned at all,
  // the base slug itself was free (RPC would not return anything except fallback).
  // We detect "no collision" when the base slug is free: the RPC returns only the
  // ID fallback (priority 7) because all field-based candidates are also free but
  // the base slug is free too — actually check directly.
  const { toSlug } = await import('@/lib/slug');
  const baseSlug = toSlug(name);

  const { data: existing } = await supabase
    .from('collection_items')
    .select('slug')
    .eq('collection_id', collectionId)
    .eq('slug', baseSlug)
    .limit(1);

  if (!existing || existing.length === 0) return null; // no collision

  return options;
}

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

export type CollectionItemState
  = | { error: string }
    | { slugOptions: SlugOption[] }
    | { success: true; item?: CollectionOwnerItem }
    | undefined;

type InsertItemResult = { error: { code: string } } | { collection_id: string; username: string | undefined; collectionSlug: string | undefined };

async function insertCollectionItem(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  formData: FormData,
): Promise<InsertItemResult> {
  const name = getOptional(formData, 'name') ?? '';
  const collection_id = getOptional(formData, 'collection_id') ?? '';
  // Use the user-chosen slug when provided (disambiguation flow); otherwise generate one.
  const chosenSlug = getOptional(formData, 'slug');
  const slug = chosenSlug ?? await generateUniqueSlug(supabase, collection_id, name);
  const { error } = await supabase.from('collection_items').insert({
    user_id: userId,
    collection_id,
    name,
    slug,
    image_url: getOptional(formData, 'image_url'),
    line_id: getOptional(formData, 'line_id'),
    franchise_id: getOptional(formData, 'franchise_id'),
    variant: getOptional(formData, 'variant') ?? null,
    description: getOptional(formData, 'description'),
    date_acquired: getOptional(formData, 'date_acquired'),
    visibility: getOptional(formData, 'visibility') ?? 'public',
  });
  if (error) return { error };
  return {
    collection_id,
    username: getOptional(formData, 'username'),
    collectionSlug: getOptional(formData, 'collection_slug'),
  };
}

function mapInsertError(code: string): CollectionItemState {
  if (code === '23505') return { error: 'An item with this name already exists in your collection.' };
  if (code === '23503') return { error: 'The selected brand or line no longer exists. Please refresh and try again.' };
  return { error: 'Failed to save item. Please try again.' };
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
  const collection_id = getOptional(formData, 'collection_id');
  if (!collection_id) return { error: 'Collection is required.' };

  const result = await insertCollectionItem(supabase, user.id, formData);
  if ('error' in result) return mapInsertError(result.error.code);

  const { username, collectionSlug } = result;
  if (username && collectionSlug) {
    revalidatePath(`/${username}/${collectionSlug}`);
    revalidateTag(`collection:${username}:${collectionSlug}`, 'max');
  }
  revalidateTag(`collection-items:${collection_id}`, 'max');
  if (username) revalidateTag(`profile:${username}`, 'max');
  return { success: true };
}

/**
 * Same as createCollectionItem but skips revalidatePath — used by OwnerItemGrid
 * where handleAddSuccess updates the context store directly from the returned item.
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
  const collection_id = getOptional(formData, 'collection_id');
  if (!collection_id) return { error: 'Collection is required.' };

  const result = await insertCollectionItem(supabase, user.id, formData);
  if ('error' in result) return mapInsertError(result.error.code);

  const { username, collectionSlug } = result;
  if (username && collectionSlug) revalidateTag(`collection:${username}:${collectionSlug}`, 'max');
  revalidateTag(`collection-items:${collection_id}`, 'max');
  if (username) revalidateTag(`profile:${username}`, 'max');

  const { data: inserted } = await supabase
    .from('collection_items')
    .select(`id, name, slug, image_url, description, date_acquired, likes_count, visibility, franchise_id, variant,
      lines ( id, name, brands ( id, name ), categories ( name ), variants )`)
    .eq('collection_id', collection_id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return { success: true, item: inserted ? (inserted as unknown as CollectionOwnerItem) : undefined };
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

  const itemSlug = await generateUniqueSlug(supabase, collectionId, name);

  const { error: insertError } = await supabase
    .from('collection_items')
    .insert({
      user_id: user.id,
      collection_id: collectionId,
      name,
      slug: itemSlug,
      description: getOptional(formData, 'description'),
      image_url: getOptional(formData, 'image_url'),
      date_acquired: getOptional(formData, 'date_acquired') || null,
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
): Promise<{ id: string; name: string; categoryName: string | undefined; variants: LineVariant[]; brandName: string | undefined }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lines')
    .select('id, name, variants, categories ( name ), brands ( name )')
    .eq('brand_id', brandId)
    .order('name');

  return (data ?? []).map(l => ({
    id: l.id,
    name: l.name,
    categoryName: (l.categories as unknown as { name: string } | undefined)?.name ?? undefined,
    brandName: (l.brands as unknown as { name: string } | undefined)?.name ?? undefined,
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
  visibility: string;
  franchise_id: string | null;
  variant: string | null;
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
      visibility,
      franchise_id,
      variant,
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
    .order('created_at', { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase nested select types don't match manually defined shape
  return (data ?? []) as any[];
}

// ─── Page data loader ────────────────────────────────────────────────────────

export type CollectionOwnerItem = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  date_acquired: string | null;
  likes_count: number;
  visibility: string;
  franchise_id: string | null;
  variant: string | null;
  lines: {
    id: string;
    name: string;
    brands: { id: string; name: string } | null;
    categories: { name: string } | null;
    variants: unknown[];
  } | null;
};

export type CollectionOwnerData = {
  items: CollectionOwnerItem[];
  brands: { id: string; name: string }[];
  franchises: { id: string; name: string }[];
};

export type CollectionPageData = {
  username: string;
  collection: { id: string; name: string; slug: string; description: string | undefined };
  collectionUserId: string;
  items: PublicItem[];
  isPrivate: boolean;
  isAuthenticated: boolean;
  isOwner: boolean;
  ownerData: CollectionOwnerData | null;
};

/**
 * Public data only — no auth, no cookies. Safe to call directly in the page
 * without a Suspense boundary. Returns null when the collection doesn't exist.
 */
export async function getPublicPageData(
  username: string,
  collectionSlug: string,
): Promise<CollectionPageData | null> {
  const publicResult = await getPublicCollectionBySlug(username, collectionSlug);

  if (!publicResult) return null;

  const { collection, userId: collectionUserId } = publicResult;
  const items = await getPublicItemsInCollection(collection.id, username, collectionSlug);
  return {
    username,
    collection,
    collectionUserId,
    items,
    isPrivate: false,
    isAuthenticated: false,
    isOwner: false,
    ownerData: null,
  };
}

export type CollectionAuthData = {
  isAuthenticated: boolean;
  isOwner: boolean;
  ownerData: CollectionOwnerData | null;
};

/**
 * Auth-dependent data — calls createClient() which reads cookies and makes a
 * network request. Must be called inside a <Suspense> boundary.
 * Returns null when the collection is private and the user is not the owner.
 */
export async function getCollectionAuthData(
  username: string,
  collectionSlug: string,
  collectionId: string,
  collectionUserId: string,
): Promise<CollectionAuthData> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isAuthenticated = !!user;
  const isOwner = isAuthenticated && user!.id === collectionUserId;

  const ownerData = isOwner
    ? await Promise.all([
        supabase
          .from('collection_items')
          .select(`
            id, name, slug, image_url, description, date_acquired,
            likes_count, visibility, franchise_id, variant,
            lines ( id, name, brands ( id, name ), categories ( name ), variants )
          `)
          .eq('collection_id', collectionId)
          .order('created_at', { ascending: false })
          .then(({ data }) => (data ?? []) as unknown as CollectionOwnerItem[]),
        getAllBrands(),
        getAllFranchises(),
      ]).then(([ownerItems, brands, franchises]) => ({ items: ownerItems, brands, franchises }))
    : null;

  return { isAuthenticated, isOwner, ownerData };
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
  // Invalidate the profile page so item counters on collection cards update.
  revalidateTag(`profile:${username}`, 'max');

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

  // Use the user-chosen slug when provided (disambiguation flow); otherwise generate one.
  const chosenSlug = getOptional(formData, 'slug');
  const slug = chosenSlug ?? await generateUniqueSlug(supabase, collection_id, name);

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
    catalog_item_id: getOptional(formData, 'catalog_item_id') ?? null,
  });

  if (error) return mapInsertError(error.code);

  const username = getOptional(formData, 'username');
  const collectionSlug = getOptional(formData, 'collection_slug');

  if (username && collectionSlug) {
    revalidatePath(`/${username}/${collectionSlug}`);
    revalidateTag(`collection:${username}:${collectionSlug}`, 'max');
  }

  // Return success so the client can redirect — calling redirect() inside
  // useActionState causes a 500 in Next.js App Router.
  return { success: true };
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

  // slug intentionally omitted — slugs are immutable after creation
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

/**
 * Same as updateItem but skips redirect — used for inline editing where
 * the UI handles the success state without a full page navigation.
 */
export async function updateItemSilent(
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

  const collection_id = getOptional(formData, 'collection_id');

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

  if (collection_id) {
    revalidateTag(`collection-items:${collection_id}`, 'max');
  }

  const username = getOptional(formData, 'username');
  const collectionSlug = getOptional(formData, 'collection_slug');

  const { data: updated } = await supabase
    .from('collection_items')
    .select(`id, name, slug, image_url, description, date_acquired, likes_count, visibility, franchise_id, variant,
      lines ( id, name, brands ( id, name ), categories ( name ), variants )`)
    .eq('id', itemId)
    .eq('user_id', user.id)
    .single();

  if (username && collectionSlug && updated) {
    revalidateTag(`item:${username}:${collectionSlug}:${updated.slug}`, 'max');
  }

  return { success: true, item: updated ? (updated as unknown as CollectionOwnerItem) : undefined };
}
