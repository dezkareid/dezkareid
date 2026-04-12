export type ImageMode = 'responsive' | 'fixed';
export type ImageStrategy = 'default' | 'cloudinary';

export interface ImageProperties {
  src: string;
  alt: string;
  mode?: ImageMode;
  strategy?: ImageStrategy;
  width?: number;
  height?: number;
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}
