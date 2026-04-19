import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@dezkareid/components/react-server';
import { routing } from '@/app/i18n/routing';
import { getCollectionFirstImage } from '@/lib/collections';
import { getCloudinaryUrl } from '@/lib/image/cloudinary';
import { generateCollectionListingSchema } from '@/lib/seo';
import { OwnerCollectionActionsClient } from '@/src/features/owner-collection-actions';
import { CollectionItemsProvider, OwnerItemGrid } from '@/src/features/owner-item-actions';
import { ExploreButton } from '@/src/features/explore-collection/ui/ExploreButton';
import { ExploreButtonSkeleton } from '@/src/features/explore-collection/ui/ExploreButtonSkeleton';
import { InfiniteItemGrid } from '@/src/features/collection-items-infinite';
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

  const { getPublicCollectionBySlug } = await import('@/lib/collections');
  const result = await getPublicCollectionBySlug(username, collectionSlug);
  if (!result) return {};

  const { collection } = result;
  const firstImage = await getCollectionFirstImage(collection.id);
  const ogImage = (firstImage ? getCloudinaryUrl(firstImage, 1200) : undefined) ?? `${baseUrl}/logo.png`;
  const descriptionPrefix = collection.description ? ` — ${collection.description}` : '';
  const canonicalUrl = `${baseUrl}/${username}/${collectionSlug}`;

  return {
    title: t('title', { collectionName: collection.name, username }),
    description: t('description', { collectionName: collection.name, description: descriptionPrefix, username }),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: t('title', { collectionName: collection.name, username }),
      description: t('description', { collectionName: collection.name, description: descriptionPrefix, username }),
      url: canonicalUrl,
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
        className={styles['collection-page__breadcrumb']}
        items={[
          { label: `@${username}`, href: `/${username}` },
          { label: collection.name },
        ]}
      />
    </>
  );
}

// ─── Item grid (first page SSR + client infinite scroll) ─────────────────────

async function PublicItemGrid({ pageData }: { pageData: CollectionPageData }) {
  const t = await getTranslations('Common');
  const { username, collection, items, total_count } = pageData;

  if (items.length === 0) {
    return (
      <>
        <div className={styles['collection-page__empty']}>
          <p className={styles['collection-page__empty-title']}>{t('no_items_in_collection')}</p>
          <p className={styles['collection-page__empty-desc']}>{t('items_will_appear_here')}</p>
        </div>
        <OwnerEmptyStateFallback />
      </>
    );
  }

  return (
    <InfiniteItemGrid
      initialItems={items}
      totalCount={total_count}
      collectionId={collection.id}
      username={username}
      collectionSlug={collection.slug}
      gridClassName={styles['collection-page__grid']}
      itemCardWrapperClassName={styles['item-card']}
      itemCardClassName={styles['item-card__link']}
      itemImageClassName={styles['item-card__image']}
      itemImagePlaceholderClassName={styles['item-card__image-placeholder']}
      itemNameClassName={styles['item-card__name']}
      itemLineClassName={styles['item-card__line']}
      itemActionsClassName={styles['item-card__actions']}
      likeCountClassName={styles['item-card__like-count']}
    />
  );
}

// ─── Collection header ────────────────────────────────────────────────────────

async function CollectionHeader({ pageData }: { pageData: CollectionPageData }) {
  const tCol = await getTranslations('Common.profile.collection');
  const { username, collection, total_count, isPrivate } = pageData;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  return (
    <header className={styles['collection-page__header']}>
      <div className={styles['collection-page__header-left']}>
        <div className={styles['collection-page__name-row']}>
          <h1 className={styles['collection-page__name']}>{collection.name}</h1>
          {!isPrivate && (
            <SocialShare
              title={tCol('share', { collectionName: collection.name, username })}
              baseUrl={`${baseUrl}/${username}/${collection.slug}`}
              entityType="collection"
            />
          )}
        </div>
        {collection.description && (
          <p className={styles['collection-page__desc']}>{collection.description}</p>
        )}
        <p className={styles['collection-page__meta']}>
          {tCol('items_count', { count: total_count })}
        </p>
        <div className={styles['collection-page__explore']}>
          <Suspense fallback={<ExploreButtonSkeleton />}>
            <ExploreButton />
          </Suspense>
        </div>
      </div>
      <div className={styles['collection-page__owner-actions']}>
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
      <div className={`container ${styles['collection-page']}`}>
        <BreadcrumbNav pageData={pageData} />
        <CollectionHeader pageData={pageData} />

        {/*
          Owner grid streams in first so the sibling ~ selector can hide the
          public grid the moment it resolves, eliminating the layout jump.
          Public grid is SSR-rendered below as the visitor/SEO fallback.
        */}
        <div className={styles['collection-page__owner-grid']}>
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

        <PublicItemGrid pageData={pageData} />
      </div>
    </CollectionItemsProvider>
  );
}
