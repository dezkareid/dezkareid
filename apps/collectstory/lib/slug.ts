import type { SupabaseClient } from '@supabase/supabase-js';

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '')
    .slice(0, 60);
}

export async function generateUniqueSlug(
  supabase: SupabaseClient,
  userId: string,
  name: string,
): Promise<string> {
  const base = toSlug(name);

  const { data: existing } = await supabase
    .from('collection_items')
    .select('slug')
    .eq('user_id', userId)
    .like('slug', `${base}%`);

  const taken = new Set((existing ?? []).map(r => r.slug));

  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) {
    suffix++;
  }

  return `${base}-${suffix}`;
}
