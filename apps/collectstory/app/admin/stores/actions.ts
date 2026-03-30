'use server';

import { revalidatePath } from 'next/cache';
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

export async function createStore(formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  if (!name) throw new Error('Name is required');

  const supabase = createAdminClient();
  const { error } = await supabase.from('stores').insert({
    name,
    url: parseOptionalString(formData.get('url') ?? undefined),
    country: parseOptionalString(formData.get('country') ?? undefined),
    city: parseOptionalString(formData.get('city') ?? undefined),
    lat: parseOptionalNumber(formData.get('lat') ?? undefined),
    lng: parseOptionalNumber(formData.get('lng') ?? undefined),
  });

  if (error) throw new Error(error.message);

  revalidatePath('/admin/stores');
  redirect('/admin/stores');
}

export async function updateStore(id: string, formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  if (!name) throw new Error('Name is required');

  const supabase = createAdminClient();
  const { error } = await supabase.from('stores').update({
    name,
    url: parseOptionalString(formData.get('url') ?? undefined),
    country: parseOptionalString(formData.get('country') ?? undefined),
    city: parseOptionalString(formData.get('city') ?? undefined),
    lat: parseOptionalNumber(formData.get('lat') ?? undefined),
    lng: parseOptionalNumber(formData.get('lng') ?? undefined),
  }).eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/stores');
  redirect('/admin/stores');
}

export async function deleteStore(id: string) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase.from('stores').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/stores');
  redirect('/admin/stores');
}
