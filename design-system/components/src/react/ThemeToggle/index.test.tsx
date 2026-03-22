import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeToggle } from './index';

function mockMatchMedia(prefersDark: boolean) {
  Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
      media: query,
      onchange: undefined,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('color-scheme');
  mockMatchMedia(false);
});

describe('ThemeToggle', () => {
  it('renders a button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('initialises to light when localStorage is empty and OS preference is light', async () => {
    mockMatchMedia(false);
    await act(async () => {
      render(<ThemeToggle />);
    });
    expect(screen.getByRole('button')).toHaveTextContent('Light');
    expect(document.documentElement.getAttribute('color-scheme')).toBe('light');
  });

  it('initialises to dark from OS preference when localStorage is empty', async () => {
    mockMatchMedia(true);
    await act(async () => {
      render(<ThemeToggle />);
    });
    expect(screen.getByRole('button')).toHaveTextContent('Dark');
    expect(document.documentElement.getAttribute('color-scheme')).toBe('dark');
  });

  it('initialises from localStorage over OS preference', async () => {
    localStorage.setItem('color-scheme', 'dark');
    mockMatchMedia(false);
    await act(async () => {
      render(<ThemeToggle />);
    });
    expect(screen.getByRole('button')).toHaveTextContent('Dark');
  });

  it('toggles from light to dark on click', async () => {
    await act(async () => {
      render(<ThemeToggle />);
    });
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('Dark');
    expect(document.documentElement.getAttribute('color-scheme')).toBe('dark');
  });

  it('toggles from dark to light on click', async () => {
    localStorage.setItem('color-scheme', 'dark');
    await act(async () => {
      render(<ThemeToggle />);
    });
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('Light');
    expect(document.documentElement.getAttribute('color-scheme')).toBe('light');
  });

  it('persists theme to localStorage on toggle', async () => {
    await act(async () => {
      render(<ThemeToggle />);
    });
    await userEvent.click(screen.getByRole('button'));
    expect(localStorage.getItem('color-scheme')).toBe('dark');
  });

  it('sets aria-pressed to true when dark', async () => {
    localStorage.setItem('color-scheme', 'dark');
    await act(async () => {
      render(<ThemeToggle />);
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('sets aria-pressed to false when light', async () => {
    await act(async () => {
      render(<ThemeToggle />);
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('has aria-label "Switch to dark mode" when in light mode', async () => {
    await act(async () => {
      render(<ThemeToggle />);
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('has aria-label "Switch to light mode" after toggling to dark', async () => {
    await act(async () => {
      render(<ThemeToggle />);
    });
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('renders an aria-live polite region', async () => {
    await act(async () => {
      render(<ThemeToggle />);
    });
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('renders an SVG icon with aria-hidden', async () => {
    await act(async () => {
      render(<ThemeToggle />);
    });
    const svg = document.querySelector('svg[aria-hidden="true"]');
    expect(svg).toBeInTheDocument();
  });
});
