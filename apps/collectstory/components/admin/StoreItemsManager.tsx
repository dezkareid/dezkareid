'use client';

import { useState, useTransition, useId } from 'react';
import {
  addCatalogItemToStore,
  removeCatalogItemFromStore,
  updateCatalogItemStoreUrl,
} from '@/app/[locale]/admin/stores/actions';
import styles from './StoreItemsManager.module.css';

export type LinkedCatalogItem = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  product_url: string | null;
};

export type CatalogItemOption = {
  id: string;
  name: string;
  slug: string;
};

type Properties = {
  storeId: string;
  initialItems: LinkedCatalogItem[];
  allCatalogItems: CatalogItemOption[];
};

export function StoreItemsManager({ storeId, initialItems, allCatalogItems }: Properties) {
  const [items, setItems] = useState<LinkedCatalogItem[]>(initialItems);
  const [selectedId, setSelectedId] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState('');
  const [actionError, setActionError] = useState<string>();
  const [, startTransition] = useTransition();

  const selectId = useId();
  const newUrlId = useId();
  const errorId = useId();

  const linkedIds = new Set(items.map(index => index.id));
  const availableOptions = allCatalogItems.filter(c => !linkedIds.has(c.id));

  function handleAdd() {
    if (!selectedId) return;
    setActionError(undefined);

    startTransition(async () => {
      const result = await addCatalogItemToStore(storeId, selectedId, newUrl || undefined);
      if ('error' in result) {
        setActionError(result.error);
        return;
      }
      const added = allCatalogItems.find(c => c.id === selectedId);
      if (added) {
        setItems(previous => [
          ...previous,
          { id: added.id, name: added.name, slug: added.slug, image_url: null, product_url: newUrl.trim() || null },
        ]);
      }
      setSelectedId('');
      setNewUrl('');
    });
  }

  function handleRemove(catalogItemId: string) {
    setActionError(undefined);
    startTransition(async () => {
      const result = await removeCatalogItemFromStore(storeId, catalogItemId);
      if ('error' in result) {
        setActionError(result.error);
        return;
      }
      setItems(previous => previous.filter(index => index.id !== catalogItemId));
    });
  }

  function startEdit(item: LinkedCatalogItem) {
    setEditingId(item.id);
    setEditingUrl(item.product_url ?? '');
  }

  function handleSaveUrl(catalogItemId: string) {
    setActionError(undefined);
    startTransition(async () => {
      const result = await updateCatalogItemStoreUrl(storeId, catalogItemId, editingUrl);
      if ('error' in result) {
        setActionError(result.error);
        return;
      }
      setItems(previous =>
        previous.map(index =>
          index.id === catalogItemId ? { ...index, product_url: editingUrl.trim() || null } : index,
        ),
      );
      setEditingId(null);
    });
  }

  return (
    <div className={styles['store-items-manager']}>
      <h2 className={styles['store-items-manager__heading']}>Catalog Items</h2>

      {items.length > 0
        ? (
            <ul className={styles['store-items-manager__item-list']} role="list" aria-label="Linked catalog items">
              {items.map(item => (
                <li key={item.id} className={styles['store-items-manager__item']}>
                  <div className={styles['store-items-manager__item-body']}>
                    <span className={styles['store-items-manager__item-name']}>{item.name}</span>
                    {editingId === item.id
                      ? (
                          <div className={styles['store-items-manager__url-edit-row']}>
                            <input
                              type="url"
                              className={styles['store-items-manager__url-input']}
                              value={editingUrl}
                              onChange={event => setEditingUrl(event.target.value)}
                              placeholder="https://store.com/product"
                              aria-label={`Product URL for ${item.name}`}
                            />
                            <button
                              type="button"
                              className={styles['store-items-manager__save-button']}
                              onClick={() => handleSaveUrl(item.id)}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className={styles['store-items-manager__cancel-button']}
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        )
                      : (
                          <div className={styles['store-items-manager__url-row']}>
                            {item.product_url
                              ? (
                                  <a
                                    href={item.product_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles['store-items-manager__url-link']}
                                  >
                                    {item.product_url}
                                  </a>
                                )
                              : (
                                  <span className={styles['store-items-manager__url-missing']}>No product URL</span>
                                )}
                            <button
                              type="button"
                              className={styles['store-items-manager__edit-url-button']}
                              onClick={() => startEdit(item)}
                              aria-label={`Edit product URL for ${item.name}`}
                            >
                              Edit URL
                            </button>
                          </div>
                        )}
                  </div>
                  <button
                    type="button"
                    className={styles['store-items-manager__remove-button']}
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )
        : <p className={styles['store-items-manager__empty']}>No catalog items linked yet.</p>}

      <div className={styles['store-items-manager__add-section']}>
        <div className={styles['store-items-manager__add-row']}>
          <label htmlFor={selectId} className={styles['store-items-manager__sr-only']}>Add catalog item</label>
          <select
            id={selectId}
            className={styles['store-items-manager__select']}
            value={selectedId}
            onChange={event => setSelectedId(event.target.value)}
            aria-describedby={actionError ? errorId : undefined}
          >
            <option value="">Select an item to add…</option>
            {availableOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
        <div className={styles['store-items-manager__add-row']}>
          <label htmlFor={newUrlId} className={styles['store-items-manager__url-label']}>Product URL</label>
          <input
            id={newUrlId}
            type="url"
            className={styles['store-items-manager__url-input']}
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
            placeholder="https://store.com/product (optional)"
          />
        </div>
        <button
          type="button"
          className={styles['store-items-manager__add-button']}
          onClick={handleAdd}
          disabled={!selectedId}
        >
          Add Item
        </button>
      </div>

      {actionError && (
        <p id={errorId} className={styles['store-items-manager__error']} role="alert">{actionError}</p>
      )}
    </div>
  );
}
