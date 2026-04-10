/**
 * Cloudinary URL transformation utilities.
 *
 * Inserts transformation parameters into a Cloudinary image URL.
 *
 * Input:  https://res.cloudinary.com/<cloud>/image/upload/v123/path/to/image.jpg
 * Output: https://res.cloudinary.com/<cloud>/image/upload/c_fill,w_640,q_auto,f_auto/v123/path/to/image.jpg
 *
 * Returns undefined if the URL is not a Cloudinary URL or does not match the
 * expected upload path structure — callers can fall back to a plain <img>.
 */

export const CLOUDINARY_SRCSET_WIDTHS = [320, 480, 640, 960, 1280, 1600] as const;

export function getCloudinaryUrl(url: string | undefined, width: number): string | undefined {
  if (!url || !url.includes('res.cloudinary.com')) return undefined;

  const uploadSegment = '/image/upload/';
  const index = url.indexOf(uploadSegment);
  if (index === -1) return undefined;

  const base = url.slice(0, index + uploadSegment.length);
  const rest = url.slice(index + uploadSegment.length);
  const transform = `c_fill,w_${width},q_auto,f_auto/`;

  return `${base}${transform}${rest}`;
}

/**
 * Generates a `srcset` string with Cloudinary-transformed URLs at each
 * CLOUDINARY_SRCSET_WIDTHS breakpoint.
 *
 * Returns undefined if the URL is not a Cloudinary URL.
 */
export function getCloudinarySrcset(url: string | undefined): string | undefined {
  if (!url || !url.includes('res.cloudinary.com')) return undefined;

  const entries = CLOUDINARY_SRCSET_WIDTHS.map((w) => {
    const transformed = getCloudinaryUrl(url, w);
    return transformed ? `${transformed} ${w}w` : undefined;
  }).filter(Boolean);

  return entries.length > 0 ? entries.join(', ') : undefined;
}
