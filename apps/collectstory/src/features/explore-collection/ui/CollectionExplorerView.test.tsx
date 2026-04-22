import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { CollectionExplorerView } from './CollectionExplorerView';
import type { PublicItem } from '@/lib/collections';

const messages = {
  CollectionExplorer: {
    explore_button: 'Explore Collection',
    close_aria: 'Close explorer',
    prev_aria: 'Previous item',
    next_aria: 'Next item',
    counter: '{current} / {total}',
  },
};

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeItem(id: string): PublicItem {
  return {
    id,
    name: `Item ${id}`,
    slug: `item-${id}`,
    image_url: undefined,
    description: undefined,
    date_acquired: undefined,
    likes_count: 0,
    catalog_items: undefined,
    lines: undefined,
  };
}

function makeItems(count: number, startAt = 1): PublicItem[] {
  return Array.from({ length: count }, (_, index) => makeItem(String(startAt + index)));
}

const BASE_PROPS = {
  collectionId: 'col-1',
  username: 'dezkareid',
  collectionSlug: 'one-piece',
  isAuthenticated: false,
  isOwner: false,
  onClose: vi.fn(),
};

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@dezkareid/components/react', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  Image: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('@/src/features/like-item', () => ({
  LikeButton: () => <button type="button">Like</button>,
}));

vi.mock('@dezkareid/icons/react', () => ({
  Close: () => <span>Close</span>,
  ChevronLeft: () => <span>Prev</span>,
  ChevronRight: () => <span>Next</span>,
}));

// Track fetch calls
const fetchMock = vi.fn();
globalThis.fetch = fetchMock;

// createPortal renders inline in tests
vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom')>();
  return { ...actual, createPortal: (node: React.ReactNode) => node };
});

beforeEach(() => {
  fetchMock.mockReset();
  document.body.style.overflow = '';
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CollectionExplorerView — fetch guard', () => {
  describe('when isOwner is true', () => {
    it('does not fetch additional pages even when totalItems > initialItems.length', async () => {
      // Owner may have private items making ownerItems.length differ from totalItems,
      // but all items are already in initialItems from context — no fetch needed.
      await act(async () => {
        renderWithIntl(
          <CollectionExplorerView
            {...BASE_PROPS}
            isOwner={true}
            items={makeItems(22)}
            totalItems={22}
          />,
        );
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('shows total of 22 in the counter without fetching', async () => {
      await act(async () => {
        renderWithIntl(
          <CollectionExplorerView
            {...BASE_PROPS}
            isOwner={true}
            items={makeItems(22)}
            totalItems={22}
          />,
        );
      });

      // Explorer is a slideshow — only the current item is shown.
      // The counter reflects the total: "1 / 22".
      expect(screen.getByText('1 / 22')).toBeInTheDocument();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('when initialItems already covers all items (race condition fix)', () => {
    it('does not fetch when initialItems.length === totalItems, even with isOwner=false', async () => {
      // This was the exact bug: isOwner=false (Suspense not resolved yet) but
      // ownerItems already loaded all 22 items. Explorer must not fetch page 2.
      await act(async () => {
        renderWithIntl(
          <CollectionExplorerView
            {...BASE_PROPS}
            isOwner={false}
            items={makeItems(22)}
            totalItems={22}
          />,
        );
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('does not fetch when initialItems.length > totalItems', async () => {
      await act(async () => {
        renderWithIntl(
          <CollectionExplorerView
            {...BASE_PROPS}
            isOwner={false}
            items={makeItems(25)}
            totalItems={22}
          />,
        );
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('when visitor has more items than the first page', () => {
    it('fetches page 2 when totalItems spans two pages', async () => {
      const page2Items = makeItems(2, 21);
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: page2Items }),
      });

      await act(async () => {
        renderWithIntl(
          <CollectionExplorerView
            {...BASE_PROPS}
            isOwner={false}
            items={makeItems(20)}
            totalItems={22}
          />,
        );
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
      );
    });

    it('fetches pages 2 and 3 when totalItems spans three pages', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ data: makeItems(20, 21) }),
      });

      await act(async () => {
        renderWithIntl(
          <CollectionExplorerView
            {...BASE_PROPS}
            isOwner={false}
            items={makeItems(20)}
            totalItems={60}
          />,
        );
      });

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('page=2'));
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('page=3'));
    });

    it('appends fetched items to the list', async () => {
      const page2Items = makeItems(2, 21);
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: page2Items }),
      });

      await act(async () => {
        renderWithIntl(
          <CollectionExplorerView
            {...BASE_PROPS}
            isOwner={false}
            items={makeItems(20)}
            totalItems={22}
          />,
        );
      });

      // Counter should reflect all 22 items once fetch completes
      expect(screen.getByText(/22/)).toBeInTheDocument();
    });
  });

  describe('React StrictMode double-invoke guard', () => {
    it('does not double-append items when effect runs twice (StrictMode simulation)', async () => {
      // StrictMode mounts → unmounts → remounts, triggering the effect twice.
      // The cleanup cancellation must prevent the first fetch from appending after remount.
      const page2Items = makeItems(2, 21);
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ data: page2Items }),
      });

      await act(async () => {
        renderWithIntl(
          <CollectionExplorerView
            {...BASE_PROPS}
            isOwner={false}
            items={makeItems(20)}
            totalItems={22}
          />,
        );
      });

      // Even if fetch was called twice (StrictMode), the counter must not exceed 22
      const counter = screen.getByText(/\/ 22/);
      expect(counter).toBeInTheDocument();
      expect(screen.queryByText(/\/ 24/)).not.toBeInTheDocument();
    });
  });

  describe('when collection fits in a single page', () => {
    it('does not fetch when totalItems <= 20', async () => {
      await act(async () => {
        renderWithIntl(
          <CollectionExplorerView
            {...BASE_PROPS}
            isOwner={false}
            items={makeItems(15)}
            totalItems={15}
          />,
        );
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
