import { sendGAEvent } from '@next/third-parties/google';

/**
 * Standard G4 event types for the Collecstory application.
 */
export type AnalyticsEvent
  = | { action: 'share'; category: 'social'; label: string; platform: string }
    | { action: 'cta_click'; category: 'interaction'; label: string }
    | { action: 'onboarding_start'; category: 'onboarding'; label: 'quick_start' }
    | { action: 'onboarding_complete'; category: 'onboarding'; label: 'quick_start' }
    | { action: 'page_view'; category: 'navigation'; label: string };

/**
 * Dispatches a custom GA event.
 * Wraps @next/third-parties/google sendGAEvent to provide better typing.
 */
export function trackEvent(event: AnalyticsEvent, userId?: string) {
  const eventData = {
    ...event,
    user_id: userId,
  };

  sendGAEvent('event', event.action, eventData);
}
