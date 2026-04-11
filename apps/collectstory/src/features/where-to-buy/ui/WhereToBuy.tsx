import styles from './WhereToBuy.module.css';

interface StoreItem {
  id: string;
  name: string;
  city: string | null;
  country: string | null;
  url: string | null;
}

interface WhereToBuyProperties {
  stores: StoreItem[];
}

export function WhereToBuy({ stores }: WhereToBuyProperties) {
  if (stores.length === 0) return;

  return (
    <section className={styles['where-to-buy']} aria-label="Where to buy">
      <h2 className={styles['where-to-buy__heading']}>Where to buy</h2>
      <ul className={styles['where-to-buy__list']}>
        {stores.map((store) => {
          const location = [store.city, store.country].filter(Boolean).join(', ');
          return (
            <li key={store.id} className={styles['where-to-buy__item']}>
              <div className={styles['where-to-buy__store-info']}>
                <span className={styles['where-to-buy__store-name']}>{store.name}</span>
                {location && (
                  <span className={styles['where-to-buy__store-location']}>{location}</span>
                )}
              </div>
              {store.url && (
                <a
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['where-to-buy__link']}
                  aria-label={`Visit ${store.name}`}
                >
                  Visit Store
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
