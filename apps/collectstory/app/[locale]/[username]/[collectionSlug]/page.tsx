import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { getTranslations } from 'next-intl/server';
import { Image, Breadcrumb } from '@dezkareid/components/react-server';
import { routing } from '@/app/i18n/routing';
import { getCollectionFirstImage } from '@/lib/collections';
import { getCloudinaryUrl } from '@/lib/image/cloudinary';
import { generateCollectionListingSchema } from '@/lib/seo';
import { NonOwnerItemActions } from '@/src/features/non-owner-item-actions';
import { OwnerCollectionActionsClient } from '@/src/features/owner-collection-actions';
import { CollectionItemsProvider, OwnerItemGrid } from '@/src/features/owner-item-actions';
import { ExploreButton } from '@/src/features/explore-collection/ui/ExploreButton';
import { ExploreButtonSkeleton } from '@/src/features/explore-collection/ui/ExploreButtonSkeleton';
import { SocialShare } from '@/src/features/social-share';
import { getBreadcrumbSchema } from '@/src/shared/lib/schema/breadcrumb';
import { DataSchema } from '@/src/shared/ui/DataSchema';
import { OwnerEmptyStateFallback } from './_components/OwnerEmptyStateFallback';
import { getPublicPageData, type CollectionPageData } from './actions';
import { CollectionAuthLoader } from './_components/CollectionAuthLoader';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ username: string; collectionSlug: string; locale: string }>;
};

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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  // Metadata uses the cached public query — no connection() needed here.
  const { getPublicCollectionBySlug } = await import('@/lib/collections');
  const result = await getPublicCollectionBySlug(username, collectionSlug);
  if (!result) return {};

  const { collection } = result;
  const firstImage = await getCollectionFirstImage(collection.id);
  const ogImage = (firstImage ? getCloudinaryUrl(firstImage, 1200) : undefined) ?? `${baseUrl}/logo.png`;
  const descriptionPrefix = collection.description ? ` — ${collection.description}` : '';

  return {
    title: t('title', { collectionName: collection.name, username }),
    description: t('description', { collectionName: collection.name, description: descriptionPrefix, username }),
    alternates: { canonical: `${baseUrl}/${username}/${collectionSlug}` },
    openGraph: {
      title: t('title', { collectionName: collection.name, username }),
      description: t('description', { collectionName: collection.name, description: descriptionPrefix, username }),
      url: `${baseUrl}/${username}/${collectionSlug}`,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: collection.name }],
    },
  };
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

async function BreadcrumbNav({ pageData }: { pageData: CollectionPageData }) {
  const { username, collection } = pageData;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: `@${username}`, url: `${baseUrl}/${username}` },
    { name: collection.name, url: `${baseUrl}/${username}/${collection.slug}` },
  ]);

  return (
    <>
      <DataSchema schema={breadcrumbSchema} id="breadcrumb-schema" />
      <Breadcrumb
        className={styles.breadcrumb}
        items={[
          { label: `@${username}`, href: `/${username}` },
          { label: collection.name },
        ]}
      />
    </>
  );
}

// ─── Item grid (non-owner, SSR) ───────────────────────────────────────────────

async function PublicItemGrid({
  pageData,
}: {
  pageData: CollectionPageData;
}) {
  const t = await getTranslations('Common');
  const { username, collection, items } = pageData;

  if (items.length === 0) {
    return (
      <>
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{t('no_items_in_collection')}</p>
          <p className={styles.emptyDesc}>{t('items_will_appear_here')}</p>
        </div>
        <OwnerEmptyStateFallback />
      </>
    );
  }

  return (
    <>
      {items.map(item => (
        <div key={item.id} className={styles.itemCardWrapper}>
          <Link href={`/${username}/${collection.slug}/${item.slug}`} className={styles.itemCard}>
            <div className={styles.itemImage}>
              {item.image_url
                ? (
                    <ViewTransition name={`item-image-${item.slug}`}>
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        strategy="cloudinary"
                        sizes="(max-width: 420px) 100vw, (max-width: 720px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </ViewTransition>
                  )
                : <div className={styles.itemImagePlaceholder}>📦</div>}
            </div>
            <p className={styles.itemName}>{item.name}</p>
            {item.lines?.name && <p className={styles.itemLine}>{item.lines.name}</p>}
            {item.likes_count > 0 && (
              <span className={styles['item-card__like-count']}>
                {/* TODO(design-system): needs tokens --color-like-gradient-from and --color-like-gradient-to */}
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
          <div className={styles.itemActions}>
            <NonOwnerItemActions item={item} />
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Collection header ────────────────────────────────────────────────────────

async function CollectionHeader({ pageData }: { pageData: CollectionPageData }) {
  const tCol = await getTranslations('Common.profile.collection');
  const { username, collection, items, isPrivate } = pageData;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles['header__name-wrapper']}>
          <h1 className={styles.collectionName}>{collection.name}</h1>
          {!isPrivate && (
            <SocialShare
              title={tCol('share', { collectionName: collection.name, username })}
              baseUrl={`${baseUrl}/${username}/${collection.slug}`}
              entityType="collection"
            />
          )}
        </div>
        {collection.description && (
          <p className={styles.collectionDesc}>{collection.description}</p>
        )}
        <p className={styles.collectionMeta}>
          {tCol('items_count', { count: items.length })}
        </p>
        <div className={styles.exploreWrapper}>
          <Suspense fallback={<ExploreButtonSkeleton />}>
            <ExploreButton />
          </Suspense>
        </div>
      </div>
      <div className={styles.ownerActions}>
        <OwnerCollectionActionsClient />
      </div>
    </header>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CollectionPage({ params }: Properties) {
  const { username, collectionSlug } = await params;

  const pageData = await getPublicPageData(username, collectionSlug);
  if (!pageData) notFound();

  const { collection, items, collectionUserId } = pageData;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  const schema = generateCollectionListingSchema({ collection, username, items, baseUrl });

  return (
    <CollectionItemsProvider pageData={pageData}>
      {schema && <DataSchema schema={schema} />}
      <div className={`container ${styles.page}`}>
        <BreadcrumbNav pageData={pageData} />
        <CollectionHeader pageData={pageData} />

        {/*
          Public grid — fully rendered in initial HTML, visible to crawlers.
          Owner grid streams in via Suspense and overlays via CSS :has().
        */}
        <div className={styles.grid}>
          <PublicItemGrid pageData={pageData} />
        </div>

        <div className={styles.ownerGrid}>
          <Suspense fallback={null}>
            <CollectionAuthLoader
              username={username}
              collectionSlug={collectionSlug}
              collectionId={collection.id}
              collectionUserId={collectionUserId}
            />
          </Suspense>
          <OwnerItemGrid />
        </div>
      </div>
    </CollectionItemsProvider>
  );
}
