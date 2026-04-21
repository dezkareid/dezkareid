'use client';

import { useState, useId } from 'react';
import styles from './StoreMapToggle.module.css';

type Properties = {
  lat: number;
  lng: number;
  showMap: string;
  hideMap: string;
};

export function StoreMapToggle({ lat, lng, showMap, hideMap }: Properties) {
  const [open, setOpen] = useState(false);
  const mapId = useId();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('StoreMapToggle: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set');
    }
    return null;
  }

  const source = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}`;

  return (
    <div className={styles['store-map-toggle']}>
      <button
        type="button"
        className={styles['store-map-toggle__button']}
        onClick={() => setOpen(previous => !previous)}
        aria-expanded={open}
        aria-controls={mapId}
      >
        <span aria-hidden="true">{open ? '▾' : '▸'}</span>
        {open ? hideMap : showMap}
      </button>

      {open && (
        <div id={mapId} className={styles['store-map-toggle__map-container']}>
          <iframe
            src={source}
            title="Store location map"
            className={styles['store-map-toggle__map-frame']}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  );
}
