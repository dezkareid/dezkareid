import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock('@/app/[locale]/[username]/[collectionSlug]/actions', () => ({
  createCollectionItem: vi.fn().mockResolvedValue({ success: true }),
  checkSlugCollision: vi.fn().mockResolvedValue(null),
  getLinesByBrand: vi.fn().mockResolvedValue([]),
}));

vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: [], isFetching: false }),
}));

// ─── Imports after mocks ──────────────────────────────────────────────────────

import { checkSlugCollision } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import { AddItemForm } from './AddItemForm';

const mockCheckSlugCollision = vi.mocked(checkSlugCollision);

const BRANDS = [{ id: 'brand-1', name: 'Mattel' }];
const FRANCHISES = [{ id: 'fr-1', name: 'Masters of the Universe' }];

const BASE_PROPS = {
  brands: BRANDS,
  franchises: FRANCHISES,
  collectionId: 'col-1',
  username: 'testuser',
  collectionSlug: 'my-collection',
  onSuccess: vi.fn(),
};

describe('AddItemForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  describe('slug collision check', () => {
    it('runs collision check on submit when not editing', async () => {
      render(<AddItemForm {...BASE_PROPS} isEditing={false} />);

      await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Barbie');
      await userEvent.click(screen.getByRole('button', { name: /AddItemForm.submit_add/i }));

      expect(mockCheckSlugCollision).toHaveBeenCalledTimes(1);
    });

    it('skips collision check on submit when editing', async () => {
      const action = vi.fn().mockResolvedValue({ success: true });
      render(<AddItemForm {...BASE_PROPS} isEditing={true} action={action} />);

      await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Barbie');
      await userEvent.click(screen.getByRole('button', { name: /AddItemForm.submit_add/i }));

      expect(mockCheckSlugCollision).not.toHaveBeenCalled();
    });

    it('skips collision check by default when no isEditing prop is provided', async () => {
      // Default (add mode) should still check
      render(<AddItemForm {...BASE_PROPS} />);

      await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Barbie');
      await userEvent.click(screen.getByRole('button', { name: /AddItemForm.submit_add/i }));

      expect(mockCheckSlugCollision).toHaveBeenCalledTimes(1);
    });
  });
});
