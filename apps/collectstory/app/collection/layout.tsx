import styles from './layout.module.css';

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.shell}>{children}</div>;
}
