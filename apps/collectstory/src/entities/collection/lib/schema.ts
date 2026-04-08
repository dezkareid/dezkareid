import type { CollectionPage, ItemList, ListItem, WithContext } from 'schema-dts';
import type { PublicCollection, PublicItem } from '@/lib/collections';

interface GetCollectionSchemaParameters {
  collection: PublicCollection | { name: string; description?: string; slug: string };
  username: string;
  items: PublicItem[];
  baseUrl: string;
}

export function getCollectionSchema({
  collection,
  username,
  items,
  baseUrl,
}: GetCollectionSchemaParameters): WithContext<CollectionPage> {
  const collectionUrl = `${baseUrl}/${username}/${collection.slug}`;

  const itemList: ItemList = {
    '@type': 'ItemList',
    'name': collection.name,
    'description': collection.description,
    'numberOfItems': items.length,
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'url': `${collectionUrl}/${item.slug}`,
      'name': item.name,
      'image': item.image_url,
    } as ListItem)),
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${collectionUrl}#collection`,
    'url': collectionUrl,
    'name': collection.name,
    'description': collection.description,
    'author': {
      '@type': 'Person',
      'name': username,
      'url': `${baseUrl}/${username}`,
    },
    'mainEntity': itemList,
  };
}
