import type { Metadata } from 'next';
import type React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  use,
  Suspense,
} from 'react';
import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@dezkareid/components/react-server';
import { routing } from '@/app/i18n/routing';
import {
  getPublicCollectionBySlug,
  getPublicItemBySlug,
  getLinkedStores,
  type PublicItemDetail,
  type LinkedStore,
} from '@/lib/collections';
import { DataSchema } from '@/src/shared/ui/DataSchema';
import { generateCollectionItemSchema } from '@/lib/seo';
import { getBreadcrumbSchema } from '@/src/shared/lib/schema/breadcrumb';
import { OwnerItemActions } from '@/src/features/owner-item-actions';
import { ItemImageSection } from './ItemImageSection';
import { OwnerImageSection } from './_components/OwnerImageSection';
import { LikeSection } from './_components/LikeSection';
import { LikeButtonSkeleton } from './_components/LikeButtonSkeleton';
import { createAdminClient } from '@/lib/supabase/admin';
import { SocialShare } from '@/src/features/social-share';
import { IHaveThisButton } from '@/src/features/copy-item';
import { WhereToFindButton } from '@/src/features/where-to-find';
import { WhereToBuy } from '@/src/features/where-to-buy';
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
  const { username, collectionSlug, slug } = await params;
  const t = await getTranslations('Common.profile.item.metadata');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  const collectionResult = await getPublicCollectionBySlug(username, collectionSlug);
  if (!collectionResult) return {};

  const item = await getPublicItemBySlug(collectionResult.collection.id, slug, username, collectionSlug);
  if (!item) return {};

  const brand = item.lines?.brands?.name;
  const line = item.lines?.name;
  const collectionName = collectionResult.collection.name;

  const description = item.description
    ?? (brand && line
      ? t('description', { itemName: item.name, line, brand, username, collectionName })
      : t('description_fallback', { itemName: item.name, username, collectionName }));

  return {
    title: t('title', { itemName: item.name, collectionName, username }),
    description,
    alternates: { canonical: `${baseUrl}/${username}/${collectionSlug}/${slug}` },
    openGraph: {
      title: t('title', { itemName: item.name, collectionName, username }),
      description,
      url: `${baseUrl}/${username}/${collectionSlug}/${slug}`,
      images: item.image_url ? [{ url: item.image_url }] : [],
      type: 'website',
    },
  };
}

function resolveVariantLabel(item: PublicItemDetail): string | undefined {
  if (!item.variant) return undefined;
  const match = item.lines?.variants?.find(v => v.value === item.variant);
  return match?.display_name ?? item.variant;
}

async function ItemMetaDetails({ item }: { item: PublicItemDetail }) {
  const t = await getTranslations('Common.profile.item.meta');
  const brand = item.lines?.brands?.name;
  const line = item.lines?.name;
  const category = item.lines?.categories?.name;
  const franchise = item.franchises;
  const variantLabel = resolveVariantLabel(item);

  type MetaRow = { label: string; value: React.ReactNode };
  const rowCandidates: Array<MetaRow | undefined> = [
    brand ? { label: t('brand'), value: brand } : undefined,
    line ? { label: t('line'), value: line } : undefined,
    variantLabel ? { label: t('variant'), value: variantLabel } : undefined,
    category ? { label: t('category'), value: category } : undefined,
    franchise
      ? {
        label: t('franchise'),
        value: (
          <Link href={`/franchises/${franchise.slug}`} className={styles['item-page__meta-link']}>
            {franchise.name}
          </Link>
        ),
      }
      : undefined,
  ];
  const rows = rowCandidates.filter((row): row is MetaRow => row !== undefined);

  if (rows.length === 0) return;

  return (
    <dl className={styles['item-page__meta']}>
      {rows.map(({ label, value }) => (
        <div key={label} className={styles['item-page__meta-row']}>
          <dt className={styles['item-page__meta-label']}>{label}</dt>
          <dd className={styles['item-page__meta-value']}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ItemTags({ item }: { item: PublicItemDetail }) {
  const brand = item.lines?.brands?.name;
  const line = item.lines?.name;
  const category = item.lines?.categories?.name;
  const franchise = item.franchises;
  const variantLabel = resolveVariantLabel(item);

  return (
    <div className={styles['item-page__tags']}>
      {brand && <span className={styles['item-page__tag']}>{brand}</span>}
      {line && <span className={styles['item-page__tag--secondary']}>{line}</span>}
      {variantLabel && <span className={styles['item-page__tag--secondary']}>{variantLabel}</span>}
      {category && <span className={styles['item-page__tag--secondary']}>{category}</span>}
      {franchise && (
        <Link href={`/franchises/${franchise.slug}`} className={styles['item-page__tag--franchise']}>
          {franchise.name}
        </Link>
      )}
    </div>
  );
}

interface CatalogStore {
  id: string;
  name: string;
  city: string | null;
  country: string | null;
  url: string | null;
}

async function getCatalogStoresForItem(catalogItemId: string): Promise<CatalogStore[]> {
  'use cache';
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('catalog_item_stores')
    .select('stores ( id, name, city, country, url )')
    .eq('catalog_item_id', catalogItemId);
  return (data ?? []).flatMap((row: unknown) => {
    const s = (row as { stores: CatalogStore | null }).stores;
    return s ? [s] : [];
  });
}

async function ItemMeta({
  item,
  username,
  collectionSlug,
  linkedStores,
  catalogStores,
  locale,
}: {
  item: PublicItemDetail;
  username: string;
  collectionSlug: string;
  linkedStores: LinkedStore[];
  catalogStores: CatalogStore[];
  locale: string;
}) {
  const t = await getTranslations('Common.profile.item');
  const showWhereToFind = linkedStores.length > 0;
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

      {showWhereToFind && (
        <WhereToFindButton
          itemId={item.id}
          isOwner={false}
          linkedStores={linkedStores}
          initialLinks={[]}
        />
      )}

      <WhereToBuy stores={catalogStores} />

      {/* Owner-only: edit button — dynamic server component, streams in via Suspense */}
      <Suspense fallback={undefined}>
        <OwnerItemActions
          username={username}
          collectionSlug={collectionSlug}
          itemId={item.id}
          userId={item.user_id}
        />
      </Suspense>
    </div>
  );
}

async function ItemDetail({
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
  const collectionResult = await getPublicCollectionBySlug(username, collectionSlug);

  if (!collectionResult) notFound();

  const item = await getPublicItemBySlug(collectionResult.collection.id, slug, username, collectionSlug);
  if (!item) notFound();

  // Linked stores are public — fetched via cached query for all visitors.
  const linkedStores = await getLinkedStores(item.id);
  // Catalog-driven stores — public data, use admin client (no cookies) so this
  // fetch is treated as cached by cacheComponents.
  const catalogItemId = item.catalog_item_id;

  const catalogStores = await (catalogItemId
    ? getCatalogStoresForItem(catalogItemId)
    : Promise.resolve([]));

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const schema = generateCollectionItemSchema({
    item,
    username,
    collectionSlug,
    baseUrl,
  });

  return (
    <div className={styles['item-page__layout']}>
      <DataSchema schema={schema} />
      {/* ItemImageSection renders the image immediately. It receives
          OwnerImageSection (a Suspense-wrapped Server Component) as a child
          to preserve the server-to-client boundary. */}
      <ItemImageSection
        key={item.image_url}
        slug={slug}
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
        linkedStores={linkedStores}
        catalogStores={catalogStores}
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  const collectionResult = await getPublicCollectionBySlug(username, collectionSlug);
  const collectionName = collectionResult?.collection.name ?? collectionSlug;

  const item = collectionResult
    ? await getPublicItemBySlug(collectionResult.collection.id, slug, username, collectionSlug)
    : undefined;
  const itemName = item?.name ?? slug;

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

export default function ItemDetailPage({ params }: Properties) {
  const { username, collectionSlug, slug, locale } = use(params);
  return (
    <div className={styles['item-page']}>
      <BreadcrumbNav username={username} collectionSlug={collectionSlug} slug={slug} />
      <ItemDetail username={username} collectionSlug={collectionSlug} slug={slug} locale={locale} />
    </div>
  );
}
