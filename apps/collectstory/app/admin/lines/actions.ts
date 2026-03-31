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

export async function createLine(formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  const brandId = (formData.get('brand_id') as string).trim();
  if (!name) throw new Error('Name is required');
  if (!brandId) throw new Error('Brand is required');

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('lines')
    .insert({
      name,
      slug: slugify(name),
      brand_id: brandId,
      // eslint-disable-next-line unicorn/no-null -- null required to clear FK in database
      category_id: parseOptionalString(formData, 'category_id') ?? null,
      image_url: parseOptionalString(formData, 'image_url'),
    });

  if (error?.code === '23505') {
    return { error: 'A line with that name already exists.' };
  }
  if (error) throw new Error(error.message);

  revalidatePath('/admin/lines');
  redirect('/admin/lines');
}

export async function updateLine(id: string, formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  const brandId = (formData.get('brand_id') as string).trim();
  if (!name) throw new Error('Name is required');
  if (!brandId) throw new Error('Brand is required');

  const supabase = createAdminClient();
  const updates: Record<string, string | null | undefined> = {
    name,
    slug: slugify(name),
    brand_id: brandId,
    // eslint-disable-next-line unicorn/no-null -- null required to clear FK in database
    category_id: parseOptionalString(formData, 'category_id') ?? null,
  };
  const imageUrl = parseOptionalString(formData, 'image_url');
  if (imageUrl !== undefined) updates.image_url = imageUrl;

  const { error } = await supabase
    .from('lines')
    .update(updates)
    .eq('id', id);

  if (error?.code === '23505') {
    return { error: 'A line with that name already exists.' };
  }
  if (error) throw new Error(error.message);

  revalidatePath('/admin/lines');
  redirect('/admin/lines');
}

export async function deleteLine(id: string) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase.from('lines').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/lines');
  redirect('/admin/lines');
}
