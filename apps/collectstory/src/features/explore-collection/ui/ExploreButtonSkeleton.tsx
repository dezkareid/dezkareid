import styles from './ExploreButton.module.css';

export function ExploreButtonSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true" />
  );
}
