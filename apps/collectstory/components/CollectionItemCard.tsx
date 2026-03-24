import Image from 'next/image';
import styles from './CollectionItemCard.module.css';

type Properties = {
  name: string;
  imageUrl: string | undefined;
  brand: string | undefined;
  line: string | undefined;
  category: string | undefined;
  description: string | undefined;
  dateAcquired: string | undefined;
};

export function CollectionItemCard({
  name,
  imageUrl,
  brand,
  line,
  category,
  description,
  dateAcquired,
}: Properties) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        {imageUrl
          ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className={styles.image}
              />
            )
          : (
              <div className={styles.imagePlaceholder} aria-hidden="true">
                <span className={styles.placeholderIcon}>◻</span>
              </div>
            )}
      </div>

      <div className={styles.body}>
        <h2 className={styles.name}>{name}</h2>

        <div className={styles.tags}>
          {brand && (
            <span className={styles.tag}>{brand}</span>
          )}
          {line && (
            <span className={styles.tagSecondary}>{line}</span>
          )}
          {category && (
            <span className={styles.tagSecondary}>{category}</span>
          )}
        </div>

        {description && (
          <p className={styles.description}>{description}</p>
        )}

        {dateAcquired && (
          <time className={styles.date} dateTime={dateAcquired}>
            Acquired
            {' '}
            {new Date(dateAcquired).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        )}
      </div>
    </article>
  );
}
