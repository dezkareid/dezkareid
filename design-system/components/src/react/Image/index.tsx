import type { ImgHTMLAttributes, Ref } from 'react';
import cx from 'classnames';
import type { ImageProperties } from '../../shared/types/image';
import { getCloudinarySrcset, getCloudinaryUrl, CLOUDINARY_SRCSET_WIDTHS } from '../../shared/js/image';
import styles from '../../css/image.module.css';

export interface Properties extends ImageProperties, Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height' | 'alt'> {
  ref?: Ref<HTMLImageElement>;
}

export function Image({
  src: source,
  alt,
  mode = 'responsive',
  strategy = 'default',
  width,
  height,
  aspectRatio,
  priority = false,
  sizes,
  className,
  style,
  ref,
  ...rest
}: Properties) {
  if (!source) return;

  const isCloudinary = strategy === 'cloudinary' || source.includes('res.cloudinary.com');

  const computedStyle: React.CSSProperties = {
    ...(aspectRatio ? { aspectRatio } : {}),
    ...style,
  };

  const loadingAttribute: 'eager' | 'lazy' = priority ? 'eager' : 'lazy';
  const fetchPriorityAttribute: 'high' | undefined = priority ? 'high' : undefined;

  const commonProperties = {
    ref,
    alt,
    className: cx(
      styles.image,
      styles[`image--${mode}`],
      className,
    ),
    style: computedStyle,
    loading: loadingAttribute,
    decoding: 'async' as const,
    fetchPriority: fetchPriorityAttribute,
    width,
    height,
    ...rest,
  };

  if (isCloudinary) {
    if (mode === 'fixed') {
      const requestWidth = width ? width * 2 : CLOUDINARY_SRCSET_WIDTHS[0];
      const fixedSource = getCloudinaryUrl(source, requestWidth);
      return <img {...commonProperties} src={fixedSource} />;
    }

    // Responsive mode
    const sourceSet = getCloudinarySrcset(source);
    const fallbackSource = getCloudinaryUrl(source, CLOUDINARY_SRCSET_WIDTHS[0]);

    return <img {...commonProperties} src={fallbackSource} srcSet={sourceSet} sizes={sizes} />;
  }

  // Default mode
  return <img {...commonProperties} src={source} />;
}
