import { Image } from '@dezkareid/components/react-server';
import type { SessionPhoto } from '@/lib/sessions';
import styles from './SessionPhotoGrid.module.css';

type Properties = {
  photos: SessionPhoto[];
};

export function SessionPhotoStaticGrid({ photos }: Properties) {
  return (
    <div className={styles['photo-grid']}>
      {photos.map(photo => (
        <div key={photo.id} className={styles['photo-grid__item']}>
          <div className={styles['photo-grid__image-wrapper']}>
            <Image
              src={photo.image_url}
              alt=""
              strategy="cloudinary"
              sizes="(max-width: 640px) 45vw, 200px"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
