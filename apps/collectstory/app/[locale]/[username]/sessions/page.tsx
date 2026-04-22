import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/app/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import { getSessionsByUsername } from '@/lib/sessions';
import { getCloudinaryUrl } from '@/lib/image/cloudinary';
import { SessionCard } from '@/src/entities/session';
import { CreateSessionModal } from '@/src/features/owner-session-actions';
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const result = await getSessionsByUsername(username);
  if (!result) return {};

  const firstCover = result.sessions[0]?.cover_url;
  const ogImage = (firstCover ? getCloudinaryUrl(firstCover, 1200) : undefined) ?? `${baseUrl}/logo.png`;
  const canonicalUrl = `${baseUrl}/${username}/sessions`;

  return {
    title: `${username}'s Photo Sessions`,
    description: `Explore photo sessions by ${username} on Collecstory.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${username}'s Photo Sessions`,
      description: `Explore photo sessions by ${username} on Collecstory.`,
      url: canonicalUrl,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${username}'s photo sessions` }],
    },
  };
}

async function OwnerCreateButton({ username, sessionCount }: { username: string; sessionCount: number }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const result = await getSessionsByUsername(username);
  if (!user || user.id !== result?.userId) return null;
  return <CreateSessionModal username={username} sessionCount={sessionCount} />;
}

export default async function SessionsPage({ params }: Properties) {
  const { username } = await params;
  const t = await getTranslations('PhotoSessions');

  const result = await getSessionsByUsername(username);
  if (!result) notFound();

  const { sessions } = result;

  return (
    <main className={styles['sessions-page']}>
      <div className={styles['sessions-page__header']}>
        <div>
          <h1 className={styles['sessions-page__title']}>{t('page_title')}</h1>
          <p className={styles['sessions-page__subtitle']}>
            @
            {username}
          </p>
        </div>
        <Suspense fallback={undefined}>
          <OwnerCreateButton username={username} sessionCount={sessions.length} />
        </Suspense>
      </div>

      {sessions.length === 0
        ? (
            <div className={styles['sessions-page__empty']}>
              <p>{t('empty_visitor')}</p>
            </div>
          )
        : (
            <div className={styles['sessions-page__grid']}>
              {sessions.map(session => (
                <SessionCard key={session.id} session={session} username={username} />
              ))}
            </div>
          )}
    </main>
  );
}
