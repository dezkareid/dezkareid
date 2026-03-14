import { createContext, use, useEffect, useRef, ReactNode } from 'react';
import { useGoogleMaps } from '@dezkareid/react-hooks';

export interface MapOptions {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  [key: string]: unknown;
}

export interface GoogleMapsProperties {
  mapKey: string;
  mapOptions: MapOptions;
  className?: string;
  children?: ReactNode;
}

type GoogleMap = unknown;

export const GoogleMapContext = createContext<GoogleMap>(undefined);

export function useGoogleMap() {
  return use(GoogleMapContext);
}

function GoogleMaps({ mapKey, mapOptions, className = '', children }: GoogleMapsProperties) {
  const google = useGoogleMaps({ key: mapKey });
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<GoogleMap>(undefined);

  useEffect(() => {
    if (google && mapRef.current) {
      mapInstanceRef.current = new (google as { maps: { Map: new (element: HTMLDivElement, options: MapOptions) => unknown } }).maps.Map(mapRef.current, {
        ...mapOptions
      });
    }
  }, [google, mapOptions]);

  return (
    <GoogleMapContext value={mapInstanceRef.current}>
      <div ref={mapRef} className={className}>
        {children}
      </div>
    </GoogleMapContext>
  );
}

export default GoogleMaps;
