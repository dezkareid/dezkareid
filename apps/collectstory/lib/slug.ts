import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Slugified values that carry no meaningful information and must be excluded
 * from disambiguating slug options (e.g. "Unknown", "N/A", "None").
 * The SQL function get_slug_options mirrors this list.
 */
export const MEANINGLESS_SLUG_PARTS = new Set([
  'unknown',
  'unknow',
  'n-a',
  'na',
  'none',
  'other',
  'misc',
  'miscellaneous',
  'tbd',
  'tba',
]);

/**
 * Returns the slugified value of a field, or undefined if it would produce
 * a meaningless slug part (e.g. "Unknown" → undefined).
 */
export function toSlugField(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const slug = toSlug(value);
  if (!slug || MEANINGLESS_SLUG_PARTS.has(slug)) return undefined;
  return slug;
}

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
  collectionId: string,
  name: string,
): Promise<string> {
  const base = toSlug(name);

  const { data: existing } = await supabase
    .from('collection_items')
    .select('slug')
    .eq('collection_id', collectionId)
    .like('slug', `${base}%`);

  const taken = new Set((existing ?? []).map(r => r.slug));

  if (!taken.has(base)) return base;

  // Append a short random alphanumeric suffix and retry until a free slug is found.
  for (let attempt = 0; attempt < 20; attempt++) {
    const suffix = Math.random().toString(36).slice(2, 7);
    const candidate = `${base}-${suffix}`;
    if (!taken.has(candidate)) return candidate;
  }

  // Extremely unlikely fallback
  return `${base}-${crypto.randomUUID().replaceAll('-', '').slice(0, 8)}`;
}

export async function generateUniqueCollectionSlug(
  supabase: SupabaseClient,
  userId: string,
  name: string,
): Promise<string> {
  const base = toSlug(name);

  const { data: existing } = await supabase
    .from('collections')
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
