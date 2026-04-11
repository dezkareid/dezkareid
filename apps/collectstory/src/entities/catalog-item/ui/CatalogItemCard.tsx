import Link from 'next/link';
import Image from 'next/image';
import styles from './CatalogItemCard.module.css';

interface CatalogItemCardProperties {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  franchise_name?: string | null;
  line_name?: string | null;
}

export function CatalogItemCard({
  name,
  slug,
  image_url,
  franchise_name,
  line_name,
}: CatalogItemCardProperties) {
  const tags = [franchise_name, line_name].filter(Boolean) as string[];

  return (
    <Link href={`/catalog/${slug}`} className={styles['catalog-item-card']}>
      <div className={styles['catalog-item-card__image-wrapper']}>
        {image_url
          ? (
              <Image
                src={image_url}
                alt={name}
                width={400}
                height={400}
                className={styles['catalog-item-card__image']}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )
          : (
              <div className={styles['catalog-item-card__placeholder']} aria-hidden="true">
                📦
              </div>
            )}
      </div>
      <div className={styles['catalog-item-card__body']}>
        <h2 className={styles['catalog-item-card__name']}>{name}</h2>
        {tags.length > 0 && (
          <div className={styles['catalog-item-card__tags']}>
            {tags.map(tag => (
              <span key={tag} className={styles['catalog-item-card__tag']}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
