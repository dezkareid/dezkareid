'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { generateUniqueCollectionSlug, generateUniqueSlug } from '@/lib/slug';

type QuickStartState
  = | { error: string; field?: 'collectionName' | 'itemName' }
    | { success: true; collectionSlug: string }
    | undefined;

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function quickStartCollection(
  _previousState: QuickStartState,
  formData: FormData,
): Promise<QuickStartState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in to create a collection.' };

  const collectionName = getString(formData, 'collectionName');
  if (!collectionName) return { error: 'Collection name is required.', field: 'collectionName' };

  const itemName = getString(formData, 'itemName');
  if (!itemName) return { error: 'Item name is required.', field: 'itemName' };

  const username = getString(formData, 'username');

  const collectionSlug = await generateUniqueCollectionSlug(supabase, user.id, collectionName);

  const { data: newCollection, error: collectionError } = await supabase
    .from('collections')
    .insert({ user_id: user.id, name: collectionName, slug: collectionSlug, visibility: 'public' })
    .select('id')
    .single();

  if (collectionError || !newCollection) {
    return { error: 'Failed to create collection. Please try again.' };
  }

  const itemSlug = await generateUniqueSlug(supabase, user.id, itemName);

  const { error: itemError } = await supabase
    .from('collection_items')
    .insert({
      user_id: user.id,
      collection_id: newCollection.id,
      name: itemName,
      slug: itemSlug,
      visibility: 'public',
    });

  if (itemError) {
    return { error: 'Collection created, but failed to add item. Please add it manually.' };
  }

  revalidatePath(`/${username}`);
  revalidateTag(`profile:${username}`, 'max');
  revalidateTag(`collection:${username}:${collectionSlug}`, 'max');

  return { success: true, collectionSlug };
}

export async function getUserCollections() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: collections, error } = await supabase
    .from('collections')
    .select('id, name, slug')
    .eq('user_id', user.id)
    .order('name');

  if (error) {
    console.error('Error fetching user collections:', error);
    return [];
  }

  return collections;
}
