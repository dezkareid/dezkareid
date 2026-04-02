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
  const hasTags = brand ?? line ?? category;

  return (
    <article className={styles.card} aria-label={name}>
      <div className={styles.imageWrapper}>
        {imageUrl
          ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 300px"
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
        <h3 className={styles.name}>{name}</h3>

        {hasTags && (
          <ul className={styles.tags} role="list" aria-label="Tags">
            {brand && (
              <li className={styles.tag}>{brand}</li>
            )}
            {line && (
              <li className={styles.tagSecondary}>{line}</li>
            )}
            {category && (
              <li className={styles.tagSecondary}>{category}</li>
            )}
          </ul>
        )}

        {description && (
          <p className={`${styles.description} u-truncate-2`}>{description}</p>
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
