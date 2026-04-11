import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCollectionFirstImage, getPublicCollectionBySlug, getPublicItemsInCollection } from '@/lib/collections';
import { CloudinaryImage } from '@/src/shared/ui/CloudinaryImage';
import { DataSchema } from '@/src/shared/ui/DataSchema';
import { generateCollectionListingSchema } from '@/lib/seo';
import { getBreadcrumbSchema } from '@/src/shared/lib/schema/breadcrumb';
import { OwnerCollectionActions } from '@/src/features/owner-collection-actions';
import { NonOwnerItemActions } from '@/src/features/non-owner-item-actions';
import { SocialShare } from '@/src/features/social-share';
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
  const { username, collectionSlug } = await params;

  const result = await getPublicCollectionBySlug(username, collectionSlug);
  if (!result) notFound();

  const { collection } = result;
  const items = await getPublicItemsInCollection(collection.id, username, collectionSlug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  const schema = generateCollectionListingSchema({
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
            <OwnerCollectionActions
              username={username}
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
                          <CloudinaryImage
                            src={item.image_url}
                            alt={item.name}
                            sizes="(max-width: 420px) 100vw, (max-width: 720px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                  {item.likes_count > 0 && (
                    <span className={styles['item-card__like-count']}>
                      {/* TODO(design-system): needs tokens --color-like-gradient-from (rose-500 #f43f6e) and --color-like-gradient-to (orange-400 #fb923c) */}
                      <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <defs>
                          <linearGradient id="like-count-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f43f6e" />
                            <stop offset="100%" stopColor="#fb923c" />
                          </linearGradient>
                        </defs>
                        <path fill="url(#like-count-gradient)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      {item.likes_count}
                    </span>
                  )}
                </Link>
                <Suspense fallback={undefined}>
                  <div className={styles.itemActions}>
                    <NonOwnerItemActions
                      username={username}
                      collectionSlug={collectionSlug}
                      item={item}
                    />
                  </div>
                </Suspense>
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  const result = await getPublicCollectionBySlug(username, collectionSlug);
  const collectionName = result?.collection.name ?? collectionSlug;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: `@${username}`, url: `${baseUrl}/${username}` },
    { name: collectionName, url: `${baseUrl}/${username}/${collectionSlug}` },
  ]);

  return (
    <>
      <DataSchema schema={breadcrumbSchema} id="breadcrumb-schema" />
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href={`/${username}`} className={styles.breadcrumbLink}>
          @
          {username}
        </Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
        <span>{collectionName}</span>
      </nav>
    </>
  );
}

export default function CollectionPage({ params }: Properties) {
  return (
    <div className={`container ${styles.page}`}>
      <BreadcrumbNav params={params} />
      <CollectionContent params={params} />
    </div>
  );
}
