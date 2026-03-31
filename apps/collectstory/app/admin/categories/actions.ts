'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionAndRole } from '@/lib/auth/role';
import { slugify } from '@/lib/utils/slugify';

async function requireAdmin() {
  const session = await getSessionAndRole();
  if (!session || session.role !== 'admin') {
    throw new Error('Forbidden');
  }
}

function parseOptionalString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return (typeof value === 'string' && value.trim()) ? value.trim() : undefined;
}

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  if (!name) throw new Error('Name is required');

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('categories')
    .insert({ name, slug: slugify(name), image_url: parseOptionalString(formData, 'image_url') });

  if (error?.code === '23505') {
    return { error: 'A category with that name already exists.' };
  }
  if (error) throw new Error(error.message);

  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  if (!name) throw new Error('Name is required');

  const supabase = createAdminClient();
  const updates: Record<string, string | undefined> = { name, slug: slugify(name) };
  const imageUrl = parseOptionalString(formData, 'image_url');
  if (imageUrl !== undefined) updates.image_url = imageUrl;

  const { error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id);

  if (error?.code === '23505') {
    return { error: 'A category with that name already exists.' };
  }
  if (error) throw new Error(error.message);

  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}
