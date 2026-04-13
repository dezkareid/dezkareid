import type { HTMLAttributes, Ref } from 'react';
import cx from 'classnames';
import type { BreadcrumbProperties } from '../../shared/types/breadcrumb';
import styles from '../../css/breadcrumb.module.css';

export interface Properties extends BreadcrumbProperties, HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
}

export function Breadcrumb({ items, className, ariaLabel = 'Breadcrumb', ref, ...rest }: Properties) {
  return (
    <nav
      ref={ref}
      className={cx(styles.breadcrumb, className)}
      aria-label={ariaLabel}
      {...rest}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const key = `${item.label}-${index}`;

        return (
          <span key={key} style={{ display: 'contents' }}>
            {item.href && !isLast
              ? (
                  <a href={item.href} className={styles.breadcrumb__link}>
                    {item.label}
                  </a>
                )
              : (
                  <span className={cx(isLast && styles.breadcrumb__current)}>
                    {item.label}
                  </span>
                )}
            {!isLast && (
              <span className={styles.breadcrumb__separator} aria-hidden="true">
                /
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
