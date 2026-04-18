import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSlugDisambiguation } from './useSlugDisambiguation';
import type { SlugOption } from './useSlugDisambiguation';

// Mock the server action module
vi.mock('@/app/[locale]/[username]/[collectionSlug]/actions', () => ({
  checkSlugCollision: vi.fn(),
}));

import { checkSlugCollision } from '@/app/[locale]/[username]/[collectionSlug]/actions';
const mockCheckSlugCollision = vi.mocked(checkSlugCollision);

const COLLECTION_ID = 'col-123';
const MOCK_OPTIONS: SlugOption[] = [
  { priority: 1, slug: 'barbie-masters-of-the-universe', label: 'name + line' },
  { priority: 7, slug: 'barbie-ab12c', label: 'name + ID' },
];

describe('useSlugDisambiguation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── initial state ────────────────────────────────────────────────────────

  describe('initial state', () => {
    it('starts with no slug options', () => {
      const { result } = renderHook(() => useSlugDisambiguation());
      expect(result.current.slugOptions).toBeNull();
    });

    it('starts with no selected slug', () => {
      const { result } = renderHook(() => useSlugDisambiguation());
      expect(result.current.selectedSlug).toBeNull();
    });

    it('needsSelection is false when no options', () => {
      const { result } = renderHook(() => useSlugDisambiguation());
      expect(result.current.needsSelection).toBe(false);
    });
  });

  // ─── checkCollision ───────────────────────────────────────────────────────

  describe('checkCollision', () => {
    it('returns null and sets no options when base slug is free', async () => {
      mockCheckSlugCollision.mockResolvedValue(null);
      const { result } = renderHook(() => useSlugDisambiguation());

      let returnValue: SlugOption[] | null = undefined as unknown as null;
      await act(async () => {
        returnValue = await result.current.checkCollision('barbie', COLLECTION_ID);
      });

      expect(returnValue).toBeNull();
      expect(result.current.slugOptions).toBeNull();
    });

    it('sets slugOptions when collision is detected', async () => {
      mockCheckSlugCollision.mockResolvedValue(MOCK_OPTIONS);
      const { result } = renderHook(() => useSlugDisambiguation());

      await act(async () => {
        await result.current.checkCollision('barbie', COLLECTION_ID);
      });

      expect(result.current.slugOptions).toEqual(MOCK_OPTIONS);
    });

    it('returns the options array on collision', async () => {
      mockCheckSlugCollision.mockResolvedValue(MOCK_OPTIONS);
      const { result } = renderHook(() => useSlugDisambiguation());

      let returnValue: SlugOption[] | null = null;
      await act(async () => {
        returnValue = await result.current.checkCollision('barbie', COLLECTION_ID);
      });

      expect(returnValue).toEqual(MOCK_OPTIONS);
    });

    it('resets selectedSlug when called again', async () => {
      mockCheckSlugCollision.mockResolvedValue(MOCK_OPTIONS);
      const { result } = renderHook(() => useSlugDisambiguation());

      await act(async () => {
        await result.current.checkCollision('barbie', COLLECTION_ID);
      });
      act(() => result.current.selectSlug('barbie-ab12c'));

      await act(async () => {
        await result.current.checkCollision('barbie', COLLECTION_ID);
      });

      expect(result.current.selectedSlug).toBeNull();
    });

    it.each([
      ['with line only', { lineName: 'Masters', variant: undefined, brandName: undefined }],
      ['with variant only', { lineName: undefined, variant: 'Red', brandName: undefined }],
      ['with line + variant', { lineName: 'Masters', variant: 'Red', brandName: undefined }],
      ['with brand only', { lineName: undefined, variant: undefined, brandName: 'Mattel' }],
      ['with all fields', { lineName: 'Masters', variant: 'Red', brandName: 'Mattel' }],
    ])('passes correct args to checkSlugCollision — %s', async (_label, { lineName, variant, brandName }) => {
      mockCheckSlugCollision.mockResolvedValue(null);
      const { result } = renderHook(() => useSlugDisambiguation());

      await act(async () => {
        await result.current.checkCollision('barbie', COLLECTION_ID, lineName, variant, brandName);
      });

      expect(mockCheckSlugCollision).toHaveBeenCalledWith(
        COLLECTION_ID, 'barbie', lineName, variant, brandName,
      );
    });
  });

  // ─── selectSlug ──────────────────────────────────────────────────────────

  describe('selectSlug', () => {
    it('sets selectedSlug', async () => {
      mockCheckSlugCollision.mockResolvedValue(MOCK_OPTIONS);
      const { result } = renderHook(() => useSlugDisambiguation());
      await act(async () => {
        await result.current.checkCollision('barbie', COLLECTION_ID);
      });

      act(() => result.current.selectSlug('barbie-ab12c'));

      expect(result.current.selectedSlug).toBe('barbie-ab12c');
    });

    it('sets needsSelection to false after selection', async () => {
      mockCheckSlugCollision.mockResolvedValue(MOCK_OPTIONS);
      const { result } = renderHook(() => useSlugDisambiguation());
      await act(async () => {
        await result.current.checkCollision('barbie', COLLECTION_ID);
      });

      act(() => result.current.selectSlug('barbie-ab12c'));

      expect(result.current.needsSelection).toBe(false);
    });
  });

  // ─── reset ───────────────────────────────────────────────────────────────

  describe('reset', () => {
    it('clears slugOptions', async () => {
      mockCheckSlugCollision.mockResolvedValue(MOCK_OPTIONS);
      const { result } = renderHook(() => useSlugDisambiguation());
      await act(async () => {
        await result.current.checkCollision('barbie', COLLECTION_ID);
      });

      act(() => result.current.reset());

      expect(result.current.slugOptions).toBeNull();
    });

    it('clears selectedSlug', async () => {
      mockCheckSlugCollision.mockResolvedValue(MOCK_OPTIONS);
      const { result } = renderHook(() => useSlugDisambiguation());
      await act(async () => {
        await result.current.checkCollision('barbie', COLLECTION_ID);
      });
      act(() => result.current.selectSlug('barbie-ab12c'));

      act(() => result.current.reset());

      expect(result.current.selectedSlug).toBeNull();
    });

    it('sets needsSelection to false', async () => {
      mockCheckSlugCollision.mockResolvedValue(MOCK_OPTIONS);
      const { result } = renderHook(() => useSlugDisambiguation());
      await act(async () => {
        await result.current.checkCollision('barbie', COLLECTION_ID);
      });

      act(() => result.current.reset());

      expect(result.current.needsSelection).toBe(false);
    });
  });

  // ─── needsSelection ───────────────────────────────────────────────────────

  describe('needsSelection', () => {
    it('is false when no options are set', () => {
      const { result } = renderHook(() => useSlugDisambiguation());
      expect(result.current.needsSelection).toBe(false);
    });

    it('is true when options are present and no slug is selected', async () => {
      mockCheckSlugCollision.mockResolvedValue(MOCK_OPTIONS);
      const { result } = renderHook(() => useSlugDisambiguation());

      await act(async () => {
        await result.current.checkCollision('barbie', COLLECTION_ID);
      });

      expect(result.current.needsSelection).toBe(true);
    });

    it('is false when options are present and a slug is selected', async () => {
      mockCheckSlugCollision.mockResolvedValue(MOCK_OPTIONS);
      const { result } = renderHook(() => useSlugDisambiguation());
      await act(async () => {
        await result.current.checkCollision('barbie', COLLECTION_ID);
      });

      act(() => result.current.selectSlug('barbie-ab12c'));

      expect(result.current.needsSelection).toBe(false);
    });
  });
});
