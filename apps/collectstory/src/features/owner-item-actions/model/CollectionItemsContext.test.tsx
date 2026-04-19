import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/react';
import { CollectionItemsProvider, useCollectionItems } from './CollectionItemsContext';
import type { CollectionPageData, CollectionAuthData, CollectionOwnerItem } from '@/app/[locale]/[username]/[collectionSlug]/actions';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeItem(id: string, name = `Item ${id}`): CollectionOwnerItem {
  return {
    id,
    name,
    slug: `item-${id}`,
    image_url: null,
    description: null,
    date_acquired: null,
    likes_count: 0,
    visibility: 'public',
    franchise_id: null,
    variant: null,
    lines: null,
  };
}

const BASE_PAGE_DATA: CollectionPageData = {
  username: 'testuser',
  collection: { id: 'col-1', name: 'Test Collection', slug: 'test-collection', description: undefined },
  collectionUserId: 'user-1',
  items: [],
  total_count: 0,
  isPrivate: false,
  isAuthenticated: false,
  isOwner: false,
  ownerData: null,
};

// ─── Test consumer ────────────────────────────────────────────────────────────

type Capture = ReturnType<typeof useCollectionItems>;

function Consumer({ onCapture }: { onCapture: (context: Capture) => void }) {
  const context = useCollectionItems();
  onCapture(context);
  return null;
}

function renderWithProvider(pageData = BASE_PAGE_DATA) {
  let captured: Capture = undefined as unknown as Capture;

  render(
    <CollectionItemsProvider pageData={pageData}>
      <Consumer onCapture={(context) => { captured = context; }} />
    </CollectionItemsProvider>,
  );

  return { get: () => captured };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CollectionItemsContext', () => {
  describe('initial state', () => {
    it('starts with empty ownerItems', () => {
      const { get } = renderWithProvider();
      expect(get().ownerItems).toEqual([]);
    });

    it('exposes the initial pageData', () => {
      const { get } = renderWithProvider();
      expect(get().pageData.username).toBe('testuser');
      expect(get().pageData.isOwner).toBe(false);
    });
  });

  describe('setAuthData', () => {
    it('merges auth fields into pageData', () => {
      const { get } = renderWithProvider();

      const auth: CollectionAuthData = {
        isAuthenticated: true,
        isOwner: true,
        ownerData: { items: [makeItem('a')], brands: [], franchises: [] },
      };

      act(() => get().setAuthData(auth));

      expect(get().pageData.isAuthenticated).toBe(true);
      expect(get().pageData.isOwner).toBe(true);
    });

    it('populates ownerItems from ownerData', () => {
      const { get } = renderWithProvider();
      const items = [makeItem('a'), makeItem('b')];

      act(() => get().setAuthData({ isAuthenticated: true, isOwner: true, ownerData: { items, brands: [], franchises: [] } }));

      expect(get().ownerItems).toHaveLength(2);
      expect(get().ownerItems.map(item => item.id)).toEqual(['a', 'b']);
    });

    it('clears ownerItems when ownerData is null', () => {
      const { get } = renderWithProvider();
      act(() => get().setAuthData({ isAuthenticated: true, isOwner: true, ownerData: { items: [makeItem('a')], brands: [], franchises: [] } }));
      act(() => get().setAuthData({ isAuthenticated: true, isOwner: false, ownerData: null }));
      expect(get().ownerItems).toEqual([]);
    });
  });

  describe('addItems', () => {
    it('prepends new items before existing ones', () => {
      const { get } = renderWithProvider();
      act(() => get().setAuthData({ isAuthenticated: true, isOwner: true, ownerData: { items: [makeItem('a'), makeItem('b')], brands: [], franchises: [] } }));

      act(() => get().addItems([makeItem('c', 'Item C')]));

      expect(get().ownerItems.map(item => item.id)).toEqual(['c', 'a', 'b']);
    });

    it('updates an existing item in place without removing others', () => {
      const { get } = renderWithProvider();
      act(() => get().setAuthData({
        isAuthenticated: true,
        isOwner: true,
        ownerData: { items: [makeItem('a'), makeItem('b'), makeItem('c')], brands: [], franchises: [] },
      }));

      const updated = makeItem('b', 'Updated B');
      act(() => get().addItems([updated]));

      expect(get().ownerItems).toHaveLength(3);
      expect(get().ownerItems.find(item => item.id === 'b')?.name).toBe('Updated B');
      expect(get().ownerItems.find(item => item.id === 'a')).toBeDefined();
      expect(get().ownerItems.find(item => item.id === 'c')).toBeDefined();
    });

    it('preserves order of existing items after update', () => {
      const { get } = renderWithProvider();
      act(() => get().setAuthData({
        isAuthenticated: true,
        isOwner: true,
        ownerData: { items: [makeItem('a'), makeItem('b'), makeItem('c')], brands: [], franchises: [] },
      }));

      act(() => get().addItems([makeItem('b', 'Updated B')]));

      expect(get().ownerItems.map(item => item.id)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('removeItem', () => {
    it('removes the item with the given id', () => {
      const { get } = renderWithProvider();
      act(() => get().setAuthData({
        isAuthenticated: true,
        isOwner: true,
        ownerData: { items: [makeItem('a'), makeItem('b'), makeItem('c')], brands: [], franchises: [] },
      }));

      act(() => get().removeItem('b'));

      expect(get().ownerItems.map(item => item.id)).toEqual(['a', 'c']);
    });

    it('is a no-op when the id does not exist', () => {
      const { get } = renderWithProvider();
      act(() => get().setAuthData({
        isAuthenticated: true,
        isOwner: true,
        ownerData: { items: [makeItem('a')], brands: [], franchises: [] },
      }));

      act(() => get().removeItem('nonexistent'));

      expect(get().ownerItems).toHaveLength(1);
    });
  });

  describe('rollbackTo', () => {
    it('restores the given snapshot', () => {
      const { get } = renderWithProvider();
      const snapshot = [makeItem('a'), makeItem('b')];
      act(() => get().setAuthData({
        isAuthenticated: true,
        isOwner: true,
        ownerData: { items: snapshot, brands: [], franchises: [] },
      }));

      act(() => get().removeItem('a'));
      expect(get().ownerItems).toHaveLength(1);

      act(() => get().rollbackTo(snapshot));
      expect(get().ownerItems.map(item => item.id)).toEqual(['a', 'b']);
    });
  });

  describe('useCollectionItems error boundary', () => {
    it('throws when used outside CollectionItemsProvider', () => {
      const consoleError = console.error;
      console.error = () => {};
      expect(() => render(<Consumer onCapture={() => {}} />)).toThrow('useCollectionItems must be used inside CollectionItemsProvider');
      console.error = consoleError;
    });
  });
});
