/* eslint-disable @next/next/no-img-element -- intentional: this component replaces next/image for Cloudinary URLs */
import type { ImgHTMLAttributes, Ref } from 'react';
import {
  CLOUDINARY_SRCSET_WIDTHS,
  getCloudinarySrcset,
  getCloudinaryUrl,
} from '@/lib/image/cloudinary';

type OwnProperties = {
  /** Original image URL. Cloudinary URLs are optimized; others render as a plain <img>. */
  src: string | undefined;
  /**
   * Rendering mode.
   *
   * - `"responsive"` (default): generates a `srcset` + `sizes` for Cloudinary URLs so the
   *   browser picks the right size at every viewport. Use for fluid-width images.
   * - `"fixed"`: requests a single Cloudinary-optimized URL at `width` pixels (2× DPR if
   *   `width` is provided, otherwise the smallest srcset width). Use for avatars, thumbnails,
   *   and any image rendered at a known fixed size.
   */
  mode?: 'responsive' | 'fixed';
  /**
   * Required in `"fixed"` mode. The rendered CSS width of the image in pixels.
   * The component requests `width * 2` from Cloudinary to cover 2× DPR screens.
   */
  width?: number;
  /** Intrinsic aspect ratio (e.g. "1 / 1", "16 / 9"). Prevents CLS before the image loads. */
  aspectRatio?: string;
  /** Marks this image as high-priority: sets loading="eager" and fetchPriority="high". Use for LCP images. */
  priority?: boolean;
  /** Optional ref forwarded to the underlying <img> element. */
  ref?: Ref<HTMLImageElement>;
};

/**
 * `alt` is required. Everything else from <img> is forwarded as-is.
 * We omit `srcSet`, `loading`, `decoding`, and `fetchPriority` because the
 * component derives them from `src`, `mode`, and `priority`.
 */
export type Properties = OwnProperties
  & Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'srcSet' | 'loading' | 'decoding' | 'fetchPriority' | 'width' | 'height'
  > & {
    alt: string;
    /**
     * Passed to the native `sizes` attribute in `"responsive"` mode.
     * Should always be provided for Cloudinary images so the browser picks the
     * correct width descriptor. Has no effect in `"fixed"` mode.
     */
    sizes?: string;
    /** Forwarded to the native `width` attribute. Also used in `"fixed"` mode to size the Cloudinary request. */
    width?: number;
    /** Forwarded to the native `height` attribute. */
    height?: number;
  };

/**
 * Zero-JS responsive image component.
 *
 * Responsive mode (default): renders a native `<img srcset sizes>` pointing directly at
 * Cloudinary CDN — no Next.js proxy, no JavaScript required.
 *
 * Fixed mode: renders a single `<img src>` with a Cloudinary-optimized URL at 2× the
 * given `width` — ideal for avatars and thumbnails with a known pixel size.
 *
 * Non-Cloudinary URLs (e.g. Google OAuth avatar) always fall back to a plain `<img>`.
 */
export function CloudinaryImage({
  src,
  alt,
  mode = 'responsive',
  sizes,
  aspectRatio,
  priority,
  width,
  height,
  style,
  ref,
  ...rest
}: Properties) {
  if (!src) return;

  const computedStyle: React.CSSProperties = mode === 'fixed'
    ? { ...style }
    : {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...(aspectRatio ? { aspectRatio } : {}),
        ...style,
      };

  const loadingAttribute: 'eager' | 'lazy' = priority ? 'eager' : 'lazy';
  const fetchPriorityAttribute: 'high' | undefined = priority ? 'high' : undefined;

  const sharedProperties = {
    ref,
    alt,
    style: computedStyle,
    loading: loadingAttribute,
    decoding: 'async' as const,
    fetchPriority: fetchPriorityAttribute,
    width,
    height,
    ...rest,
  };

  if (mode === 'fixed') {
    // Request 2× the rendered width to cover HiDPI screens.
    const requestWidth = width ? width * 2 : CLOUDINARY_SRCSET_WIDTHS[0];
    const fixedSource = getCloudinaryUrl(src, requestWidth) ?? src;
    return <img {...sharedProperties} src={fixedSource} alt={alt} />;
  }

  // Responsive mode
  const srcset = getCloudinarySrcset(src);

  if (!srcset) {
    return <img {...sharedProperties} src={src} alt={alt} />;
  }

  const fallbackSource = getCloudinaryUrl(src, CLOUDINARY_SRCSET_WIDTHS[0]) ?? src;

  return <img {...sharedProperties} src={fallbackSource} srcSet={srcset} sizes={sizes} alt={alt} />;
}
