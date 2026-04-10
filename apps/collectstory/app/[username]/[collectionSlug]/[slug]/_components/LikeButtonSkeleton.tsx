import styles from '../page.module.css';

type Properties = {
  count: number;
};

export function LikeButtonSkeleton({ count }: Properties) {
  return (
    <div className={styles['item-page__like-skeleton']} aria-hidden="true">
      {/* TODO(design-system): needs tokens --color-like-gradient-from (rose-500 #f43f6e) and --color-like-gradient-to (orange-400 #fb923c) */}
      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="like-skeleton-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f6e" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>
        <path fill="url(#like-skeleton-gradient)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span>{count}</span>
    </div>
  );
}
