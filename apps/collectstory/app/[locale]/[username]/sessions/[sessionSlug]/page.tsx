import type { Metadata } from 'next';
import type { WithContext, Thing } from 'schema-dts';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { routing } from '@/app/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import { getSessionBySlug, getSessionPhotos, isSessionLikedByUser, type PublicSession } from '@/lib/sessions';
import { getCloudinaryUrl } from '@/lib/image/cloudinary';
import { DataSchema } from '@/src/shared/ui/DataSchema';
import { SessionLikeButton } from '@/src/features/like-session';
import { SessionExploreButton } from '@/src/features/explore-session';
import { SessionPhotoGrid } from '@/src/features/session-photos';
import { SessionActionsMenu } from '@/src/features/owner-session-actions';
import { OwnerSessionSection } from './_components/OwnerSessionSection';
import styles from './page.module.css';

type Properties = {
  params: Promise<{ username: string; sessionSlug: string; locale: string }>;
};

export function generateStaticParams() {
  const { locales } = routing;
  return locales.map(locale => ({
    username: '_placeholder',
    sessionSlug: '_placeholder',
    locale,
  }));
}

export async function generateMetadata({ params }: Properties): Promise<Metadata> {
  const { username, sessionSlug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  const session = await getSessionBySlug(username, sessionSlug);
  if (!session) return {};

  const ogImage = (session.cover_url ? getCloudinaryUrl(session.cover_url, 1200) : undefined) ?? `${baseUrl}/logo.png`;
  const canonicalUrl = `${baseUrl}/${username}/sessions/${sessionSlug}`;

  return {
    title: `${session.name} — ${username}'s Photo Session`,
    description: session.description ?? `A photo session by ${username} on Collecstory.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${session.name} — ${username}'s Photo Session`,
      description: session.description ?? `A photo session by ${username} on Collecstory.`,
      url: canonicalUrl,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: session.name }],
    },
  };
}

function buildImageGallerySchema(sessionName: string, photos: { image_url: string }[], url: string): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    'name': sessionName,
    'image': photos.map(p => getCloudinaryUrl(p.image_url, 1200)),
    url,
  } as unknown as WithContext<Thing>;
}

async function SessionOwnerMenu({ session, username }: { session: PublicSession; username: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.id !== session.user_id) return null;
  return <SessionActionsMenu sessionId={session.id} sessionName={session.name} username={username} />;
}

async function SessionActionsAndPhotos({
  session,
  username,
  sessionSlug,
  baseUrl,
}: {
  session: PublicSession;
  username: string;
  sessionSlug: string;
  baseUrl: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [sessionPhotos, liked] = await Promise.all([
    getSessionPhotos(session.id),
    user ? isSessionLikedByUser(session.id, user.id) : Promise.resolve(false),
  ]);

  const isOwner = user?.id === session.user_id;
  const canonicalUrl = `${baseUrl}/${username}/sessions/${sessionSlug}`;

  return (
    <>
      {sessionPhotos.length > 0 && (
        <DataSchema
          schema={buildImageGallerySchema(session.name, sessionPhotos, canonicalUrl)}
          id="session-gallery-schema"
        />
      )}

      <div className={styles['session-page__actions']}>
        <SessionLikeButton
          sessionId={session.id}
          username={username}
          sessionSlug={sessionSlug}
          initialCount={session.likes_count}
          initialLiked={liked}
          isAuthenticated={!!user}
        />
        {sessionPhotos.length > 0 && (
          <SessionExploreButton
            photos={sessionPhotos}
            sessionName={session.name}
            sessionId={session.id}
          />
        )}
      </div>

      {isOwner
        ? (
            <OwnerSessionSection
              sessionId={session.id}
              username={username}
              sessionSlug={sessionSlug}
              initialPhotos={sessionPhotos}
            />
          )
        : (sessionPhotos.length === 0
            ? (
                <div className={styles['session-page__empty']}>
                  <p>No photos in this session yet.</p>
                </div>
              )
            : (
                <SessionPhotoGrid
                  sessionId={session.id}
                  username={username}
                  sessionSlug={sessionSlug}
                  initialPhotos={sessionPhotos}
                  isOwner={false}
                />
              ))}
    </>
  );
}

export default async function SessionDetailPage({ params }: Properties) {
  const { username, sessionSlug } = await params;

  const session = await getSessionBySlug(username, sessionSlug);
  if (!session) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  return (
    <main className={styles['session-page']}>
      <div className={styles['session-page__header']}>
        <div className={styles['session-page__title-row']}>
          <h1 className={styles['session-page__title']}>{session.name}</h1>
          <Suspense fallback={undefined}>
            <SessionOwnerMenu session={session} username={username} />
          </Suspense>
        </div>

        {session.description && (
          <p className={styles['session-page__description']}>{session.description}</p>
        )}
      </div>

      <Suspense fallback={undefined}>
        <SessionActionsAndPhotos
          session={session}
          username={username}
          sessionSlug={sessionSlug}
          baseUrl={baseUrl}
        />
      </Suspense>
    </main>
  );
}
