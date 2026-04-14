import { cacheLife, cacheTag } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export type GlobalMetrics = {
  total_collections: number;
  total_items: number;
  total_users: number;
};

export async function getGlobalMetrics(): Promise<GlobalMetrics> {
  'use cache';

  cacheTag('global_metrics');
  cacheLife('hours'); // Cache for a few hours

  const supabase = createPublicClient();

  const [
    { count: collectionsCount },
    { count: itemsCount },
    { count: usersCount },
  ] = await Promise.all([
    supabase.from('collections').select('*', { count: 'exact', head: true }),
    supabase.from('collection_items').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);

  return {
    total_collections: collectionsCount || 0,
    total_items: itemsCount || 0,
    total_users: usersCount || 0,
  };
}
