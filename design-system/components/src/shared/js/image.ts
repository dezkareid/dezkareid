export const CLOUDINARY_SRCSET_WIDTHS = [
  420, 560, 720, 840, 1024, 1280, 1536, 1920, 2048, 2560,
];

export function getCloudinaryUrl(source: string, width: number) {
  // Simple Cloudinary URL transformation
  // Expected format: https://<domain>/<cloud_name>/image/upload/<transformations>/v<version>/<public_id>
  // We insert w_<width>,c_limit,f_auto,q_auto
  const parts = source.split('/upload/');
  if (parts.length !== 2) return source;

  return `${parts[0]}/upload/w_${width},c_limit,f_auto,q_auto/${parts[1]}`;
}

export function getCloudinarySrcset(source: string) {
  // We only generate srcset if it looks like a Cloudinary URL (contains /upload/)
  if (!source.includes('/upload/')) return;

  return CLOUDINARY_SRCSET_WIDTHS
    .map(width => `${getCloudinaryUrl(source, width)} ${width}w`)
    .join(', ');
}
