import Image from 'next/image';
import Link from 'next/link';
import { Tag } from '@dezkareid/components/react-server';
import type { StoreDetailItem } from '@/lib/stores';
import styles from './StoreItemCard.module.css';

type Properties = {
  item: StoreDetailItem;
  locale: string;
};

export function StoreItemCard({ item, locale }: Properties) {
  const catalogHref = `/${locale}/catalog/${item.slug}`;

  const inner = (
    <>
      <div className={styles['store-item-card__image-wrapper']}>
        {item.image_url
          ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 220px"
                className={styles['store-item-card__image']}
              />
            )
          : (
              <div className={styles['store-item-card__image-placeholder']} aria-hidden="true">◻</div>
            )}
      </div>

      <div className={styles['store-item-card__body']}>
        <p className={styles['store-item-card__name']}>{item.name}</p>
        {item.franchise && (
          <div className={styles['store-item-card__footer']}>
            <Tag variant="default">
              {item.franchise.name}
            </Tag>
          </div>
        )}
      </div>
    </>
  );

  if (item.product_url) {
    return (
      <a
        href={item.product_url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles['store-item-card']}
        aria-label={`${item.name} — buy at store`}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={catalogHref} className={styles['store-item-card']} aria-label={item.name}>
      {inner}
    </Link>
  );
}
