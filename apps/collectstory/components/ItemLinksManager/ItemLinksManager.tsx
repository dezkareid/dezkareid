'use client';

import { useState, useTransition, useId } from 'react';
import { addItemLink, removeItemLink, type ItemLink } from '@/app/collection/actions';
import styles from './ItemLinksManager.module.css';

type Properties = {
  itemId: string;
  initialLinks: ItemLink[];
};

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:';
  }
  catch {
    return false;
  }
}

function truncateUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname === '/' ? '' : parsed.pathname;
    return `${parsed.hostname}${path}`.slice(0, 50);
  }
  catch {
    return url.slice(0, 50);
  }
}

export function ItemLinksManager({ itemId, initialLinks }: Properties) {
  const [links, setLinks] = useState<ItemLink[]>(initialLinks);
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [urlError, setUrlError] = useState<string>();
  const [actionError, setActionError] = useState<string>();
  const [, startTransition] = useTransition();

  const urlInputId = useId();
  const labelInputId = useId();
  const urlErrorId = useId();
  const actionErrorId = useId();

  function handleUrlChange(value: string) {
    setUrl(value);
    if (urlError && isValidUrl(value)) {
      setUrlError(undefined);
    }
  }

  function handleAdd() {
    setActionError(undefined);
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setUrlError('URL is required.');
      return;
    }
    if (!isValidUrl(trimmedUrl)) {
      setUrlError('Please enter a valid URL (e.g. https://example.com).');
      return;
    }
    setUrlError(undefined);

    startTransition(async () => {
      const result = await addItemLink(itemId, trimmedUrl, label.trim() || undefined);
      if ('error' in result) {
        setActionError(result.error);
        return;
      }
      const optimisticLink: ItemLink = {
        id: crypto.randomUUID(),
        item_id: itemId,
        url: trimmedUrl,
        label: label.trim() || undefined,
        created_at: new Date().toISOString(),
      };
      setLinks(previous => [...previous, optimisticLink]);
      setUrl('');
      setLabel('');
    });
  }

  function handleRemove(linkId: string) {
    setActionError(undefined);
    startTransition(async () => {
      const result = await removeItemLink(linkId);
      if ('error' in result) {
        setActionError(result.error);
        return;
      }
      setLinks(previous => previous.filter(l => l.id !== linkId));
    });
  }

  return (
    <div className={styles.manager}>
      {links.length > 0 && (
        <ul className={styles.linkList} role="list" aria-label="Links">
          {links.map(link => (
            <li key={link.id} className={styles.linkItem}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkAnchor}
              >
                {link.label || truncateUrl(link.url)}
              </a>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove(link.id)}
                aria-label={`Remove link${link.label ? ` "${link.label}"` : ''}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.addForm}>
        <div className={styles.fieldGroup}>
          <label htmlFor={urlInputId} className={styles.label}>
            URL
          </label>
          <input
            id={urlInputId}
            type="url"
            className={styles.input}
            placeholder="https://example.com"
            value={url}
            onChange={event => handleUrlChange(event.target.value)}
            aria-describedby={urlError ? urlErrorId : undefined}
            aria-invalid={urlError ? 'true' : undefined}
          />
          {urlError && (
            <p id={urlErrorId} className={styles.fieldError} role="alert">
              {urlError}
            </p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor={labelInputId} className={styles.label}>
            {'Label '}
            <span className={styles.optional}>(optional)</span>
          </label>
          <input
            id={labelInputId}
            type="text"
            className={styles.input}
            placeholder="e.g. Buy on eBay"
            value={label}
            onChange={event => setLabel(event.target.value)}
          />
        </div>

        <button
          type="button"
          className={styles.addButton}
          onClick={handleAdd}
          aria-describedby={actionError ? actionErrorId : undefined}
        >
          Add link
        </button>

        {actionError && (
          <p id={actionErrorId} className={styles.actionError} role="alert">
            {actionError}
          </p>
        )}
      </div>
    </div>
  );
}
