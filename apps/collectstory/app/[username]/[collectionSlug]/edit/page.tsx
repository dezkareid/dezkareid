import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EditCollectionForm } from './EditCollectionForm';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ username: string; collectionSlug: string }>;
};

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { collectionSlug } = await params;
  return { title: `Edit ${collectionSlug}` };
}

export default async function EditCollectionPage({ params }: Properties) {
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

  const { data: collection } = await supabase
    .from('collections')
    .select('id, name, slug, description')
    .eq('user_id', user.id)
    .eq('slug', collectionSlug)
    .single();

  if (!collection) notFound();

  return (
    <main className={styles.page}>
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
          <span>Edit</span>
        </nav>

        <h1 className={styles.title}>Edit Collection</h1>

        <EditCollectionForm
          collectionId={collection.id}
          currentName={collection.name}
          currentDescription={(collection.description as string | null) ?? undefined}
          username={username}
          collectionSlug={collectionSlug}
        />
      </div>
    </main>
  );
}
