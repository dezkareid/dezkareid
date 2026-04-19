import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/src/shared/lib/testing/render';
import { HeaderTracker } from './HeaderTracker';
import { useAnalytics } from '@/src/shared/lib/analytics/useAnalytics';

vi.mock('@/src/shared/lib/analytics/useAnalytics', () => ({
  useAnalytics: vi.fn(),
}));

describe('HeaderTracker', () => {
  const mockTrack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAnalytics).mockReturnValue({ track: mockTrack });
  });

  it('should render children and track click events', () => {
    render(
      <HeaderTracker label="home">
        <button>Home Link</button>
      </HeaderTracker>,
    );

    const button = screen.getByText('Home Link');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(mockTrack).toHaveBeenCalledWith({
      action: 'cta_click',
      category: 'interaction',
      label: 'header_home',
    });
  });
});
