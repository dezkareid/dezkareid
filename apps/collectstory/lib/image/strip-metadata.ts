/**
 * Strips EXIF and other metadata from an image file using the Canvas API.
 * The canvas re-encodes only the pixel data, naturally discarding all metadata.
 * Compression is intentionally deferred to the server (quality=1.0 here).
 */
export async function stripMetadata(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.addEventListener('load', () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        resolve(file);
        return;
      }

      context.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to strip image metadata'));
            return;
          }
          resolve(new File([blob], file.name, { type: file.type }));
        },
        file.type,
        1,
      );
    });

    img.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for metadata stripping'));
    });

    img.src = objectUrl;
  });
}
