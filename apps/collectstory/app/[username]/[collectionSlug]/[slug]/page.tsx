import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPublicCollectionBySlug, getPublicItemBySlug, type PublicItemDetail } from '@/lib/collections';
import { ItemImageSection } from './ItemImageSection';
import { ItemActions } from '@/components/username/ItemActions';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ username: string; collectionSlug: string; slug: string }>;
};

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { username, collectionSlug, slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  const collectionResult = await getPublicCollectionBySlug(username, collectionSlug);
  if (!collectionResult) return {};

  const item = await getPublicItemBySlug(collectionResult.collection.id, slug);
  if (!item) return {};

  const brand = item.lines?.brands?.name;
  const line = item.lines?.name;

  const description = item.description
    ?? (brand && line
      ? `${item.name} from ${line} by ${brand}. Part of ${username}'s ${collectionResult.collection.name} collection on Collectstory.`
      : `${item.name} — part of ${username}'s ${collectionResult.collection.name} collection on Collectstory.`);

  return {
    title: `${item.name} — ${collectionResult.collection.name} by ${username}`,
    description,
    alternates: { canonical: `${baseUrl}/${username}/${collectionSlug}/${slug}` },
    openGraph: {
      title: `${item.name} — ${collectionResult.collection.name} by ${username} — Collectstory`,
      description,
      url: `${baseUrl}/${username}/${collectionSlug}/${slug}`,
      images: item.image_url ? [{ url: item.image_url }] : [],
      type: 'website',
    },
  };
}

function ItemMeta({
  item,
  username,
  collectionSlug,
  isOwner,
}: {
  item: PublicItemDetail;
  username: string;
  collectionSlug: string;
  isOwner: boolean;
}) {
  const brand = item.lines?.brands?.name;
  const line = item.lines?.name;
  const category = item.lines?.categories?.name;

  return (
    <div className={styles.details}>
      <div className={styles.tags}>
        {brand && <span className={styles.tag}>{brand}</span>}
        {line && <span className={styles.tagSecondary}>{line}</span>}
        {category && <span className={styles.tagSecondary}>{category}</span>}
      </div>

      <h1 className={styles.name}>{item.name}</h1>

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

      {isOwner && (
        <Suspense>
          <ItemActions
            username={username}
            collectionSlug={collectionSlug}
            itemId={item.id}
          />
        </Suspense>
      )}
    </div>
  );
}

async function ItemDetail({
  params,
}: {
  params: Promise<{ username: string; collectionSlug: string; slug: string }>;
}) {
  await connection();
  const { username, collectionSlug, slug } = await params;

  const collectionResult = await getPublicCollectionBySlug(username, collectionSlug);
  if (!collectionResult) notFound();

  const item = await getPublicItemBySlug(collectionResult.collection.id, slug);
  if (!item) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === item.user_id;

  return (
    <div className={styles.layout}>
      <ItemImageSection
        itemId={item.id}
        imageUrl={item.image_url}
        name={item.name}
        isOwner={isOwner}
      />
      <ItemMeta
        item={item}
        username={username}
        collectionSlug={collectionSlug}
        isOwner={isOwner}
      />
    </div>
  );
}

async function BreadcrumbNav({
  params,
}: {
  params: Promise<{ username: string; collectionSlug: string; slug: string }>;
}) {
  const { username, collectionSlug, slug } = await params;
  return (
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
      <span>{slug}</span>
    </nav>
  );
}

export default function ItemDetailPage({ params }: Properties) {
  return (
    <main className={styles.page}>
      <Suspense>
        <BreadcrumbNav params={params} />
      </Suspense>

      <Suspense>
        <ItemDetail params={params} />
      </Suspense>
    </main>
  );
}
