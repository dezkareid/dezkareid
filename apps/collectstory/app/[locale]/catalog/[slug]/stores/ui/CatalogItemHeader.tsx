import Image from 'next/image';
import styles from './CatalogItemHeader.module.css';

interface CatalogItemHeaderProperties {
  item: {
    name: string;
    image_url: string | null;
    description: string | null;
  };
}

export function CatalogItemHeader({ item }: CatalogItemHeaderProperties) {
  return (
    <div className={styles.header}>
      <div className={styles.imageContainer}>
        {item.image_url
          ? (
              <Image
                src={item.image_url}
                alt={item.name}
                width={120}
                height={120}
                className={styles.image}
                priority
              />
            )
          : (
              <div className={styles.imagePlaceholder} aria-hidden="true">📦</div>
            )}
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>{item.name}</h1>
        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}
      </div>
    </div>
  );
}
