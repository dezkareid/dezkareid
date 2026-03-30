import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { ItemImageSection } from './ItemImageSection';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ username: string; slug: string }>;
};

function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

async function getPublicItem(username: string, slug: string) {
  const supabase = createPublicClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (!profile) return;

  const { data: item } = await supabase
    .from('collection_items')
    .select(`
      id,
      name,
      image_url,
      description,
      date_acquired,
      user_id,
      brands ( name ),
      lines ( name ),
      categories ( name )
    `)
    .eq('user_id', profile.id)
    .eq('slug', slug)
    .eq('visibility', 'public')
    .single();

  return item ?? undefined;
}

async function getItemMetadata(username: string, slug: string) {
  'use cache';

  const supabase = createPublicClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (!profile) return;

  const { data: item } = await supabase
    .from('collection_items')
    .select('name, description, brands ( name )')
    .eq('user_id', profile.id)
    .eq('slug', slug)
    .eq('visibility', 'public')
    .single();

  return item ?? undefined;
}

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { username, slug } = await params;
  const item = await getItemMetadata(username, slug);

  if (!item) return {};

  const brand = (item.brands as { name: string }[])[0]?.name;
  const description = item.description
    ?? (brand
      ? `${item.name} by ${brand} — part of ${username}'s collection on Collectstory.`
      : `${item.name} — part of ${username}'s collection on Collectstory.`);

  return {
    title: `${item.name} — Collectstory`,
    description,
    alternates: {
      canonical: `/${username}/items/${slug}`,
    },
  };
}

async function ItemDetail({ username, slug }: { username: string; slug: string }) {
  await connection();

  const item = await getPublicItem(username, slug);
  if (!item) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === item.user_id;

  const brand = (item.brands as { name: string }[])[0]?.name;
  const line = (item.lines as { name: string }[])[0]?.name;
  const category = (item.categories as { name: string }[])[0]?.name;

  return (
    <>
      <ItemImageSection
        itemId={item.id}
        imageUrl={item.image_url ?? undefined}
        name={item.name}
        isOwner={isOwner}
      />

      <div className={styles.details}>
        <p className={styles.owner}>
          <a href={`/${username}`} className={styles.ownerLink}>
            @
            {username}
          </a>
        </p>

        <h1 className={styles.name}>{item.name}</h1>

        <div className={styles.tags}>
          {brand && <span className={styles.tag}>{brand}</span>}
          {line && <span className={styles.tagSecondary}>{line}</span>}
          {category && <span className={styles.tagSecondary}>{category}</span>}
        </div>

        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}

        {item.date_acquired && (
          <time className={styles.date} dateTime={item.date_acquired}>
            Acquired
            {' '}
            {new Date(item.date_acquired).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
      </div>
    </>
  );
}

export default function ItemDetailPage({ params }: Properties) {
  return (
    <main className={styles.page}>
      <Suspense>
        <ItemDetailInner params={params} />
      </Suspense>
    </main>
  );
}

async function ItemDetailInner({ params }: Properties) {
  const { username, slug } = await params;
  return <ItemDetail username={username} slug={slug} />;
}
