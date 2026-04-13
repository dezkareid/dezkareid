'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LikeButton as LikeButtonPrimitive } from '@dezkareid/components/react-client';
import { likeItem, unlikeItem } from '@/app/[locale]/[username]/[collectionSlug]/actions';
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
          await likeItem(itemId);
          track({
            action: 'like_item',
            category: 'engagement',
            label: itemId,
          });
        }
        else {
          await unlikeItem(itemId);
          track({
            action: 'unlike_item',
            category: 'engagement',
            label: itemId,
          });
        }
      }
      catch (error) {
        // Revert on error
        setLiked(!nextLiked);
        setCount(previous => (nextLiked ? previous - 1 : previous + 1));
        console.error('Failed to update like status:', error);
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
        aria-label="Like item"
      />
      <span className={styles['like-button__count']}>{count}</span>
    </div>
  );
}
