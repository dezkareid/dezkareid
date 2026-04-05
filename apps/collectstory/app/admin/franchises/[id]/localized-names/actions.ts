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

// Lightweight BCP 47 validation: e.g. es, es-419, zh-Hant, zh-Hant-TW
const BCP47_RE = /^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2}|\d{3})?$/;

export async function createLocalizedName(franchiseId: string, formData: FormData) {
  await requireAdmin();

  const locale = (formData.get('locale') as string).trim();
  const name = (formData.get('name') as string).trim();

  if (!locale) return { error: 'Locale is required.' };
  if (!BCP47_RE.test(locale)) return { error: 'Locale must be a valid BCP 47 code (e.g. es-419, ja, en).' };
  if (!name) return { error: 'Name is required.' };

  const slug = slugify(name);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('franchise_localized_names')
    .insert({ franchise_id: franchiseId, locale, name, slug });

  if (error?.code === '23505') {
    return { error: 'This locale already has a name for this franchise, or the slug conflicts with another entry.' };
  }
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/franchises/${franchiseId}/edit`);
  redirect(`/admin/franchises/${franchiseId}/edit`);
}

export async function updateLocalizedName(nameId: string, franchiseId: string, formData: FormData) {
  await requireAdmin();

  const locale = (formData.get('locale') as string).trim();
  const name = (formData.get('name') as string).trim();

  if (!locale) return { error: 'Locale is required.' };
  if (!BCP47_RE.test(locale)) return { error: 'Locale must be a valid BCP 47 code (e.g. es-419, ja, en).' };
  if (!name) return { error: 'Name is required.' };

  const slug = slugify(name);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('franchise_localized_names')
    .update({ locale, name, slug })
    .eq('id', nameId);

  if (error?.code === '23505') {
    return { error: 'This locale already has a name for this franchise, or the slug conflicts with another entry.' };
  }
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/franchises/${franchiseId}/edit`);
  redirect(`/admin/franchises/${franchiseId}/edit`);
}

export async function deleteLocalizedName(id: string) {
  await requireAdmin();

  const supabase = createAdminClient();

  // Fetch franchise_id so we can redirect back to the edit page
  const { data: record } = await supabase
    .from('franchise_localized_names')
    .select('franchise_id')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('franchise_localized_names')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  if (record?.franchise_id) {
    revalidatePath(`/admin/franchises/${record.franchise_id}/edit`);
    redirect(`/admin/franchises/${record.franchise_id}/edit`);
  }
  else {
    revalidatePath('/admin/franchises');
    redirect('/admin/franchises');
  }
}
