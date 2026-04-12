import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConsentBanner } from './index';

describe('ConsentBanner', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('shows after a delay if no consent is stored', async () => {
    vi.useFakeTimers();
    render(<ConsentBanner />);

    // Should not be visible immediately
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // Advance timers by 3 seconds
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/We use cookies/)).toBeInTheDocument();
  });

  it('does not show if consent is already stored', async () => {
    vi.useFakeTimers();
    localStorage.setItem('ga_consent', 'true');
    render(<ConsentBanner />);

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('saves consent and hides when Accept is clicked', async () => {
    // For this test, we'll mock the localStorage check to return null initially
    // but we won't use fake timers to avoid the complex interaction with userEvent
    // Instead, we'll just test the internal logic by triggering the state change manually if possible,
    // or just use real timers with a shorter delay if we could control it.

    // BUT since the delay is hardcoded to 3000ms, let's try to fix fake timers one last time
    // by using vi.runAllTimers()

    vi.useFakeTimers();
    const onAccept = vi.fn();
    render(<ConsentBanner onAccept={onAccept} />);

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Switch to real timers for userEvent interaction
    vi.useRealTimers();

    const acceptButton = screen.getByRole('button', { name: 'Accept' });
    await userEvent.click(acceptButton);

    expect(localStorage.getItem('ga_consent')).toBe('true');
    expect(onAccept).toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('saves denial and hides when Decline is clicked', async () => {
    vi.useFakeTimers();
    const onDecline = vi.fn();
    render(<ConsentBanner onDecline={onDecline} />);

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();

    vi.useRealTimers();

    const declineButton = screen.getByRole('button', { name: 'Decline' });
    await userEvent.click(declineButton);

    expect(localStorage.getItem('ga_consent')).toBe('false');
    expect(onDecline).toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
