'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@dezkareid/components/react-server';
import { likeItem, unlikeItem } from '@/app/[username]/[collectionSlug]/actions';
import { useAnalytics } from '@/src/shared/lib/analytics/useAnalytics';
import styles from './LikeButton.module.css';

type Properties = {
  itemId: string;
  initialCount: number;
  initialLiked: boolean;
  isAuthenticated: boolean;
};

export function LikeButton({
  itemId,
  initialCount,
  initialLiked,
  isAuthenticated,
}: Properties) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();
  const [animating, setAnimating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { track } = useAnalytics();

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    startTransition(async () => {
      if (liked) {
        const result = await unlikeItem(itemId);
        if ('success' in result) {
          setLiked(false);
          setCount(c => Math.max(0, c - 1));
          track({ action: 'unlike_item', category: 'engagement', label: itemId });
        }
      }
      else {
        const result = await likeItem(itemId);
        if ('success' in result) {
          setLiked(true);
          setAnimating(true);
          setCount(c => c + 1);
          track({ action: 'like_item', category: 'engagement', label: itemId });
        }
      }
    });
  };

  return (
    <Button
      variant="ghost"
      className={`${styles['like-button']} ${liked ? styles['like-button--liked'] : ''} ${isPending ? styles['like-button--pending'] : ''}`}
      onClick={handleClick}
      disabled={isPending}
      aria-label={liked ? 'Unlike item' : 'Like item'}
      aria-pressed={liked}
    >
      <span
        className={`${styles['like-button__icon']} ${animating ? styles['like-button__icon--pop'] : ''}`}
        onAnimationEnd={() => setAnimating(false)}
        aria-hidden="true"
      >
        {liked
          ? (
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* TODO(design-system): needs tokens --color-like-gradient-from (rose-500 #f43f6e) and --color-like-gradient-to (orange-400 #fb923c) */}
                  <linearGradient id="like-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f6e" />
                    <stop offset="100%" stopColor="#fb923c" />
                  </linearGradient>
                </defs>
                <path fill="url(#like-gradient)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )
          : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            )}
      </span>
      <span className={styles['like-button__count']}>{count}</span>
    </Button>
  );
}
