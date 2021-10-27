import { useEffect, useState } from 'react';
import gMapsLoader from './gm-loader';

function useGoogleMapsAPI({ key }) {
  const [mapsAPI, setMapsAPI] = useState();
  useEffect(() => {
    gMapsLoader({ key }).then(googleMapsAPI => {
      setMapsAPI(googleMapsAPI);
    });
  }, [key]);
  return mapsAPI;
}

export default useGoogleMapsAPI;
