import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export type FranchiseLocalizedName = {
  id: string;
  locale: string;
  name: string;
  slug: string;
};

export type FranchiseCard = {
  id: string;
  name: string;
  slug: string;
  description: string | undefined;
  image_url: string;
  localized_names: FranchiseLocalizedName[];
};

export type FranchiseItem = {
  id: string;
  name: string;
  slug: string;
  image_url: string | undefined;
  username: string | undefined;
  collectionSlug: string | undefined;
};

export type FranchiseDetail = FranchiseCard & {
  items: FranchiseItem[];
};

export async function getAllPublicFranchises(): Promise<FranchiseCard[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('franchises')
    .select('id, name, slug, description, image_url, franchise_localized_names ( id, locale, name, slug )')
    .order('name');

  return (data ?? []).map(f => ({
    id: f.id,
    name: f.name,
    slug: f.slug,
    description: f.description ?? undefined,
    image_url: f.image_url,
    localized_names: (f.franchise_localized_names as unknown as FranchiseLocalizedName[]) ?? [],
  }));
}

export async function getFranchiseBySlug(slug: string): Promise<FranchiseDetail | null> {
  const supabase = createPublicClient();

  const { data: franchise } = await supabase
    .from('franchises')
    .select('id, name, slug, description, image_url, franchise_localized_names ( id, locale, name, slug )')
    .eq('slug', slug)
    .single();

  if (!franchise) return null;

  const { data: items } = await supabase
    .from('collection_items')
    .select('id, name, slug, image_url, user_id, collection_id, collections ( slug ), profiles ( username )')
    .eq('franchise_id', franchise.id)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  return {
    id: franchise.id,
    name: franchise.name,
    slug: franchise.slug,
    description: franchise.description ?? undefined,
    image_url: franchise.image_url,
    localized_names: (franchise.franchise_localized_names as unknown as FranchiseLocalizedName[]) ?? [],
    items: (items ?? []).map(item => {
      const col = item.collections as unknown as { slug: string } | null;
      const prof = item.profiles as unknown as { username: string } | null;
      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        image_url: item.image_url ?? undefined,
        username: prof?.username ?? undefined,
        collectionSlug: col?.slug ?? undefined,
      };
    }),
  };
}

export async function getOfficialSlugByLocalizedSlug(localizedSlug: string): Promise<string | null> {
  const supabase = createPublicClient();

  const { data } = await supabase
    .from('franchise_localized_names')
    .select('franchises ( slug )')
    .eq('slug', localizedSlug)
    .single();

  if (!data) return null;
  const franchise = data.franchises as unknown as { slug: string } | null;
  return franchise?.slug ?? null;
}

export async function getAllFranchiseSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from('franchises').select('slug');
  return (data ?? []).map(f => f.slug);
}
