import { describe, expect, it } from 'vitest';
import type { PublicCollection, PublicItem, PublicItemDetail } from '@/lib/collections';
import { generateCollectionItemSchema, generateCollectionListingSchema } from './schema';

describe('SEO Schema Utilities', () => {
  const baseUrl = 'https://collectstory.com';
  const username = 'johndoe';
  const collectionSlug = 'cool-items';

  const mockItem: PublicItemDetail = {
    id: 'item-1',
    name: 'Awesome Item',
    slug: 'awesome-item',
    image_url: 'https://example.com/image.jpg',
    description: 'A very cool item indeed.',
    date_acquired: '2024-01-01',
    likes_count: 10,
    user_id: 'user-1',
    visibility: 'public',
    variant: 'Standard',
    catalog_items: undefined,
    lines: {
      id: 'line-1',
      name: 'Cool Line',
      brands: { id: 'brand-1', name: 'Super Brand' },
      categories: { name: 'Toys' },
      variants: [],
    },
    franchises: { id: 'fran-1', name: 'Star Wars', slug: 'star-wars' },
  };

  const mockCollection: PublicCollection = {
    id: 'coll-1',
    name: 'My Cool Collection',
    slug: 'cool-items',
    description: 'Collection of the coolest items.',
    item_count: 1,
    total_count: 1,
  };

  describe('generateCollectionItemSchema', () => {
    it('should generate a valid ImageObject schema', () => {
      const schema = generateCollectionItemSchema({
        item: mockItem,
        username,
        collectionSlug,
        baseUrl,
      });

      expect(schema['@type']).toBe('ImageObject');
      expect(schema.name).toBe(mockItem.name);
      expect(schema.contentUrl).toBe(mockItem.image_url);
      expect(schema.creator).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const creator = schema.creator as any;
      expect(creator['@type']).toBe('Person');
      expect(creator.name).toBe(username);
      expect(schema.acquireLicensePage).toBe(`${baseUrl}/${username}/${collectionSlug}/${mockItem.slug}`);
    });

    it('should handle missing description', () => {
      const itemWithoutDesc = { ...mockItem, description: undefined };
      const schema = generateCollectionItemSchema({
        item: itemWithoutDesc,
        username,
        collectionSlug,
        baseUrl,
      });

      expect(schema.description).toBeUndefined();
    });
  });

  describe('generateCollectionListingSchema', () => {
    it('should generate a valid ItemList schema', () => {
      const items: PublicItem[] = [mockItem];
      const schema = generateCollectionListingSchema({
        collection: mockCollection,
        username,
        items,
        baseUrl,
      });

      expect(schema['@type']).toBe('ItemList');
      expect(schema.name).toBe(mockCollection.name);
      expect(schema.numberOfItems).toBe(1);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const elements = schema.itemListElement as any[];
      expect(Array.isArray(elements)).toBe(true);
      expect(elements).toHaveLength(1);
      const firstElement = elements[0];
      expect(firstElement['@type']).toBe('ListItem');
      expect(firstElement.position).toBe(1);
      expect(firstElement.item).toBeDefined();
      expect(firstElement.item['@type']).toBe('ImageObject');
      expect(firstElement.item.name).toBe(mockItem.name);
    });

    it('should handle missing collection description', () => {
      const collectionWithoutDesc = { ...mockCollection, description: undefined };
      const schema = generateCollectionListingSchema({
        collection: collectionWithoutDesc,
        username,
        items: [mockItem],
        baseUrl,
      });

      expect(schema.description).toBeUndefined();
    });
  });
});
