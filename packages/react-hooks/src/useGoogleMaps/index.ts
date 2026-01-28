import { useEffect, useState } from 'react';
import gMapsLoader from './gm-loader';

interface UseGoogleMapsAPIParams {
  key: string;
}

function useGoogleMapsAPI({ key }: UseGoogleMapsAPIParams): any {
  const [mapsAPI, setMapsAPI] = useState<any>(undefined);
  useEffect(() => {
    gMapsLoader({ key }).then((googleMapsAPI: any) => {
      setMapsAPI(googleMapsAPI);
    });
  }, [key]);
  return mapsAPI;
}

export default useGoogleMapsAPI;
