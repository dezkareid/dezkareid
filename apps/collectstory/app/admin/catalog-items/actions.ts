'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionAndRole } from '@/lib/auth/role';
import { toSlug } from '@/lib/slug';

async function requireAdmin() {
  const session = await getSessionAndRole();
  if (!session || session.role !== 'admin') {
    throw new Error('Forbidden');
  }
}

function parseOptionalString(value: FormDataEntryValue | null): string | null {
  const trimmed = (value as string | null)?.trim();
  // eslint-disable-next-line unicorn/no-null -- null required to clear nullable Postgres columns
  return trimmed || null;
}

async function generateUniqueCatalogSlug(name: string): Promise<string> {
  const base = toSlug(name);
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('catalog_items')
    .select('slug')
    .like('slug', `${base}%`);

  const taken = new Set((existing ?? []).map(r => r.slug));
  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix++;
  return `${base}-${suffix}`;
}

export async function createCatalogItem(formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  if (!name) throw new Error('Name is required');

  const slug = await generateUniqueCatalogSlug(name);
  const supabase = createAdminClient();

  const { error } = await supabase.from('catalog_items').insert({
    name,
    slug,
    description: parseOptionalString(formData.get('description')),
    image_url: parseOptionalString(formData.get('image_url')),
    franchise_id: parseOptionalString(formData.get('franchise_id')),
    line_id: parseOptionalString(formData.get('line_id')),
  });

  if (error) throw new Error(error.message);

  revalidatePath('/admin/catalog-items');
  redirect('/admin/catalog-items');
}

export async function updateCatalogItem(id: string, formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  if (!name) throw new Error('Name is required');

  const supabase = createAdminClient();

  const { error } = await supabase.from('catalog_items').update({
    name,
    description: parseOptionalString(formData.get('description')),
    image_url: parseOptionalString(formData.get('image_url')),
    franchise_id: parseOptionalString(formData.get('franchise_id')),
    line_id: parseOptionalString(formData.get('line_id')),
  }).eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/catalog-items');
  revalidatePath(`/admin/catalog-items/${id}/edit`);
}

export async function deleteCatalogItem(id: string) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase.from('catalog_items').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/catalog-items');
  redirect('/admin/catalog-items');
}

export async function addStoreToCatalogItem(
  catalogItemId: string,
  storeId: string,
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('catalog_item_stores')
    .insert({ catalog_item_id: catalogItemId, store_id: storeId });

  if (error) {
    if (error.code === '23505') return { error: 'This store is already linked to the catalog item.' };
    return { error: 'Failed to add store. Please try again.' };
  }

  revalidatePath(`/admin/catalog-items/${catalogItemId}/edit`);
  return { success: true };
}

export async function removeStoreFromCatalogItem(
  catalogItemId: string,
  storeId: string,
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('catalog_item_stores')
    .delete()
    .eq('catalog_item_id', catalogItemId)
    .eq('store_id', storeId);

  if (error) return { error: 'Failed to remove store. Please try again.' };

  revalidatePath(`/admin/catalog-items/${catalogItemId}/edit`);
  return { success: true };
}
