import type { Metadata } from 'next';
import type React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getPublicCollectionBySlug, getPublicItemBySlug, getLinkedStores, type PublicItemDetail, type LinkedStore } from '@/lib/collections';
import { DataSchema } from '@/src/shared/ui/DataSchema';
import { generateCollectionItemSchema } from '@/lib/seo';
import { getBreadcrumbSchema } from '@/src/shared/lib/schema/breadcrumb';
import { OwnerItemActions } from '@/src/features/owner-item-actions';
import { OwnerImageSection } from './_components/OwnerImageSection';
import { LikeSection } from './_components/LikeSection';
import { LikeButtonSkeleton } from './_components/LikeButtonSkeleton';
import { SocialShare } from '@/src/features/social-share';
import { IHaveThisButton } from '@/src/features/copy-item';
import { WhereToFindButton } from '@/src/features/where-to-find';
import { WhereToBuy } from '@/src/features/where-to-buy';
import styles from './page.module.css';
import { createClient } from '@/lib/supabase/server';

type Properties = {
  params: Promise<{ username: string; collectionSlug: string; slug: string }>;
};

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { username, collectionSlug, slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  const collectionResult = await getPublicCollectionBySlug(username, collectionSlug);
  if (!collectionResult) return {};

  const item = await getPublicItemBySlug(collectionResult.collection.id, slug, username, collectionSlug);
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

function resolveVariantLabel(item: PublicItemDetail): string | undefined {
  if (!item.variant) return undefined;
  const match = item.lines?.variants?.find(v => v.value === item.variant);
  return match?.display_name ?? item.variant;
}

function ItemMetaDetails({ item }: { item: PublicItemDetail }) {
  const brand = item.lines?.brands?.name;
  const line = item.lines?.name;
  const category = item.lines?.categories?.name;
  const franchise = item.franchises;
  const variantLabel = resolveVariantLabel(item);

  type MetaRow = { label: string; value: React.ReactNode };
  const rowCandidates: Array<MetaRow | undefined> = [
    brand ? { label: 'Brand', value: brand } : undefined,
    line ? { label: 'Line', value: line } : undefined,
    variantLabel ? { label: 'Variant', value: variantLabel } : undefined,
    category ? { label: 'Category', value: category } : undefined,
    franchise
      ? {
          label: 'Franchise',
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

function ItemMeta({
  item,
  username,
  collectionSlug,
  linkedStores,
  catalogStores,
}: {
  item: PublicItemDetail;
  username: string;
  collectionSlug: string;
  linkedStores: LinkedStore[];
  catalogStores: CatalogStore[];
}) {
  const showWhereToFind = linkedStores.length > 0;
  const isPublic = item.visibility === 'public';

  return (
    <div className={styles['item-page__details']}>
      <ItemTags item={item} />

      <div className={styles['item-page__name-row']}>
        <h1 className={styles['item-page__name']}>{item.name}</h1>
        <div className={styles['item-page__actions']}>
          <SocialShare
            title={`${item.name} from ${collectionSlug} by ${username} on Collectstory`}
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
          Acquired
          {' '}
          {new Date(item.date_acquired).toLocaleDateString('en-US', {
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
  params,
}: {
  params: Promise<{ username: string; collectionSlug: string; slug: string }>;
}) {
  const { username, collectionSlug, slug } = await params;

  const collectionResult = await getPublicCollectionBySlug(username, collectionSlug);
  if (!collectionResult) notFound();

  const item = await getPublicItemBySlug(collectionResult.collection.id, slug, username, collectionSlug);
  if (!item) notFound();

  // Linked stores are public — fetched via cached query for all visitors.
  const linkedStores = await getLinkedStores(item.id);
  // Catalog-driven stores — fetched via catalog_item_id if the item is linked to a catalog item.
  const supabase = await createClient();
  const catalogItemId = item.catalog_item_id;

  const catalogStoreRows = await (catalogItemId
    ? supabase
        .from('catalog_item_stores')
        .select('stores ( id, name, city, country, url )')
        .eq('catalog_item_id', catalogItemId)
    : Promise.resolve({ data: [] }));

  const catalogStores: CatalogStore[] = (catalogStoreRows.data ?? []).flatMap((row: unknown) => {
    const s = (row as { stores: { id: string; name: string; city: string | null; country: string | null; url: string | null } | null }).stores;
    if (!s) return [];
    return [{ id: s.id, name: s.name, city: s.city, country: s.country, url: s.url }];
  });

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
      {/* OwnerImageSection is a dynamic Server Component in <Suspense> — streams
          in the image section with the correct isOwner value without blocking
          the cached static shell. */}
      <Suspense fallback={<div className={styles.imageSection} />}>
        <OwnerImageSection
          itemId={item.id}
          slug={slug}
          userId={item.user_id}
          imageUrl={item.image_url}
          name={item.name}
          username={username}
          collectionSlug={collectionSlug}
        />
      </Suspense>
      <ItemMeta
        item={item}
        username={username}
        collectionSlug={collectionSlug}
        linkedStores={linkedStores}
        catalogStores={catalogStores}
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
      <nav className={styles['item-page__breadcrumb']} aria-label="Breadcrumb">
        <Link href={`/${username}`} className={styles['item-page__breadcrumb-link']}>
          @
          {username}
        </Link>
        <span className={styles['item-page__breadcrumb-sep']} aria-hidden="true">/</span>
        <Link href={`/${username}/${collectionSlug}`} className={styles['item-page__breadcrumb-link']}>
          {collectionName}
        </Link>
        <span className={styles['item-page__breadcrumb-sep']} aria-hidden="true">/</span>
        <span>{itemName}</span>
      </nav>
    </>
  );
}

export default function ItemDetailPage({ params }: Properties) {
  return (
    <div className={styles['item-page']}>
      <BreadcrumbNav params={params} />
      <ItemDetail params={params} />
    </div>
  );
}
