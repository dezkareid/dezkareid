import type { Metadata } from 'next';
import type React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Suspense,
} from 'react';
import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@dezkareid/components/react-server';
import { routing } from '@/app/i18n/routing';
import {
  getPublicCollectionBySlug,
  getPublicItemBySlug,
  getOwnerCollectionBySlug,
  getOwnerItemBySlug,
  type PublicItemDetail,
} from '@/lib/collections';
import { DataSchema } from '@/src/shared/ui/DataSchema';
import { generateCollectionItemSchema } from '@/lib/seo';
import { getBreadcrumbSchema } from '@/src/shared/lib/schema/breadcrumb';
import { OwnerItemEditActions } from '@/src/features/owner-item-actions/ui/OwnerItemEditActions';
import { ItemImageSection } from './ItemImageSection';
import { OwnerImageSection } from './_components/OwnerImageSection';
import { LikeSection } from './_components/LikeSection';
import { LikeButtonSkeleton } from './_components/LikeButtonSkeleton';
import { SocialShare } from '@/src/features/social-share';
import { IHaveThisButton } from '@/src/features/copy-item';
import { BuyButtonSuspense } from '@/src/features/where-to-buy';
import { CopyToCatalogButton } from '@/src/features/copy-to-catalog';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ username: string; collectionSlug: string; slug: string; locale: string }>;
};

// Item pages are rendered on-demand — slugs are not known at build time.
export function generateStaticParams() {
  const { locales } = routing;
  return locales.map(locale => ({
    username: '_placeholder',
    collectionSlug: '_placeholder',
    slug: '_placeholder',
    locale,
  }));
}

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const resolvedParameters = await params;
  const { username, collectionSlug, slug } = resolvedParameters;
  const t = await getTranslations('Common.profile.collection.metadata');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  const { getPublicCollectionBySlug, getPublicItemBySlug, getCollectionFirstImage } = await import('@/lib/collections');
  const result = await getPublicCollectionBySlug(username, collectionSlug);
  if (!result) return {};

  const { collection } = result;

  const item = await getPublicItemBySlug(
    collection.id,
    slug,
    username,
    collectionSlug,
  );

  if (!item) return {};

  const cloudinaryModule = await import('@/lib/image/cloudinary');
  // Prioritize item image, fallback to collection first image, then logo.
  const imageSource = item.image_url || await getCollectionFirstImage(collection.id);
  const ogImage = (imageSource ? (cloudinaryModule.getCloudinaryUrl(imageSource, 1200) ?? imageSource) : undefined) ?? `${baseUrl}/logo.png`;

  const descriptionPrefix = collection.description ? ` — ${collection.description}` : '';
  const canonicalUrl = `${baseUrl}/${username}/${collectionSlug}/${slug}`;

  return {
    title: `${item.name} — ${collection.name} — Collectstory`,
    description: item.description ?? t('description', { collectionName: collection.name, description: descriptionPrefix, username }),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${item.name} — Collectstory`,
      description: item.description ?? t('description', { collectionName: collection.name, description: descriptionPrefix, username }),
      url: canonicalUrl,
      type: 'article',
      images: [{ url: ogImage, width: 1200, height: 630, alt: item.name }],
    },
  };
}

// ─── Components ──────────────────────────────────────────────────────────────

function ItemTags({ item }: { item: PublicItemDetail }) {
  const franchise = Array.isArray(item.franchises) ? item.franchises[0] : item.franchises;
  return (
    <div className={styles['item-page__tags']}>
      {item.lines?.name && (
        <span className={styles['item-page__tag']}>
          {item.lines.name}
        </span>
      )}
      {item.variant && (
        <span className={styles['item-page__tag--secondary']}>
          {item.variant}
        </span>
      )}
      {franchise && (
        <Link href={`/franchises/${franchise.slug}`} className={styles['item-page__tag--franchise']}>
          {franchise.name}
        </Link>
      )}
    </div>
  );
}

async function ItemMetaDetails({ item }: { item: PublicItemDetail }) {
  const t = await getTranslations('Common.profile.item.meta');
  return (
    <dl className={styles['item-page__meta']}>
      {item.lines?.brands?.name && (
        <div className={styles['item-page__meta-row']}>
          <dt className={styles['item-page__meta-label']}>{t('brand')}</dt>
          <dd className={styles['item-page__meta-value']}>{item.lines.brands.name}</dd>
        </div>
      )}
      {item.lines?.categories?.name && (
        <div className={styles['item-page__meta-row']}>
          <dt className={styles['item-page__meta-label']}>{t('category')}</dt>
          <dd className={styles['item-page__meta-value']}>{item.lines.categories.name}</dd>
        </div>
      )}
    </dl>
  );
}

async function ItemMeta({
  item,
  username,
  collectionSlug,
  locale,
}: {
  item: PublicItemDetail;
  username: string;
  collectionSlug: string;
  locale: string;
}) {
  const t = await getTranslations('Common.profile.item');
  const isPublic = item.visibility === 'public';

  return (
    <div className={styles['item-page__details']}>
      <ItemTags item={item} />

      <div className={styles['item-page__name-row']}>
        <h1 className={styles['item-page__name']}>{item.name}</h1>
        <div className={styles['item-page__actions']}>
          <SocialShare
            title={t('share', { itemName: item.name, collectionSlug, username })}
            baseUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${username}/${collectionSlug}/${item.slug}`}
            entityType="item"
          />
        </div>
      </div>

      <Suspense fallback={<LikeButtonSkeleton count={item.likes_count} />}>
        <LikeSection
          itemId={item.id}
          likesCount={item.likes_count}
          isPublic={isPublic}
        />
      </Suspense>

      <ItemMetaDetails item={item} />

      {item.description && (
        <p className={styles['item-page__description']}>{item.description}</p>
      )}

      {item.catalog_item_id && (
        <div className={styles['item-page__buy-button']}>
          <BuyButtonSuspense catalogItemId={item.catalog_item_id} locale={locale} />
        </div>
      )}

      <IHaveThisButton item={item} />

      {item.date_acquired && (
        <time className={styles['item-page__date']} dateTime={item.date_acquired}>
          {t('status.acquired')}
          {' '}
          {new Date(item.date_acquired).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      )}

      {/* Owner-only: edit button — dynamic server component, streams in via Suspense */}
      <Suspense fallback={undefined}>
        <OwnerItemEditActions
          username={username}
          collectionSlug={collectionSlug}
          itemId={item.id}
          userId={item.user_id}
        />
      </Suspense>

      {/* Admin-only: copy to catalog — dynamic server component, streams in via Suspense */}
      <Suspense fallback={undefined}>
        <CopyToCatalogButton
          itemId={item.id}
          catalogItemId={item.catalog_item_id}
        />
      </Suspense>
    </div>
  );
}

// ─── Public (static/cached) item content ─────────────────────────────────────

async function ItemContent({
  username,
  collectionSlug,
  slug,
  locale,
}: {
  username: string;
  collectionSlug: string;
  slug: string;
  locale: string;
}) {
  // Pure cached path — no dynamic data, no cookies.
  const collectionResult = await getPublicCollectionBySlug(username, collectionSlug);
  if (!collectionResult) return; // Private or missing — OwnerPrivateItemGuard handles it.

  const item = await getPublicItemBySlug(
    collectionResult.collection.id,
    slug,
    username,
    collectionSlug,
  );
  if (!item) return; // Private item — OwnerPrivateItemGuard handles it.

  return <ItemDetail item={item} username={username} collectionSlug={collectionSlug} locale={locale} isPrivate={false} />;
}

// ─── Dynamic guard — handles private collections/items and true 404s ──────────
// Always runs inside <Suspense> so connection() never blocks the static path.
// Short-circuits immediately when the public path already resolved the item.

async function OwnerPrivateItemGuard({
  username,
  collectionSlug,
  slug,
  locale,
}: {
  username: string;
  collectionSlug: string;
  slug: string;
  locale: string;
}) {
  // Re-use cached public queries — free via 'use cache' dedup.
  const publicCollectionResult = await getPublicCollectionBySlug(username, collectionSlug);

  if (publicCollectionResult) {
    // Collection is public — check if item itself is private.
    const publicItem = await getPublicItemBySlug(
      publicCollectionResult.collection.id,
      slug,
      username,
      collectionSlug,
    );
    if (publicItem) return; // Already rendered by ItemContent — nothing to do.

    // Private item in a public collection — try owner query.
    // getOwnerItemBySlug calls connection() — safe here inside <Suspense>.
    const ownerItem = await getOwnerItemBySlug(publicCollectionResult.collection.id, slug);
    if (!ownerItem) notFound();
    return <ItemDetail item={ownerItem} username={username} collectionSlug={collectionSlug} locale={locale} isPrivate={true} />;
  }

  // Private collection — resolve via owner query.
  // getOwnerCollectionBySlug calls connection() — safe here inside <Suspense>.
  const ownerCollectionResult = await getOwnerCollectionBySlug(username, collectionSlug);
  if (!ownerCollectionResult) notFound();

  const publicItem = await getPublicItemBySlug(
    ownerCollectionResult.collection.id,
    slug,
    username,
    collectionSlug,
  );
  const item = publicItem ?? await getOwnerItemBySlug(ownerCollectionResult.collection.id, slug);
  if (!item) notFound();

  return <ItemDetail item={item} username={username} collectionSlug={collectionSlug} locale={locale} isPrivate={item.visibility !== 'public'} />;
}

// ─── Shared item body renderer ────────────────────────────────────────────────

async function ItemDetail({
  item,
  username,
  collectionSlug,
  locale,
  isPrivate,
}: {
  item: PublicItemDetail;
  username: string;
  collectionSlug: string;
  locale: string;
  isPrivate: boolean;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  // Structured data is only emitted for public items to avoid indexing private content.
  const schema = isPrivate
    ? undefined
    : generateCollectionItemSchema({
        item,
        username,
        collectionSlug,
        baseUrl,
      });

  return (
    <div className={styles['item-page__layout']}>
      {schema && <DataSchema schema={schema} />}
      <ItemImageSection
        key={item.image_url}
        slug={item.slug}
        imageUrl={item.image_url}
        name={item.name}
      >
        <Suspense fallback={undefined}>
          <OwnerImageSection
            itemId={item.id}
            userId={item.user_id}
            username={username}
            collectionSlug={collectionSlug}
            imageUrl={item.image_url}
          />
        </Suspense>
      </ItemImageSection>

      <ItemMeta
        item={item}
        username={username}
        collectionSlug={collectionSlug}
        locale={locale}
      />
    </div>
  );
}

async function BreadcrumbNav({
  username,
  collectionSlug,
  slug,
}: {
  username: string;
  collectionSlug: string;
  slug: string;
}) {
  const collectionResult = await getPublicCollectionBySlug(username, collectionSlug);
  const collectionName = collectionResult?.collection.name ?? '...';
  const item = await getPublicItemBySlug(
    collectionResult?.collection.id ?? '',
    slug,
    username,
    collectionSlug,
  );
  const itemName = item?.name ?? '...';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: `@${username}`, url: `${baseUrl}/${username}` },
    { name: collectionName, url: `${baseUrl}/${username}/${collectionSlug}` },
    { name: itemName, url: `${baseUrl}/${username}/${collectionSlug}/${slug}` },
  ]);

  return (
    <>
      <DataSchema schema={breadcrumbSchema} id="breadcrumb-schema" />
      <Breadcrumb
        className={styles['item-page__breadcrumb']}
        items={[
          { label: `@${username}`, href: `/${username}` },
          { label: collectionName, href: `/${username}/${collectionSlug}` },
          { label: itemName },
        ]}
      />
    </>
  );
}

export default async function ItemPage({ params }: Properties) {
  const { username, collectionSlug, slug, locale } = await params;

  return (
    <div className={styles['item-page']}>
      <Suspense fallback={undefined}>
        <BreadcrumbNav username={username} collectionSlug={collectionSlug} slug={slug} />
      </Suspense>

      <Suspense fallback={undefined}>
        <ItemContent
          username={username}
          collectionSlug={collectionSlug}
          slug={slug}
          locale={locale}
        />
      </Suspense>

      {/* Dynamic portion: handles private visibility and 404s */}
      <Suspense fallback={undefined}>
        <OwnerPrivateItemGuard
          username={username}
          collectionSlug={collectionSlug}
          slug={slug}
          locale={locale}
        />
      </Suspense>
    </div>
  );
}
