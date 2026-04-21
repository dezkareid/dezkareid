import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFoundPage from './not-found';
import GlobalErrorPage from './error';
import React from 'react';

// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

vi.mock('next-intl/server', () => ({
  getTranslations: (ns: string) => Promise.resolve((key: string) => `${ns}.${key}`),
}));

vi.mock('@/app/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/test',
}));

vi.mock('@/src/shared/lib/analytics/useAnalytics', () => ({
  useAnalytics: () => ({ track: vi.fn() }),
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    },
  }),
}));

describe('Error Pages', () => {
  describe('NotFound', () => {
    it('renders the 404 page with correct translations', async () => {
      render(await NotFoundPage());

      expect(screen.getByText('Errors.NotFound.title')).toBeInTheDocument();
      expect(screen.getByText('Errors.NotFound.subtitle')).toBeInTheDocument();
      expect(screen.getByText('Errors.NotFound.description')).toBeInTheDocument();
      expect(screen.getByText('Errors.NotFound.back_to_home')).toBeInTheDocument();
    });
  });

  describe('Error (500)', () => {
    it('renders the 500 page with correct translations', () => {
      const mockReset = vi.fn();
      const mockError = new Error('Test error') as unknown as Error & { digest?: string };

      render(<GlobalErrorPage error={mockError} reset={mockReset} />);
      expect(screen.getByText('Errors.ServerError.title')).toBeInTheDocument();
      expect(screen.getByText('Errors.ServerError.subtitle')).toBeInTheDocument();
      expect(screen.getByText('Errors.ServerError.description')).toBeInTheDocument();
      expect(screen.getByText('Errors.ServerError.retry')).toBeInTheDocument();
      expect(screen.getByText('Errors.ServerError.back_to_home')).toBeInTheDocument();
    });
  });
});
