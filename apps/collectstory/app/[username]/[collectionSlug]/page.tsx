import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { getCollectionFirstImage, getPublicCollectionBySlug, getPublicItemsInCollection } from '@/lib/collections';
import { createClient } from '@/lib/supabase/server';
import { DataSchema } from '@/src/shared/ui/DataSchema';
import { getCollectionSchema } from '@/src/entities/collection';
import { CollectionActions } from '@/components/username/CollectionActions';
import { SocialShare } from '@/src/features/social-share';
import { IHaveThisButton } from '@/src/features/copy-item';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ username: string; collectionSlug: string }>;
};

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { username, collectionSlug } = await params;
  const result = await getPublicCollectionBySlug(username, collectionSlug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  if (!result) return {};

  const { collection } = result;
  const firstImage = await getCollectionFirstImage(collection.id);
  const ogImage = firstImage ?? `${baseUrl}/logo.png`; // Fallback to brand logo

  return {
    title: `${collection.name} by ${username}`,
    description: `${collection.name}${collection.description ? ` — ${collection.description}` : ''} · collected by ${username} on Collectstory.`,
    alternates: { canonical: `${baseUrl}/${username}/${collectionSlug}` },
    openGraph: {
      title: `${collection.name} by ${username} — Collectstory`,
      description: `${collection.name} · collected by ${username} on Collectstory.`,
      url: `${baseUrl}/${username}/${collectionSlug}`,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: collection.name,
        },
      ],
    },
  };
}

async function CollectionContent({
  params,
}: {
  params: Promise<{ username: string; collectionSlug: string }>;
}) {
  await connection();
  const { username, collectionSlug } = await params;

  const result = await getPublicCollectionBySlug(username, collectionSlug);
  if (!result) notFound();

  const { collection } = result;
  const items = await getPublicItemsInCollection(collection.id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === result.userId;

  const schema = getCollectionSchema({
    collection,
    username,
    items,
    baseUrl,
  });

  return (
    <>
      <DataSchema schema={schema} />
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles['header__name-wrapper']}>
            <h1 className={styles.collectionName}>{collection.name}</h1>
            <SocialShare
              title={`${collection.name} by ${username} on Collectstory`}
              baseUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${username}/${collectionSlug}`}
              entityType="collection"
            />
          </div>
          {collection.description && (
            <p className={styles.collectionDesc}>{collection.description}</p>
          )}
          <p className={styles.collectionMeta}>
            {items.length}
            {' '}
            {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <div className={styles.ownerActions}>
          <Suspense fallback={undefined}>
            <CollectionActions
              username={username}
              collectionId={collection.id}
              collectionSlug={collectionSlug}
            />
          </Suspense>
        </div>
      </header>

      <div className={styles.grid}>
        {items.length === 0
          ? (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>No items in this collection</p>
                <p className={styles.emptyDesc}>Items added to this collection will appear here.</p>
              </div>
            )
          : items.map(item => (
              <div key={item.id} className={styles.itemCardWrapper}>
                <Link
                  href={`/${username}/${collectionSlug}/${item.slug}`}
                  className={styles.itemCard}
                >
                  <div className={styles.itemImage}>
                    {item.image_url
                      ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            sizes="(max-width: 420px) 100vw, (max-width: 720px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            style={{ objectFit: 'cover' }}
                          />
                        )
                      : (
                          <div className={styles.itemImagePlaceholder}>
                            📦
                          </div>
                        )}
                  </div>
                  <p className={styles.itemName}>{item.name}</p>
                  {item.lines?.name && (
                    <p className={styles.itemLine}>{item.lines.name}</p>
                  )}
                </Link>
                {!isOwner && (
                  <div className={styles.itemActions}>
                    <IHaveThisButton item={item} />
                  </div>
                )}
              </div>
            ))}
      </div>
    </>
  );
}

async function BreadcrumbNav({
  params,
}: {
  params: Promise<{ username: string; collectionSlug: string }>;
}) {
  const { username, collectionSlug } = await params;
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <Link href={`/${username}`} className={styles.breadcrumbLink}>
        @
        {username}
      </Link>
      <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
      <span>{collectionSlug}</span>
    </nav>
  );
}

export default function CollectionPage({ params }: Properties) {
  return (
    <div className={`container ${styles.page}`}>
      <Suspense>
        <BreadcrumbNav params={params} />
      </Suspense>

      <Suspense>
        <CollectionContent params={params} />
      </Suspense>
    </div>
  );
}
