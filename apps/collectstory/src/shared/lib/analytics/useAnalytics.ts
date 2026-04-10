'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type AnalyticsEvent, trackEvent } from './events';
import { sha256 } from './hash';

/**
 * Hook for dispatching G4 analytics events with automatic user identification.
 *
 * @returns An object containing the track function
 */
export function useAnalytics() {
  const [hashedUserId, setHashedUserId] = useState<string | undefined>(undefined);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user?.id) {
        const hashed = await sha256(user.id);
        setHashedUserId(hashed);
      }
      else {
        setHashedUserId(undefined);
      }
    };

    fetchUser();

    // Listen for auth state changes to update the user ID
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user?.id) {
          const hashed = await sha256(session.user.id);
          setHashedUserId(hashed);
        }
        else {
          setHashedUserId(undefined);
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  /**
   * Dispatches a custom GA event with the current hashed user ID.
   */
  const track = useCallback((event: AnalyticsEvent) => {
    // In a real implementation, we would also check for consent here (Phase 4)
    const consent = globalThis.window === undefined ? false : localStorage.getItem('ga_consent') === 'true';

    if (consent) {
      trackEvent(event, hashedUserId);
    }
  }, [hashedUserId]);

  return { track };
}
