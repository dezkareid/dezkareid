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

export interface GoogleMapsProps {
  mapKey: string;
  mapOptions: MapOptions;
  className?: string;
  children?: ReactNode;
}

function GoogleMaps({ mapKey, mapOptions, className = '', children = null }: GoogleMapsProps) {
  const google = useGoogleMaps({ key: mapKey });
  const [map, setMap] = useState<unknown>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (google && mapRef.current) {
      const mapInstance = new google.maps.Map(mapRef.current, {
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
    <div ref={mapRef} className={className}>
      {mapElements}
    </div>
  );
}

export default GoogleMaps;
