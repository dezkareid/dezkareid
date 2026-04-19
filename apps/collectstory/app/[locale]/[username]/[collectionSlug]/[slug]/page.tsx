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
  getOwnerCollectionBySlug,
  getOwnerItemBySlug,
  getLinkedStores,
  type PublicItemDetail,
  type LinkedStore,
} from '@/lib/collections';
import { DataSchema } from '@/src/shared/ui/DataSchema';
import { generateCollectionItemSchema } from '@/lib/seo';
import { getBreadcrumbSchema } from '@/src/shared/lib/schema/breadcrumb';
import { OwnerItemEditActions } from '@/src/features/owner-item-actions/ui/OwnerItemEditActions';
import { ItemImageSection } from './ItemImageSection';
import { OwnerImageSection } from './_components/OwnerImageSection';
import { LikeSection } from './_components/LikeSection';
import { LikeButtonSkeleton } from './_components/LikeButtonSkeleton';
import { createClient } from '@/lib/supabase/server';
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

  // Intentionally uses public-only queries: private collections/items return {} here,
  // producing no OG tags or canonical URL — preventing search engine indexing of private content.
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
  const supabase = await createClient();
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
        <OwnerItemEditActions
          username={username}
          collectionSlug={collectionSlug}
          itemId={item.id}
          userId={item.user_id}
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
  const [linkedStores, catalogStores] = await Promise.all([
    getLinkedStores(item.id),
    item.catalog_item_id
      ? getCatalogStoresForItem(item.catalog_item_id)
      : Promise.resolve([]),
  ]);

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

  // Pure cached path — use slug as label fallback for private collections/items.
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
      {/*
        BreadcrumbNav and ItemContent use only 'use cache' queries — rendered
        statically in the prerender, visible to search engines in initial HTML.

        OwnerPrivateItemGuard must stay in <Suspense> because it calls connection()
        via getOwnerCollectionBySlug / getOwnerItemBySlug. It short-circuits
        immediately when the public path already resolved the item.
      */}
      <BreadcrumbNav username={username} collectionSlug={collectionSlug} slug={slug} />
      <ItemContent username={username} collectionSlug={collectionSlug} slug={slug} locale={locale} />
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
