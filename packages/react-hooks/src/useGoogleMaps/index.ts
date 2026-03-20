import { useEffect, useState } from 'react';
import gMapsLoader from './gm-loader';

interface UseGoogleMapsAPIParameters {
  key: string;
}

function useGoogleMapsAPI({ key }: UseGoogleMapsAPIParameters): unknown {
  const [mapsAPI, setMapsAPI] = useState<unknown>();
  useEffect(() => {
    gMapsLoader({ key }).then((googleMapsAPI: unknown) => {
      setMapsAPI(googleMapsAPI);
    });
  }, [key]);
  return mapsAPI;
}

export default useGoogleMapsAPI;
