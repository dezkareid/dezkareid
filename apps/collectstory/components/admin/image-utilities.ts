export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function processImageFile(
  file: File,
  onFileError: (error: string | undefined) => void,
  onUploadedUrl: (url: string | undefined) => void,
  onFile: (file: File | undefined) => void,
  setPreview: (url: string | undefined) => void,
): Promise<void> {
  onFileError(undefined);
  onUploadedUrl(undefined);
  onFile(undefined);
  setPreview(undefined);

  const isHeic = file.type === 'image/heic' || file.type === 'image/heif'
    || /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name);

  if (!ALLOWED_IMAGE_TYPES.has(file.type) && !isHeic) {
    onFileError('Only JPEG, PNG, WebP, or HEIC images are allowed.');
    return;
  }

  if (file.size > MAX_IMAGE_BYTES) {
    onFileError('Image must be 5 MB or smaller.');
    return;
  }

  if (isHeic) {
    try {
      const heic2anyModule = await import('heic2any');
      const heic2any = heic2anyModule.default ?? heic2anyModule;
      const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
      const blob = Array.isArray(result) ? result[0] : result;
      onFile(new File([blob], file.name, { type: 'image/jpeg' }));
      setPreview(URL.createObjectURL(blob));
    }
    catch {
      onFileError('Could not convert HEIC image. Please try a different format.');
    }
    return;
  }

  onFile(file);
  setPreview(URL.createObjectURL(file));
}
