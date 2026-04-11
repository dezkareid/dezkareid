'use client';

import { useState, useTransition } from 'react';
import styles from './CatalogItemStoreManager.module.css';

interface StoreRow {
  id: string;
  name: string;
  city: string | null;
  country: string | null;
}

interface CatalogItemStoreManagerProperties {
  linkedStores: StoreRow[];
  availableStores: StoreRow[];
  addStoreAction: (storeId: string) => Promise<{ success: true } | { error: string }>;
  removeStoreAction: (storeId: string) => Promise<{ success: true } | { error: string }>;
}

function storeLabel(store: StoreRow): string {
  const location = [store.city, store.country].filter(Boolean).join(', ');
  return location ? `${store.name} (${location})` : store.name;
}

export function CatalogItemStoreManager({
  linkedStores: initialLinkedStores,
  availableStores: initialAvailableStores,
  addStoreAction,
  removeStoreAction,
}: CatalogItemStoreManagerProperties) {
  const [linkedStores, setLinkedStores] = useState(initialLinkedStores);
  const [availableStores, setAvailableStores] = useState(initialAvailableStores);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  const filteredAvailable = search.trim()
    ? availableStores.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
        || s.city?.toLowerCase().includes(search.toLowerCase())
        || s.country?.toLowerCase().includes(search.toLowerCase()),
      )
    : availableStores;

  function handleAdd(store: StoreRow) {
    setError(undefined);
    startTransition(async () => {
      const result = await addStoreAction(store.id);
      if ('error' in result) {
        setError(result.error);
        return;
      }
      setLinkedStores(previous => [...previous, store].toSorted((a, b) => a.name.localeCompare(b.name)));
      setAvailableStores(previous => previous.filter(s => s.id !== store.id));
      setSearch('');
    });
  }

  function handleRemove(store: StoreRow) {
    setError(undefined);
    startTransition(async () => {
      const result = await removeStoreAction(store.id);
      if ('error' in result) {
        setError(result.error);
        return;
      }
      setAvailableStores(previous => [...previous, store].toSorted((a, b) => a.name.localeCompare(b.name)));
      setLinkedStores(previous => previous.filter(s => s.id !== store.id));
    });
  }

  return (
    <div className={styles.container}>
      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.section}>
        <h3 className={styles.sectionHeading}>Linked stores</h3>
        {linkedStores.length === 0
          ? <p className={styles.empty}>No stores linked yet.</p>
          : (
              <ul className={styles.list}>
                {linkedStores.map(store => (
                  <li key={store.id} className={styles.listItem}>
                    <span className={styles.storeName}>{storeLabel(store)}</span>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemove(store)}
                      disabled={pending}
                      aria-label={`Remove ${store.name}`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
      </div>

      {availableStores.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Add store</h3>
          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Filter stores…"
            className={styles.searchInput}
            aria-label="Filter available stores"
          />
          {filteredAvailable.length > 0
            ? (
                <ul className={styles.list}>
                  {filteredAvailable.map(store => (
                    <li key={store.id} className={styles.listItem}>
                      <span className={styles.storeName}>{storeLabel(store)}</span>
                      <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => handleAdd(store)}
                        disabled={pending}
                        aria-label={`Add ${store.name}`}
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              )
            : <p className={styles.empty}>No matching stores.</p>}
        </div>
      )}
    </div>
  );
}
