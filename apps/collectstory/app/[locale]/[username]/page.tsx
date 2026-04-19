import type { Metadata } from 'next';
import {
  use,
  Suspense,
} from 'react';
import { getTranslations } from 'next-intl/server';
import {
  getPublicCollectionsByUsername,
} from '@/lib/collections';
import { Image } from '@dezkareid/components/react-server';
import { OwnerProfileActions, OwnerProfileGrid } from '@/src/features/owner-profile-actions';
import { InfiniteCollectionsGrid } from '@/src/features/collections-infinite';
import { SocialShare } from '@/src/features/social-share';
import { routing } from '@/app/i18n/routing';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ username: string; locale: string }>;
};

export function generateStaticParams() {
  const { locales } = routing;
  return locales.map(locale => ({
    username: '_placeholder',
    locale,
  }));
}

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { username } = await params;
  const t = await getTranslations('Common.profile.metadata');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const canonicalUrl = `${baseUrl}/${username}`;

  return {
    title: t('title', { username }),
    description: t('description', { username }),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: t('title', { username }),
      description: t('description', { username }),
      url: canonicalUrl,
      type: 'profile',
    },
  };
}

async function ProfileEmptyState({ username }: { username: string }) {
  const t = await getTranslations('Common');
  return (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>{t('no_public_collections')}</p>
      <p className={styles.emptyDesc}>
        {username}
        {' '}
        {t('has_not_made_public')}
      </p>
    </div>
  );
}

async function ProfileContent({ username }: { username: string }) {
  const result = await getPublicCollectionsByUsername(username);
  if (!result) return null;

  const { collections, total_count } = result;

  if (collections.length === 0) {
    return <ProfileEmptyState username={username} />;
  }

  return (
    <InfiniteCollectionsGrid
      initialCollections={collections}
      totalCount={total_count}
      username={username}
      gridClassName={styles.grid}
      collectionCardClassName={styles.collectionCard}
    />
  );
}

async function ProfileHeader({ username }: { username: string }) {
  const t = await getTranslations('Common.profile');
  const result = await getPublicCollectionsByUsername(username);
  const avatarUrl = result?.avatarUrl;

  return (
    <header className={styles.header}>
      <div className={styles.avatar}>
        {avatarUrl
          ? (
              <Image
                strategy="cloudinary"
                mode="fixed"
                src={avatarUrl}
                alt={username}
                width={72}
                height={72}
                className={styles.avatarImage}
              />
            )
          : (
              <span className={styles.avatarInitial} aria-hidden="true">
                {username[0].toUpperCase()}
              </span>
            )}
      </div>
      <div className={styles.headerText}>
        <div className={styles['header__username-wrapper']}>
          <h1 className={styles.username}>
            @
            {username}
          </h1>
          <SocialShare
            title={t('share', { username })}
            baseUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${username}`}
            entityType="profile"
          />
        </div>
      </div>
      <div className={styles.ownerActions}>
        <Suspense fallback={undefined}>
          <OwnerProfileActions username={username} />
        </Suspense>
      </div>
    </header>
  );
}

export default function UserProfilePage({ params }: Properties) {
  const { username } = use(params);
  const t = use(getTranslations('Common.profile'));

  return (
    <div className={`container ${styles.page}`}>
      <ProfileHeader username={username} />

      <p className={styles.sectionLabel}>{t('collections')}</p>

      {/* Public cached grid — visible to visitors and search engines */}
      <div className={styles.publicGrid}>
        <ProfileContent username={username} />
      </div>

      {/* Owner grid with delete — streams in and hides the public grid via CSS :has() */}
      <Suspense fallback={undefined}>
        <div className={styles.ownerGridWrapper}>
          <OwnerProfileGrid username={username} />
        </div>
      </Suspense>
    </div>
  );
}
