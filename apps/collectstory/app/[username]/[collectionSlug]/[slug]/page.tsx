import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getPublicCollectionBySlug, getPublicItemBySlug, type PublicItemDetail } from '@/lib/collections';
import { DataSchema } from '@/src/shared/ui/DataSchema';
import { getItemSchema } from '@/src/entities/item';
import { ItemActions } from '@/components/username/ItemActions';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { SocialShare } from '@/src/features/social-share';
import { OwnerItemExtras } from './_components/OwnerItemExtras';
import { OwnerImageSection } from './_components/OwnerImageSection';
import type { Store } from '@/app/[username]/[collectionSlug]/actions';
import styles from './page.module.css';

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

function WhereToFindSection({
  itemId,
  userId,
  linkedStores,
}: {
  itemId: string;
  userId: string;
  linkedStores: Store[];
}) {
  return (
    <section className={styles.storesSection} aria-labelledby="where-to-find-heading">
      <h2 id="where-to-find-heading" className={styles.storesSectionLabel}>
        Where to find it
      </h2>

      {linkedStores.length > 0 && (
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

      {/* Owner-only: ItemLinksManager streams in dynamically — never cached */}
      <Suspense>
        <OwnerItemExtras itemId={itemId} userId={userId} linkedStores={linkedStores} />
      </Suspense>
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
  linkedStores,
}: {
  item: PublicItemDetail;
  username: string;
  collectionSlug: string;
  linkedStores: Store[];
}) {
  // Always show the "Where to find it" section: it renders the public store list
  // and the dynamic owner slot (OwnerItemExtras inside WhereToFindSection).
  return (
    <div className={styles.details}>
      <ItemTags item={item} />

      <div className={styles['details__name-wrapper']}>
        <h1 className={styles.name}>{item.name}</h1>
        <SocialShare
          title={`${item.name} from ${collectionSlug} by ${username} on Collectstory`}
          text={`Check out this collectible: ${item.name}`}
          baseUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${username}/${collectionSlug}/${item.slug}`}
          entityType="item"
        />
      </div>

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

      <WhereToFindSection
        itemId={item.id}
        userId={item.user_id}
        linkedStores={linkedStores}
      />

      {/* Owner-only: edit button — client component, self-detects ownership */}
      <Suspense>
        <ItemActions
          username={username}
          collectionSlug={collectionSlug}
          itemId={item.id}
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

  // Linked stores are public — fetched in the cached shell for all visitors.
  const supabase = await createClient();
  const { data: storeRows } = await supabase
    .from('collection_item_stores')
    .select('stores ( id, name, verified, url )')
    .eq('item_id', item.id);

  const linkedStores: Store[] = (storeRows ?? []).flatMap((row) => {
    const s = (row as unknown as { stores: { id: string; name: string; verified: boolean; url: string | null } | null }).stores;
    if (!s) return [];
    return [{ id: s.id, name: s.name, verified: s.verified, url: s.url ?? undefined }];
  });

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
      {/* OwnerImageSection is a dynamic Server Component in <Suspense> — streams
          in the image section with the correct isOwner value without blocking
          the cached static shell. */}
      <Suspense fallback={<div className={styles.imageSection} />}>
        <OwnerImageSection
          itemId={item.id}
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
