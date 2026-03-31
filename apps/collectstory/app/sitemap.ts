import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/stores`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, updated_at')
    // eslint-disable-next-line unicorn/no-null -- Supabase filter for IS NOT NULL requires null literal
    .not('username', 'is', null);

  const profileRoutes: MetadataRoute.Sitemap = (profiles ?? []).map(p => ({
    url: `${baseUrl}/${p.username}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const { data: collections } = await supabase
    .from('collections')
    .select('slug, user_id, updated_at, profiles!inner ( username )')
    .eq('visibility', 'public');

  const collectionRoutes: MetadataRoute.Sitemap = (collections ?? []).map(c => ({
    url: `${baseUrl}/${(c.profiles as unknown as { username: string }).username}/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const { data: items } = await supabase
    .from('collection_items')
    .select('slug, updated_at, collections!inner ( slug, profiles!inner ( username ) )')
    .eq('visibility', 'public');

  const itemRoutes: MetadataRoute.Sitemap = (items ?? []).map((index) => {
    const col = index.collections as unknown as { slug: string; profiles: { username: string } };
    return {
      url: `${baseUrl}/${col.profiles.username}/${col.slug}/${index.slug}`,
      lastModified: new Date(index.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...profileRoutes, ...collectionRoutes, ...itemRoutes];
}
