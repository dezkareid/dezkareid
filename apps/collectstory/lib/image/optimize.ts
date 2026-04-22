import sharp from 'sharp';

export const UPLOAD_CONFIG = {
  item: { maxBytes: 5 * 1024 * 1024, maxDimension: 1200, quality: 80 },
  avatar: { maxBytes: 3 * 1024 * 1024, maxDimension: 400, quality: 80 },
  session: { maxBytes: 5 * 1024 * 1024, maxDimension: 1200, quality: 80 },
} as const;

export type UploadType = keyof typeof UPLOAD_CONFIG;

export async function optimizeImage(input: Buffer, type: UploadType): Promise<Buffer> {
  const { maxDimension, quality } = UPLOAD_CONFIG[type];
  const optimized = await sharp(input)
    .resize(maxDimension, maxDimension, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
  if (optimized.byteLength > input.byteLength) {
    throw new Error('Optimized image is larger than the original');
  }
  return optimized;
}
