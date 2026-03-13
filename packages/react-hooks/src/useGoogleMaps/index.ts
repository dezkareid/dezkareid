import { useEffect, useState } from 'react';
import gMapsLoader from './gm-loader';

interface UseGoogleMapsAPIParams {
  key: string;
}

function useGoogleMapsAPI({ key }: UseGoogleMapsAPIParams): unknown {
  const [mapsAPI, setMapsAPI] = useState<unknown>(undefined);
  useEffect(() => {
    gMapsLoader({ key }).then((googleMapsAPI: unknown) => {
      setMapsAPI(googleMapsAPI);
    });
  }, [key]);
  return mapsAPI;
}

export default useGoogleMapsAPI;
