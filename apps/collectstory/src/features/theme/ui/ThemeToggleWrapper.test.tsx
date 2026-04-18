import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/src/shared/lib/testing/render';
import { ThemeToggleWrapper } from './ThemeToggleWrapper';

// Mocking @dezkareid/components
vi.mock('@dezkareid/components/react-client', () => ({
  ThemeToggle: ({ cssProcessor }: { cssProcessor: string }) => (
    <div data-testid="theme-toggle" data-processor={cssProcessor}>
      Theme Toggle
    </div>
  ),
}));

describe('ThemeToggleWrapper', () => {
  it('should render the ThemeToggle component with lightningcss processor', () => {
    render(<ThemeToggleWrapper />);

    const toggle = screen.getByTestId('theme-toggle');
    expect(toggle).toBeInTheDocument();
    expect(toggle.dataset.processor).toBe('lightningcss');
  });
});
