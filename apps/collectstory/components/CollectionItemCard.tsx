import { Tag } from '@dezkareid/components/react-server';
import { CloudinaryImage } from '@/src/shared/ui/CloudinaryImage';
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
    <article className={styles['collection-item-card']} aria-label={name}>
      <div className={styles['collection-item-card__image-wrapper']}>
        {imageUrl
          ? (
              <CloudinaryImage
                src={imageUrl}
                alt={name}
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 300px"
                className={styles['collection-item-card__image']}
              />
            )
          : (
              <div className={styles['collection-item-card__image-placeholder']} aria-hidden="true">
                <span className={styles['collection-item-card__placeholder-icon']}>◻</span>
              </div>
            )}
      </div>

      <div className={styles['collection-item-card__body']}>
        <h3 className={styles['collection-item-card__name']}>{name}</h3>

        {hasTags && (
          <ul className={styles['collection-item-card__tags']} role="list" aria-label="Tags">
            {brand && (
              <li>
                <Tag>{brand}</Tag>
              </li>
            )}
            {line && (
              <li>
                <Tag variant="default">{line}</Tag>
              </li>
            )}
            {category && (
              <li>
                <Tag variant="default">{category}</Tag>
              </li>
            )}
          </ul>
        )}

        {description && (
          <p className={`${styles['collection-item-card__description']} u-truncate-2`}>{description}</p>
        )}

        {dateAcquired && (
          <time className={styles['collection-item-card__date']} dateTime={dateAcquired}>
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
