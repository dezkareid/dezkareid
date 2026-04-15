import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  use,
  Suspense,
} from 'react';
import { getTranslations } from 'next-intl/server';
import { Image, Breadcrumb } from '@dezkareid/components/react-server';
import { routing } from '@/app/i18n/routing';
import {
  getCollectionFirstImage,
  getPublicCollectionBySlug,
  getPublicItemsInCollection,
} from '@/lib/collections';
import { getCloudinaryUrl } from '@/lib/image/cloudinary';
import { generateCollectionListingSchema } from '@/lib/seo';
import { NonOwnerItemActions } from '@/src/features/non-owner-item-actions';
import { OwnerCollectionActions } from '@/src/features/owner-collection-actions';
import { OwnerItemActions } from '@/src/features/owner-item-actions';
import { SocialShare } from '@/src/features/social-share';
import { getBreadcrumbSchema } from '@/src/shared/lib/schema/breadcrumb';
import { DataSchema } from '@/src/shared/ui/DataSchema';
import { OwnerEmptyStateFallback } from './_components/OwnerEmptyStateFallback';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ username: string; collectionSlug: string; locale: string }>;
};

// Collection pages are rendered on-demand — slugs are not known at build time.
export function generateStaticParams() {
  const { locales } = routing;
  return locales.map(locale => ({
    username: '_placeholder',
    collectionSlug: '_placeholder',
    locale,
  }));
}

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { username, collectionSlug } = await params;
  const t = await getTranslations('Common.profile.collection.metadata');
  const result = await getPublicCollectionBySlug(username, collectionSlug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  if (!result) return {};

  const { collection } = result;
  const firstImage = await getCollectionFirstImage(collection.id);
  const ogImage = (firstImage ? getCloudinaryUrl(firstImage, 1200) : undefined) ?? `${baseUrl}/logo.png`;

  const descriptionPrefix = collection.description ? ` — ${collection.description}` : '';

  return {
    title: t('title', { collectionName: collection.name, username }),
    description: t('description', {
      collectionName: collection.name,
      description: descriptionPrefix,
      username,
    }),
    alternates: { canonical: `${baseUrl}/${username}/${collectionSlug}` },
    openGraph: {
      title: t('title', { collectionName: collection.name, username }),
      description: t('description', {
        collectionName: collection.name,
        description: descriptionPrefix,
        username,
      }),
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
  username,
  collectionSlug,
}: {
  username: string;
  collectionSlug: string;
}) {
  const t = await getTranslations('Common');
  const tCol = await getTranslations('Common.profile.collection');
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
              title={tCol('share', { collectionName: collection.name, username })}
              baseUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${username}/${collectionSlug}`}
              entityType="collection"
            />
          </div>
          {collection.description && (
            <p className={styles.collectionDesc}>{collection.description}</p>
          )}
          <p className={styles.collectionMeta}>
            {tCol('items_count', { count: items.length })}
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

      {/*
        Non-owner grid: cached RSC, visible to visitors and search engines.
        OwnerItemActions streams in via Suspense and replaces this grid for
        the authenticated owner. When OwnerItemActions returns null (not owner),
        this cached grid stays visible.
      */}
      <div className={styles.grid}>
        {items.length === 0
          ? (
            <>
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>{t('no_items_in_collection')}</p>
                <p className={styles.emptyDesc}>{t('items_will_appear_here')}</p>
              </div>
              <Suspense fallback={undefined}>
                <OwnerEmptyStateFallback
                  username={username}
                  collectionSlug={collectionSlug}
                />
              </Suspense>
            </>
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
                        strategy="cloudinary"
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
                        <linearGradient id="like-count-gradient" x1="0%" x2="100%" y2="100%">
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

      {/* Owner interactive grid — streams in via Suspense. When non-empty it
          replaces the public grid above via CSS :has() on the page container. */}
      <Suspense fallback={undefined}>
        <div className={styles.ownerGrid}>
          <OwnerItemActions username={username} collectionSlug={collectionSlug} />
        </div>
      </Suspense>
    </>
  );
}

async function BreadcrumbNav({
  username,
  collectionSlug,
}: {
  username: string;
  collectionSlug: string;
}) {
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
      <Breadcrumb
        className={styles.breadcrumb}
        items={[
          { label: `@${username}`, href: `/${username}` },
          { label: collectionName },
        ]}
      />
    </>
  );
}

export default function CollectionPage({ params }: Properties) {
  const { username, collectionSlug } = use(params);
  return (
    <div className={`container ${styles.page}`}>
      <BreadcrumbNav username={username} collectionSlug={collectionSlug} />
      <CollectionContent username={username} collectionSlug={collectionSlug} />
    </div>
  );
}
