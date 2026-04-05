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

export async function createFranchise(formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  if (!name) throw new Error('Name is required');

  const imageUrl = parseOptionalString(formData, 'image_url');
  if (!imageUrl) return { error: 'A cover image is required.' };

  const slug = parseOptionalString(formData, 'slug') ?? slugify(name);
  const description = parseOptionalString(formData, 'description');

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('franchises')
    .insert({ name, slug, description, image_url: imageUrl });

  if (error?.code === '23505') {
    return { error: 'A franchise with that name or slug already exists.' };
  }
  if (error) throw new Error(error.message);

  revalidatePath('/admin/franchises');
  revalidatePath('/franchises');
  redirect('/admin/franchises');
}

export async function updateFranchise(id: string, formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  if (!name) throw new Error('Name is required');

  const slug = parseOptionalString(formData, 'slug') ?? slugify(name);
  const description = parseOptionalString(formData, 'description');
  const imageUrl = parseOptionalString(formData, 'image_url');
  if (!imageUrl) return { error: 'A cover image is required.' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('franchises')
    .update({ name, slug, description, image_url: imageUrl })
    .eq('id', id);

  if (error?.code === '23505') {
    return { error: 'A franchise with that name or slug already exists.' };
  }
  if (error) throw new Error(error.message);

  revalidatePath('/admin/franchises');
  revalidatePath('/franchises');
  revalidatePath(`/franchises/${slug}`);
  redirect('/admin/franchises');
}

export async function deleteFranchise(id: string) {
  await requireAdmin();

  const supabase = createAdminClient();

  const { data: franchise } = await supabase
    .from('franchises')
    .select('slug')
    .eq('id', id)
    .single();

  const { error } = await supabase.from('franchises').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/franchises');
  revalidatePath('/franchises');
  if (franchise?.slug) revalidatePath(`/franchises/${franchise.slug}`);
  redirect('/admin/franchises');
}
