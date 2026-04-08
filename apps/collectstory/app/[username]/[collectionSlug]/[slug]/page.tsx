import type { Metadata } from 'next';
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
import { ItemLinksManager } from '@/components/ItemLinksManager/ItemLinksManager';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import type { Store, ItemLink } from '@/app/collection/actions';
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

function WhereToFindSection({
  itemId,
  isOwner,
  linkedStores,
  initialLinks,
}: {
  itemId: string;
  isOwner: boolean;
  linkedStores: Store[];
  initialLinks: ItemLink[];
}) {
  const hasStores = linkedStores.length > 0;
  const hasLinks = initialLinks.length > 0;

  return (
    <section className={styles.storesSection} aria-labelledby="where-to-find-heading">
      <h2 id="where-to-find-heading" className={styles.storesSectionLabel}>
        Where to find it
      </h2>

      {hasStores && (
        <ul className={styles.storeReadList} role="list" aria-label="Stores">
          {linkedStores.map(store => (
            <li key={store.id} className={styles.storeReadItem}>
              {store.name}
              {store.verified && (
                <VerifiedBadge className={styles.verifiedIcon} />
              )}
            </li>
          ))}
        </ul>
      )}

      {isOwner && (
        <>
          {!hasStores && !hasLinks && (
            <p className={styles.emptyPrompt}>
              Add a link to where this item can be found.
            </p>
          )}
          <ItemLinksManager itemId={itemId} initialLinks={initialLinks} />
        </>
      )}
    </section>
  );
}

function resolveVariantLabel(item: PublicItemDetail): string | undefined {
  if (!item.variant) return undefined;
  const match = item.lines?.variants?.find(v => v.value === item.variant);
  return match?.display_name ?? item.variant;
}

function ItemTags({ item }: { item: PublicItemDetail }) {
  const brand = item.lines?.brands?.name;
  const line = item.lines?.name;
  const category = item.lines?.categories?.name;
  const franchise = item.franchises;
  const variantLabel = resolveVariantLabel(item);

  return (
    <div className={styles.tags}>
      {brand && <span className={styles.tag}>{brand}</span>}
      {line && <span className={styles.tagSecondary}>{line}</span>}
      {variantLabel && <span className={styles.tagSecondary}>{variantLabel}</span>}
      {category && <span className={styles.tagSecondary}>{category}</span>}
      {franchise && (
        <Link href={`/franchises/${franchise.slug}`} className={styles.tagFranchise}>
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
  const showWhereToFind = linkedStores.length > 0 || isOwner;

  return (
    <div className={styles.details}>
      <ItemTags item={item} />

      <h1 className={styles.name}>{item.name}</h1>

      {item.description && (
        <p className={styles.description}>{item.description}</p>
      )}

      {item.date_acquired && (
        <time className={styles.date} dateTime={item.date_acquired}>
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
        <WhereToFindSection
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
    <div className={styles.layout}>
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
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <Link href={`/${username}`} className={styles.breadcrumbLink}>
        @
        {username}
      </Link>
      <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
      <Link href={`/${username}/${collectionSlug}`} className={styles.breadcrumbLink}>
        {collectionSlug}
      </Link>
      <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
      <span>{slug}</span>
    </nav>
  );
}

export default function ItemDetailPage({ params }: Properties) {
  return (
    <div className={styles.page}>
      <Suspense>
        <BreadcrumbNav params={params} />
      </Suspense>

      <Suspense>
        <ItemDetail params={params} />
      </Suspense>
    </div>
  );
}
