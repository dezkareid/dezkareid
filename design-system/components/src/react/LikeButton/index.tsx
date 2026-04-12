'use client';

import cx from 'classnames';
import { ActionToggle, type Properties as ActionToggleProperties } from '../ActionToggle';
import styles from '../../css/action-toggle.module.css';

export interface Properties extends Omit<ActionToggleProperties, 'children' | 'variant'> {
  animating?: boolean;
}

export function LikeButton({ className, animating, active, ...rest }: Properties) {
  return (
    <ActionToggle
      variant="like"
      className={className}
      active={active}
      {...rest}
    >
      <span
        className={cx(
          styles['action-toggle__icon'],
          animating && styles['action-toggle__icon--pop'],
        )}
      >
        {active
          ? (
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
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
    </ActionToggle>
  );
}
