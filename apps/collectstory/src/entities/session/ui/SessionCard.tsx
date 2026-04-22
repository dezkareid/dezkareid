import Link from 'next/link';
import { Image } from '@dezkareid/components/react';
import type { PublicSession } from '@/lib/sessions';
import styles from './SessionCard.module.css';

type Properties = {
  session: PublicSession;
  username: string;
};

export function SessionCard({ session, username }: Properties) {
  return (
    <Link href={`/${username}/sessions/${session.slug}`} className={styles['session-card']}>
      <div className={styles['session-card__image-wrapper']}>
        {session.cover_url
          ? (
              <Image
                src={session.cover_url}
                alt={session.name}
                strategy="cloudinary"
                sizes="(max-width: 640px) 50vw, 300px"
                className={styles['session-card__image']}
              />
            )
          : (
              <div className={styles['session-card__placeholder']} aria-hidden="true">📷</div>
            )}
      </div>
      <div className={styles['session-card__body']}>
        <h3 className={styles['session-card__name']}>{session.name}</h3>
        <div className={styles['session-card__meta']}>
          <span>
            {session.photo_count}
            {' '}
            {session.photo_count === 1 ? 'photo' : 'photos'}
          </span>
          <span>
            {session.likes_count}
            {' '}
            {session.likes_count === 1 ? 'like' : 'likes'}
          </span>
        </div>
      </div>
    </Link>
  );
}
