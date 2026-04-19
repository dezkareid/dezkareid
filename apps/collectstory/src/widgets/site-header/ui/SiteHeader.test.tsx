import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/src/shared/lib/testing/render';
import { SiteHeader } from './SiteHeader';

// Mocking features and icons
vi.mock('@/src/features/theme', () => ({ ThemeToggleWrapper: () => <div data-testid="theme-toggle" /> }));
vi.mock('@/src/features/language-switcher', () => ({ LanguageSwitcher: () => <div data-testid="language-switcher" /> }));

vi.mock('@dezkareid/icons/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@dezkareid/icons/react')>();
  return {
    ...actual,
    Shelves: () => <div data-testid="icon-shelves" />,
    Box: () => <div data-testid="icon-box" />,
  };
});

// Mocking the internal async component to avoid jsdom warnings
vi.mock('./HeaderAuthSlot', () => ({
  HeaderAuthSlot: () => <div data-testid="auth-slot" />,
}));

vi.mock('./HeaderAuthFallback', () => ({
  HeaderAuthFallback: () => <div data-testid="auth-fallback" />,
}));

describe('SiteHeader', () => {
  it('should render the brand and auth slot', () => {
    render(<SiteHeader />);

    expect(screen.getByLabelText('Collectstory home')).toBeInTheDocument();
    expect(screen.getByTestId('icon-shelves')).toBeInTheDocument();
    expect(screen.getByTestId('auth-slot')).toBeInTheDocument();
  });
});
