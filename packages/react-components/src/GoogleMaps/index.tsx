import React, { useEffect, useRef, useState, ReactNode } from 'react';
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

function GoogleMaps({ mapKey, mapOptions, className = '', children }: GoogleMapsProperties) {
  const google = useGoogleMaps({ key: mapKey });
  const [map, setMap] = useState<unknown>();
  const mapReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (google && mapReference.current) {
      const mapInstance = new (google as { maps: { Map: new (element: HTMLDivElement, options: MapOptions) => unknown } }).maps.Map(mapReference.current, {
        ...mapOptions
      });
      setMap(mapInstance);
    }
  }, [google, mapOptions]);

  const mapElements = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { map } as React.Attributes & { map: unknown });
    }
    return child;
  });

  return (
    <div ref={mapReference} className={className}>
      {mapElements}
    </div>
  );
}

export default GoogleMaps;
