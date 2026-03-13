declare global {
  interface Window {
    google: unknown;
  }
  var google: unknown;
}

interface GMLoaderParameters {
  key: string;
}

function gMLoader({ key }: GMLoaderParameters): Promise<unknown> {
  return new Promise(resolve => {
    const mapScript = document.createElement('script');
    mapScript.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    mapScript.async = true;
    document.body.append(mapScript);
    mapScript.addEventListener('load', () => {
      resolve(globalThis.google);
    });
  });
}

export default gMLoader;
