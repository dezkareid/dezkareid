import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAllFranchises } from '@/app/collection/actions';
import { AddItemPageForm } from './AddItemPageForm';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ username: string; collectionSlug: string }>;
};

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { collectionSlug } = await params;
  return { title: `Add Item to ${collectionSlug}` };
}

async function AddItemContent({ params }: Properties) {
  await connection();
  const { username, collectionSlug } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profile?.username !== username) notFound();

  const [{ data: collection }, { data: brands }, franchises] = await Promise.all([
    supabase
      .from('collections')
      .select('id')
      .eq('user_id', user.id)
      .eq('slug', collectionSlug)
      .single(),
    supabase.from('brands').select('id, name').order('name'),
    getAllFranchises(),
  ]);

  if (!collection) notFound();

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
        <span>Add Item</span>
      </nav>

      <h1 className={styles.title}>Add Item</h1>

      <AddItemPageForm
        brands={(brands ?? []) as { id: string; name: string }[]}
        franchises={franchises}
        collectionId={collection.id}
        username={username}
        collectionSlug={collectionSlug}
      />
    </div>
  );
}

export default function AddItemPage({ params }: Properties) {
  return (
    <main className={styles.page}>
      <Suspense>
        <AddItemContent params={params} />
      </Suspense>
    </main>
  );
}
