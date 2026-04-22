'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LikeButton as LikeButtonPrimitive } from '@dezkareid/components/react-client';
import { likeSession, unlikeSession } from '@/app/[locale]/[username]/sessions/[sessionSlug]/actions';
import { useAnalytics } from '@/src/shared/lib/analytics/useAnalytics';
import styles from './SessionLikeButton.module.css';

type Properties = {
  sessionId: string;
  username: string;
  sessionSlug: string;
  initialCount: number;
  initialLiked: boolean;
  isAuthenticated: boolean;
};

export function SessionLikeButton({
  sessionId,
  username,
  sessionSlug,
  initialCount,
  initialLiked,
  isAuthenticated,
}: Properties) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [animating, setAnimating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const { track } = useAnalytics();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`);
      return;
    }

    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount(previous => (nextLiked ? previous + 1 : previous - 1));

    if (nextLiked) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 450);
    }

    startTransition(async () => {
      try {
        if (nextLiked) {
          await likeSession(username, sessionSlug, sessionId);
          track({ action: 'like_session', category: 'engagement', label: sessionId });
        }
        else {
          await unlikeSession(username, sessionSlug, sessionId);
          track({ action: 'unlike_session', category: 'engagement', label: sessionId });
        }
      }
      catch {
        setLiked(!nextLiked);
        setCount(previous => (nextLiked ? previous - 1 : previous + 1));
      }
    });
  };

  return (
    <div className={styles['like-button-wrapper']}>
      <LikeButtonPrimitive
        active={liked}
        onClick={handleClick}
        disabled={isPending}
        animating={animating}
        aria-label="Like session"
      />
      <span className={styles['like-button__count']}>{count}</span>
    </div>
  );
}
