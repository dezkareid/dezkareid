import type { Metadata } from 'next';
import type React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPublicCollectionBySlug, getPublicItemBySlug, type PublicItemDetail } from '@/lib/collections';
import { DataSchema } from '@/src/shared/ui/DataSchema';
import { getItemSchema } from '@/src/entities/item';
import { ItemImageSection } from './ItemImageSection';
import { ItemActions } from '@/components/username/ItemActions';
import { SocialShare } from '@/src/features/social-share';
import { WhereToFindButton } from '@/src/features/where-to-find';
import type { Store, ItemLink } from '@/app/[username]/[collectionSlug]/actions';
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

function ItemMeta({
  item,
  username,
  collectionSlug,
  isOwner,
  linkedStores,
  initialLinks,
}: {
  item: PublicItemDetail;
  username: string;
  collectionSlug: string;
  isOwner: boolean;
  linkedStores: Store[];
  initialLinks: ItemLink[];
}) {
  const showWhereToFind = linkedStores.length > 0 || initialLinks.length > 0 || isOwner;

  return (
    <div className={styles['item-page__details']}>
      <ItemTags item={item} />

      <div className={styles['item-page__name-row']}>
        <h1 className={styles['item-page__name']}>{item.name}</h1>
        <SocialShare
          title={`${item.name} from ${collectionSlug} by ${username} on Collectstory`}
          baseUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${username}/${collectionSlug}/${item.slug}`}
          entityType="item"
        />
      </div>

      <ItemMetaDetails item={item} />

      {item.description && (
        <p className={styles['item-page__description']}>{item.description}</p>
      )}

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
          isOwner={isOwner}
          linkedStores={linkedStores}
          initialLinks={initialLinks}
        />
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

  const { data: storeRows } = await supabase
    .from('collection_item_stores')
    .select('stores ( id, name, verified, url )')
    .eq('item_id', item.id);

  const linkedStores: Store[] = (storeRows ?? []).flatMap((row) => {
    const s = (row as unknown as { stores: { id: string; name: string; verified: boolean; url: string | null } | null }).stores;
    if (!s) return [];
    return [{ id: s.id, name: s.name, verified: s.verified, url: s.url ?? undefined }];
  });

  let initialLinks: ItemLink[] = [];
  if (isOwner) {
    const { data: linkRows } = await supabase
      .from('item_links')
      .select('id, item_id, url, label, created_at')
      .eq('item_id', item.id)
      .order('created_at');
    initialLinks = (linkRows ?? []).map(l => ({
      id: l.id,
      item_id: l.item_id,
      url: l.url,
      label: (l.label as string | null) ?? undefined,
      created_at: l.created_at,
    }));
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const schema = getItemSchema({
    item,
    username,
    collectionSlug,
    baseUrl,
  });

  return (
    <div className={styles['item-page__layout']}>
      <DataSchema schema={schema} />
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
        linkedStores={linkedStores}
        initialLinks={initialLinks}
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
    <nav className={styles['item-page__breadcrumb']} aria-label="Breadcrumb">
      <Link href={`/${username}`} className={styles['item-page__breadcrumb-link']}>
        @
        {username}
      </Link>
      <span className={styles['item-page__breadcrumb-sep']} aria-hidden="true">/</span>
      <Link href={`/${username}/${collectionSlug}`} className={styles['item-page__breadcrumb-link']}>
        {collectionSlug}
      </Link>
      <span className={styles['item-page__breadcrumb-sep']} aria-hidden="true">/</span>
      <span>{slug}</span>
    </nav>
  );
}

export default function ItemDetailPage({ params }: Properties) {
  return (
    <div className={styles['item-page']}>
      <Suspense>
        <BreadcrumbNav params={params} />
      </Suspense>

      <Suspense>
        <ItemDetail params={params} />
      </Suspense>
    </div>
  );
}
