'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionAndRole } from '@/lib/auth/role';

async function requireAdmin() {
  const session = await getSessionAndRole();
  if (!session || session.role !== 'admin') {
    throw new Error('Forbidden');
  }
}

function parseOptionalString(value: FormDataEntryValue | undefined): string | undefined {
  const trimmed = (value as string | undefined)?.trim();
  return trimmed || undefined;
}

function parseOptionalNumber(value: FormDataEntryValue | undefined): number | undefined {
  const trimmed = (value as string | undefined)?.trim();
  if (!trimmed) return undefined;
  const number_ = Number(trimmed);
  return Number.isNaN(number_) ? undefined : number_;
}

function parseStoreFields(formData: FormData, name: string) {
  return {
    name,
    url: parseOptionalString(formData.get('url') ?? undefined),
    country: parseOptionalString(formData.get('country') ?? undefined),
    city: parseOptionalString(formData.get('city') ?? undefined),
    lat: parseOptionalNumber(formData.get('lat') ?? undefined),
    lng: parseOptionalNumber(formData.get('lng') ?? undefined),
    verified: formData.get('verified') === 'true',
    cover_url: parseOptionalString(formData.get('cover_url') ?? undefined),
    logo_url: parseOptionalString(formData.get('logo_url') ?? undefined),
    address: parseOptionalString(formData.get('address') ?? undefined),
    google_place_id: parseOptionalString(formData.get('google_place_id') ?? undefined),
  };
}

export async function createStore(formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  if (!name) throw new Error('Name is required');

  const supabase = createAdminClient();
  const { error } = await supabase.from('stores').insert(parseStoreFields(formData, name));

  if (error) throw new Error(error.message);

  revalidatePath('/admin/stores');
  redirect('/admin/stores');
}

export async function updateStore(id: string, formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  if (!name) throw new Error('Name is required');

  const supabase = createAdminClient();

  // Fetch the current slug to invalidate the public cache tag
  const { data: current } = await supabase.from('stores').select('slug').eq('id', id).single();

  const { error } = await supabase.from('stores').update(parseStoreFields(formData, name)).eq('id', id);

  if (error) throw new Error(error.message);

  if (current?.slug) revalidateTag(`store-${current.slug}`, 'max');
  revalidatePath('/admin/stores');
  redirect('/admin/stores');
}

export async function softDeleteStore(id: string) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data: current } = await supabase.from('stores').select('slug').eq('id', id).single();
  const { error } = await supabase
    .from('stores')
    .update({ visible: false })
    .eq('id', id);

  if (error) throw new Error(error.message);

  if (current?.slug) revalidateTag(`store-${current.slug}`, 'max');
  revalidatePath('/admin/stores');
  redirect('/admin/stores');
}

export async function toggleStoreVerified(id: string, verified: boolean) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data: current } = await supabase.from('stores').select('slug').eq('id', id).single();
  const { error } = await supabase
    .from('stores')
    .update({ verified })
    .eq('id', id);

  if (error) throw new Error(error.message);

  if (current?.slug) revalidateTag(`store-${current.slug}`, 'max');
  revalidatePath('/admin/stores');
}

export async function addCatalogItemToStore(
  storeId: string,
  catalogItemId: string,
  productUrl?: string,
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data: store } = await supabase.from('stores').select('slug').eq('id', storeId).single();

  const { error } = await supabase
    .from('catalog_item_stores')
    .insert({
      store_id: storeId,
      catalog_item_id: catalogItemId,
      product_url: productUrl?.trim() || null,
    });

  if (error) {
    if (error.code === '23505') return { error: 'This item is already linked to the store.' };
    return { error: 'Failed to add item. Please try again.' };
  }

  if (store?.slug) revalidateTag(`store-${store.slug}`, 'max');
  return { success: true };
}

export async function updateCatalogItemStoreUrl(
  storeId: string,
  catalogItemId: string,
  productUrl: string,
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data: store } = await supabase.from('stores').select('slug').eq('id', storeId).single();

  const { error } = await supabase
    .from('catalog_item_stores')
    .update({ product_url: productUrl.trim() || null })
    .eq('store_id', storeId)
    .eq('catalog_item_id', catalogItemId);

  if (error) return { error: 'Failed to update URL. Please try again.' };

  if (store?.slug) revalidateTag(`store-${store.slug}`, 'max');
  return { success: true };
}

export async function removeCatalogItemFromStore(
  storeId: string,
  catalogItemId: string,
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data: store } = await supabase.from('stores').select('slug').eq('id', storeId).single();

  const { error } = await supabase
    .from('catalog_item_stores')
    .delete()
    .eq('store_id', storeId)
    .eq('catalog_item_id', catalogItemId);

  if (error) return { error: 'Failed to remove item. Please try again.' };

  if (store?.slug) revalidateTag(`store-${store.slug}`, 'max');
  return { success: true };
}

export async function addStoreToItem(
  itemId: string,
  storeId: string,
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('collection_item_stores')
    .insert({ item_id: itemId, store_id: storeId });

  if (error) {
    if (error.code === '23505') return { error: 'This store is already linked to the item.' };
    return { error: 'Failed to add store. Please try again.' };
  }

  return { success: true };
}

export async function removeStoreFromItem(
  itemId: string,
  storeId: string,
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('collection_item_stores')
    .delete()
    .eq('item_id', itemId)
    .eq('store_id', storeId);

  if (error) return { error: 'Failed to remove store. Please try again.' };

  return { success: true };
}
