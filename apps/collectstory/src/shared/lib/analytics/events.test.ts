import { describe, it, expect, vi } from 'vitest';
import { trackEvent } from './events';
import { sendGAEvent } from '@next/third-parties/google';

vi.mock('@next/third-parties/google', () => ({
  sendGAEvent: vi.fn(),
}));

describe('Analytics Events', () => {
  it('should call sendGAEvent with correctly typed event data', () => {
    const event = {
      action: 'cta_click' as const,
      category: 'interaction' as const,
      label: 'test_label',
    };

    trackEvent(event);

    expect(sendGAEvent).toHaveBeenCalledWith('event', 'cta_click', {
      ...event,
      user_id: undefined,
    });
  });

  it('should include hashed userId if provided', () => {
    const event = {
      action: 'share' as const,
      category: 'social' as const,
      label: 'test_share',
      platform: 'twitter',
    };
    const userId = 'hashed-user-id';

    trackEvent(event, userId);

    expect(sendGAEvent).toHaveBeenCalledWith('event', 'share', {
      ...event,
      user_id: userId,
    });
  });
});
