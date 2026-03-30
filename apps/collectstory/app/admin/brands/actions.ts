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

export async function createBrand(formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  if (!name) throw new Error('Name is required');

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('brands')
    .insert({ name, slug: slugify(name) });

  if (error?.code === '23505') {
    return { error: 'A brand with that name already exists.' };
  }
  if (error) throw new Error(error.message);

  revalidatePath('/admin/brands');
  redirect('/admin/brands');
}

export async function updateBrand(id: string, formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  if (!name) throw new Error('Name is required');

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('brands')
    .update({ name, slug: slugify(name) })
    .eq('id', id);

  if (error?.code === '23505') {
    return { error: 'A brand with that name already exists.' };
  }
  if (error) throw new Error(error.message);

  revalidatePath('/admin/brands');
  redirect('/admin/brands');
}

export async function deleteBrand(id: string) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase.from('brands').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/brands');
  redirect('/admin/brands');
}
