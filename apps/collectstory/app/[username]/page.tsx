import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { getPublicCollectionsByUsername } from '@/lib/collections';
import { UserProfileActions } from '@/components/username/UserProfileActions';
import { SocialShare } from '@/src/features/social-share';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { username } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  return {
    title: `${username}'s Collections`,
    description: `Browse ${username}'s collectible collections on Collectstory.`,
    alternates: { canonical: `${baseUrl}/${username}` },
    openGraph: {
      title: `${username}'s Collections — Collectstory`,
      description: `Browse ${username}'s collectible collections on Collectstory.`,
      url: `${baseUrl}/${username}`,
      type: 'profile',
    },
  };
}

async function ProfileContent({ username }: { username: string }) {
  await connection();
  const result = await getPublicCollectionsByUsername(username);
  if (!result) notFound();

  const { collections } = result;

  return (
    <>
      <div className={styles.grid}>
        {collections.length === 0
          ? (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>No public collections yet</p>
                <p className={styles.emptyDesc}>
                  {username}
                  {' '}
                  hasn&apos;t made any collections public yet.
                </p>
              </div>
            )
          : collections.map(col => (
              <Link
                key={col.id}
                href={`/${username}/${col.slug}`}
                className={styles.collectionCard}
              >
                <p className={styles.collectionName}>{col.name}</p>
                {col.description && (
                  <p className={styles.collectionDesc}>{col.description}</p>
                )}
                <p className={styles.collectionMeta}>
                  {col.item_count}
                  {' '}
                  {col.item_count === 1 ? 'item' : 'items'}
                </p>
              </Link>
            ))}
      </div>
    </>
  );
}

async function ProfileHeader({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  await connection();
  const result = await getPublicCollectionsByUsername(username);
  const avatarUrl = result?.avatarUrl;

  return (
    <header className={styles.header}>
      <div className={styles.avatar}>
        {avatarUrl
          ? (
              <Image
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
            title={`@${username}'s Profile on Collectstory`}
            text={`Check out @${username}'s collectible collections!`}
            baseUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${username}`}
            entityType="profile"
          />
        </div>
      </div>
      <div className={styles.ownerActions}>
        <Suspense fallback={undefined}>
          <UserProfileActions username={username} />
        </Suspense>
      </div>
    </header>
  );
}

async function ProfileCollections({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <ProfileContent username={username} />;
}

export default function UserProfilePage({ params }: Properties) {
  return (
    <div className={`container ${styles.page}`}>
      <Suspense>
        <ProfileHeader params={params} />
      </Suspense>

      <p className={styles.sectionLabel}>Collections</p>

      <Suspense>
        <ProfileCollections params={params} />
      </Suspense>
    </div>
  );
}
