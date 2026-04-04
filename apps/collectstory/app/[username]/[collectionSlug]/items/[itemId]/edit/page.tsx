import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPublicCollectionBySlug } from '@/lib/collections';
import { EditItemForm } from './EditItemForm';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ username: string; collectionSlug: string; itemId: string }>;
};

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { collectionSlug } = await params;
  return { title: `Edit Item — ${collectionSlug}` };
}

async function getAuthorizedUser(supabase: Awaited<ReturnType<typeof createClient>>, username: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();
  if (profile?.username !== username) notFound();
  return user;
}

async function fetchEditPageData(supabase: Awaited<ReturnType<typeof createClient>>, itemId: string, userId: string) {
  const [{ data: item }, { data: brands }] = await Promise.all([
    supabase
      .from('collection_items')
      .select('id, name, image_url, description, date_acquired, visibility, line_id, lines ( id, name, brand_id, brands ( id, name ) )')
      .eq('id', itemId)
      .eq('user_id', userId)
      .single(),
    supabase
      .from('brands')
      .select('id, name')
      .order('name'),
  ]);
  return { item, brands };
}

async function EditItemContent({ params }: Properties) {
  await connection();
  const { username, collectionSlug, itemId } = await params;

  const supabase = await createClient();
  const user = await getAuthorizedUser(supabase, username);

  const result = await getPublicCollectionBySlug(username, collectionSlug);
  if (!result) notFound();

  const { item, brands } = await fetchEditPageData(supabase, itemId, user.id);
  if (!item) notFound();

  return (
    <div className={styles.card}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href={`/${username}`} className={styles.breadcrumbLink}>
          @
          {username}
        </Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
        <Link href={`/${username}/${collectionSlug}`} className={styles.breadcrumbLink}>
          {collectionSlug}
        </Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
        <span>Edit Item</span>
      </nav>

      <h1 className={styles.title}>Edit Item</h1>

      <EditItemForm
        itemId={item.id}
        currentName={item.name}
        currentImageUrl={(item.image_url as string | null) ?? undefined}
        currentDescription={(item.description as string | null) ?? undefined}
        currentDateAcquired={(item.date_acquired as string | null) ?? undefined}
        currentVisibility={(item.visibility as string | null) ?? 'public'}
        currentLineId={(item.line_id as string | null) ?? undefined}
        currentBrandId={((item.lines as unknown as { brand_id: string } | null)?.brand_id) ?? undefined}
        brands={(brands ?? []) as { id: string; name: string }[]}
        username={username}
        collectionSlug={collectionSlug}
      />
    </div>
  );
}

export default function EditItemPage({ params }: Properties) {
  return (
    <main className={styles.page}>
      <Suspense>
        <EditItemContent params={params} />
      </Suspense>
    </main>
  );
}
