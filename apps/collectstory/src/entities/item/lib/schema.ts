import type { Product, WithContext } from 'schema-dts';
import type { PublicItemDetail } from '@/lib/collections';

interface GetItemSchemaParameters {
  item: PublicItemDetail;
  username: string;
  collectionSlug: string;
  baseUrl: string;
}

export function getItemSchema({
  item,
  username,
  collectionSlug,
  baseUrl,
}: GetItemSchemaParameters): WithContext<Product> {
  const itemUrl = `${baseUrl}/${username}/${collectionSlug}/${item.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${itemUrl}#product`,
    'url': itemUrl,
    'name': item.name,
    'description': item.description,
    'image': item.image_url,
    'brand': item.lines?.brands?.name
      ? {
          '@type': 'Brand',
          'name': item.lines.brands.name,
        }
      : undefined,
    'category': item.lines?.categories?.name,
    'model': item.lines?.name,
    'productionDate': item.date_acquired,
    'offers': {
      '@type': 'Offer',
      'availability': 'https://schema.org/InStock',
      'url': itemUrl,
    },
  };
}
