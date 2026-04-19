import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import { trackEvent } from './events';
import { sha256 } from './hash';

let authChangeCallback: (event: string, session: { user: { id: string } } | undefined) => void;

const mockSupabase = {
  auth: {
    getUser: vi.fn(async () => ({ data: { user: { id: 'user-123' } } })),
    onAuthStateChange: vi.fn((callback) => {
      authChangeCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    }),
  },
};

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => mockSupabase),
}));

vi.mock('./events', () => ({
  trackEvent: vi.fn(),
}));

vi.mock('./hash', () => ({
  sha256: vi.fn(async (id: string) => `hashed-${id}`),
}));

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  it('should not track if consent is not granted', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue('false');

    const { result } = renderHook(() => useAnalytics());

    await waitFor(() => {
      expect(result.current.track).toBeDefined();
    });

    act(() => {
      result.current.track({ action: 'cta_click', category: 'interaction', label: 'test' });
    });

    expect(trackEvent).not.toHaveBeenCalled();
  });

  it('should track if consent is granted', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue('true');

    const { result } = renderHook(() => useAnalytics());

    // Wait for initial user hash to be set
    await waitFor(() => {
      expect(sha256).toHaveBeenCalledWith('user-123');
    });

    act(() => {
      result.current.track({ action: 'cta_click', category: 'interaction', label: 'test' });
    });

    expect(trackEvent).toHaveBeenCalledWith(
      { action: 'cta_click', category: 'interaction', label: 'test' },
      'hashed-user-123',
    );
  });

  it('should update hashed user ID on auth state change', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue('true');
    const { result } = renderHook(() => useAnalytics());

    // Wait for initial user hash
    await waitFor(() => {
      expect(sha256).toHaveBeenCalledWith('user-123');
    });

    vi.clearAllMocks();

    // Simulate login of a different user
    await act(async () => {
      authChangeCallback('SIGNED_IN', { user: { id: 'user-456' } });
    });

    // Wait for the update
    await waitFor(() => {
      expect(sha256).toHaveBeenCalledWith('user-456');
    });

    // Try tracking - should eventually use the new hash
    await waitFor(() => {
      act(() => {
        result.current.track({ action: 'cta_click', category: 'interaction', label: 'test' });
      });
      // Look at ALL calls, check if AT LEAST ONE has the right hash
      const calls = vi.mocked(trackEvent).mock.calls;
      const lastCall = calls.at(-1)!;
      expect(lastCall[1]).toBe('hashed-user-456');
    }, { timeout: 2000 });

    vi.clearAllMocks();

    // Simulate logout
    await act(async () => {
      authChangeCallback('SIGNED_OUT', undefined);
    });

    await waitFor(() => {
      act(() => {
        result.current.track({ action: 'cta_click', category: 'interaction', label: 'logout-test' });
      });
      const calls = vi.mocked(trackEvent).mock.calls;
      const lastCall = calls.at(-1)!;
      expect(lastCall[1]).toBeUndefined();
    });
  });
});
