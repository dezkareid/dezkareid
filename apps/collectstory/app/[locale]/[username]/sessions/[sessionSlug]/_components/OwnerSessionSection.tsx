'use client';

import { useState } from 'react';
import { SessionPhotoGrid } from '@/src/features/session-photos';
import { PhotoUploadZone } from '@/src/features/session-photos';
import type { SessionPhoto } from '@/lib/sessions';
import styles from './OwnerSessionSection.module.css';

type Properties = {
  sessionId: string;
  username: string;
  sessionSlug: string;
  initialPhotos: SessionPhoto[];
};

export function OwnerSessionSection({ sessionId, username, sessionSlug, initialPhotos }: Properties) {
  const [photos, setPhotos] = useState<SessionPhoto[]>(initialPhotos);

  return (
    <div className={styles['owner-section']}>
      <div className={styles['owner-section__upload']}>
        <PhotoUploadZone
          sessionId={sessionId}
          currentCount={photos.length}
          onUploaded={photo => setPhotos(previous => [...previous, photo])}
        />
      </div>
      <SessionPhotoGrid
        sessionId={sessionId}
        username={username}
        sessionSlug={sessionSlug}
        initialPhotos={photos}
        isOwner
      />
    </div>
  );
}
