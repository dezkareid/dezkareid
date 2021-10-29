/* eslint-disable no-undef */
import { useEffect, useRef } from 'react';

function DMarker({ map, position }) {
  const marker = useRef(null);
  useEffect(() => {
    if (map && position) {
      const markerOptions = { map, position };
      if (marker.current) {
        marker.current.setOptions(markerOptions);
      } else {
        marker.current = new google.maps.Marker(markerOptions);
      }
    }
  }, [map, position]);
  return null;
}

export default DMarker;