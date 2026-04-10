import type { ImageObject, ItemList, ListItem, WithContext } from 'schema-dts';
import type { PublicCollection, PublicItem, PublicItemDetail } from '@/lib/collections';

interface GetCollectionItemSchemaParameters {
  item: PublicItemDetail;
  username: string;
  collectionSlug: string;
  baseUrl: string;
}

/**
 * Generates an ImageObject schema for a collection item.
 */
export function generateCollectionItemSchema({
  item,
  username,
  collectionSlug,
  baseUrl,
}: GetCollectionItemSchemaParameters): WithContext<ImageObject> {
  const itemUrl = `${baseUrl}/${username}/${collectionSlug}/${item.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${itemUrl}#image`,
    'url': itemUrl,
    'contentUrl': item.image_url,
    'name': item.name,
    'description': item.description ?? undefined,
    'thumbnailUrl': item.image_url, // Using same as contentUrl for now
    'creator': {
      '@type': 'Person',
      'name': username,
      'url': `${baseUrl}/${username}`,
    },
    'datePublished': item.date_acquired,
    'acquireLicensePage': `${baseUrl}/${username}/${collectionSlug}/${item.slug}`,
  };
}

interface GetCollectionListingSchemaParameters {
  collection: PublicCollection | { name: string; description?: string; slug: string };
  username: string;
  items: PublicItem[];
  baseUrl: string;
}

/**
 * Generates an ItemList schema for a collection listing page.
 * ItemList is the primary type.
 */
export function generateCollectionListingSchema({
  collection,
  username,
  items,
  baseUrl,
}: GetCollectionListingSchemaParameters): WithContext<ItemList> {
  const collectionUrl = `${baseUrl}/${username}/${collection.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${collectionUrl}#itemlist`,
    'url': collectionUrl,
    'name': collection.name,
    'description': collection.description ?? undefined,
    'numberOfItems': items.length,
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'ImageObject',
        'name': item.name,
        'contentUrl': item.image_url,
        'creator': {
          '@type': 'Person',
          'name': username,
        },
      },
    } as ListItem)),
  };
}
