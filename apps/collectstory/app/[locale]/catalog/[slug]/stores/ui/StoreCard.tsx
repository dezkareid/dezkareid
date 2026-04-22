import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './StoreCard.module.css';

interface StoreCardProperties {
  store: {
    id: string;
    name: string;
    slug: string;
    city: string | null;
    logo_url: string | null;
    product_url: string | null;
  };
  locale: string;
}

export function StoreCard({ store, locale }: StoreCardProperties) {
  const t = useTranslations('Catalog.stores');
  const productUrlWithUtm = store.product_url
    ? `${store.product_url}${store.product_url.includes('?') ? '&' : '?'}utm_source=collectstory`
    : null;

  return (
    <div className={styles.card}>
      {productUrlWithUtm
        ? (
            <a
              href={productUrlWithUtm}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryLink}
            >
              <div className={styles.content}>
                <div className={styles.logoContainer}>
                  {store.logo_url
                    ? (
                        <Image
                          src={store.logo_url}
                          alt={store.name}
                          width={48}
                          height={48}
                          className={styles.logo}
                        />
                      )
                    : (
                        <div className={styles.logoPlaceholder}>{store.name.charAt(0)}</div>
                      )}
                </div>
                <div className={styles.info}>
                  <h3 className={styles.name}>
                    {productUrlWithUtm ? t('buy_in_store', { storeName: store.name }) : store.name}
                  </h3>
                  {store.city && <p className={styles.city}>{store.city}</p>}
                </div>
              </div>
            </a>
          )
        : (
            <div className={styles.content}>
              <div className={styles.logoContainer}>
                {store.logo_url
                  ? (
                      <Image
                        src={store.logo_url}
                        alt={store.name}
                        width={48}
                        height={48}
                        className={styles.logo}
                      />
                    )
                  : (
                      <div className={styles.logoPlaceholder}>{store.name.charAt(0)}</div>
                    )}
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{store.name}</h3>
                {store.city && <p className={styles.city}>{store.city}</p>}
              </div>
            </div>
          )}

      <div className={styles.actions}>
        <Link
          href={`/${locale}/stores/${store.slug}`}
          className={styles.secondaryButton}
        >
          {t('visit_store')}
        </Link>
      </div>
    </div>
  );
}
