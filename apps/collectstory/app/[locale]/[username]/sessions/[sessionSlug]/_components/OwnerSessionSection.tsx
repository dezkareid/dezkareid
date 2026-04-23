'use client';

import { useSessionPhotos } from '@/src/features/session-photos';
import { SessionPhotoGrid } from '@/src/features/session-photos';
import { PhotoUploadZone } from '@/src/features/session-photos';
import styles from './OwnerSessionSection.module.css';

type Properties = {
  sessionId: string;
  username: string;
  sessionSlug: string;
};

export function OwnerSessionSection({ sessionId, username, sessionSlug }: Properties) {
  const { photos, addPhoto, setPhotos } = useSessionPhotos();

  return (
    <div className={styles['owner-section']}>
      <div className={styles['owner-section__upload']}>
        <PhotoUploadZone
          sessionId={sessionId}
          currentCount={photos.length}
          onUploaded={addPhoto}
        />
      </div>
      <SessionPhotoGrid
        sessionId={sessionId}
        username={username}
        sessionSlug={sessionSlug}
        initialPhotos={photos}
        isOwner
        onPhotosChange={setPhotos}
      />
    </div>
  );
}
