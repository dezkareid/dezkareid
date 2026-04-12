'use client';

import { useState, ReactNode } from 'react';
import { ViewTransition } from 'react';
import { Image } from '@dezkareid/components/react';
import styles from './page.module.css';

type Properties = {
  slug: string;
  imageUrl: string | undefined;
  name: string;
  children?: ReactNode;
};

export function ItemImageSection({
  slug,
  imageUrl,
  name,
  children,
}: Properties) {
  // We use the 'imageUrl' from props as the source of truth.
  // The 'key' prop on this component at the call site (in page.tsx)
  // will ensure the internal state resets when the image actually changes
  // after a server revalidation.
  const [currentImageUrl] = useState(imageUrl);

  return (
    <div className={styles['item-page__image']}>
      <div className={styles['item-page__image-wrapper']}>
        {currentImageUrl
          ? (
              <ViewTransition name={`item-image-${slug}`}>
                <Image
                  src={currentImageUrl}
                  alt={name}
                  strategy="cloudinary"
                  sizes="(max-width: 768px) 100vw, 480px"
                  className={styles['item-page__image-media']}
                  priority
                />
              </ViewTransition>
            )
          : (
              <div className={styles['item-page__image-placeholder']} aria-hidden="true">
                <span className={styles['item-page__placeholder-icon']}>◻</span>
              </div>
            )}

        {children}
      </div>
    </div>
  );
}
