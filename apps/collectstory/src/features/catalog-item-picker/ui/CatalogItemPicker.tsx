'use client';

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import type { CatalogItemSearchResult } from '../model/types';
import styles from './CatalogItemPicker.module.css';

interface CatalogItemPickerProperties {
  name?: string;
  defaultValue?: Pick<CatalogItemSearchResult, 'id' | 'name'>;
  label?: string;
}

function buildKeyDownHandler(
  open: boolean,
  results: CatalogItemSearchResult[],
  activeIndex: number,
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>,
  setOpen: (v: boolean) => void,
  onSelect: (item: CatalogItemSearchResult) => void,
) {
  return (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex(previous => Math.min(previous + 1, results.length - 1));
    }
    else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(previous => Math.max(previous - 1, 0));
    }
    else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      onSelect(results[activeIndex]);
    }
    else if (event.key === 'Escape') {
      setOpen(false);
    }
  };
}

function subtitleFor(item: CatalogItemSearchResult): string | undefined {
  const parts = [item.franchise_name, item.line_name].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : undefined;
}

function OptionItem({
  item,
  index,
  activeIndex,
  listboxId,
  onSelect,
  onHover,
}: {
  item: CatalogItemSearchResult;
  index: number;
  activeIndex: number;
  listboxId: string;
  onSelect: (item: CatalogItemSearchResult) => void;
  onHover: (index: number) => void;
}) {
  const subtitle = subtitleFor(item);
  return (
    <li
      key={item.id}
      id={`${listboxId}-option-${index}`}
      role="option"
      aria-selected={index === activeIndex}
      className={`${styles.option} ${index === activeIndex ? styles.optionActive : ''}`}
      onMouseDown={(event) => {
        event.preventDefault();
        onSelect(item);
      }}
      onMouseEnter={() => onHover(index)}
    >
      <span className={styles.optionName}>{item.name}</span>
      {subtitle && <span className={styles.optionSubtitle}>{subtitle}</span>}
    </li>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// eslint-disable-next-line complexity -- ARIA combobox with keyboard navigation; branches are necessary for a11y
export function CatalogItemPicker({
  name = 'catalog_item_id',
  defaultValue,
  label = 'Catalog item',
}: CatalogItemPickerProperties) {
  const inputId = useId();
  const listboxId = useId();

  const [selected, setSelected] = useState<Pick<CatalogItemSearchResult, 'id' | 'name'> | undefined>(defaultValue);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CatalogItemSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `/api/catalog-items/search?q=${encodeURIComponent(q)}&limit=10`,
        { cache: 'no-store' },
      );
      const data = (await response.json()) as { items?: CatalogItemSearchResult[] };
      setResults(data.items ?? []);
      setOpen(true);
      setActiveIndex(-1);
    }
    catch {
      setResults([]);
    }
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selected) {
      fetchResults(debouncedQuery);
    }
  }, [debouncedQuery, fetchResults, selected]);

  // Close on outside click
  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function handleSelect(item: CatalogItemSearchResult) {
    setSelected(item);
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  function handleClear() {
    setSelected(undefined);
    setQuery('');
    setResults([]);
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  const handleKeyDown = buildKeyDownHandler(open, results, activeIndex, setActiveIndex, setOpen, handleSelect);

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        <span className={styles.optional}> (optional)</span>
      </label>

      {/* Hidden input carries the selected ID for form submission */}
      <input type="hidden" name={name} value={selected?.id ?? ''} />

      <div ref={containerRef} className={styles.container}>
        {selected
          ? (
              <div className={styles.selectedItem}>
                <span className={styles.selectedName}>{selected.name}</span>
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={handleClear}
                  aria-label="Unlink catalog item"
                >
                  ✕
                </button>
              </div>
            )
          : (
              <>
                <div className={styles.inputWrapper}>
                  <input
                    ref={inputRef}
                    id={inputId}
                    type="text"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (results.length > 0) setOpen(true); }}
                    className={styles.input}
                    placeholder="Search catalog…"
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-controls={listboxId}
                    aria-expanded={open}
                    aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
                    role="combobox"
                  />
                  {loading && <span className={styles.spinner} aria-hidden="true" />}
                </div>

                {open && results.length > 0 && (
                  <ul
                    id={listboxId}
                    role="listbox"
                    aria-label="Catalog item suggestions"
                    className={styles.dropdown}
                  >
                    {results.map((item, index) => (
                      <OptionItem
                        key={item.id}
                        item={item}
                        index={index}
                        activeIndex={activeIndex}
                        listboxId={listboxId}
                        onSelect={handleSelect}
                        onHover={setActiveIndex}
                      />
                    ))}
                  </ul>
                )}

                {open && query.trim() && !loading && results.length === 0 && (
                  <div className={styles.noResults}>No catalog items found.</div>
                )}
              </>
            )}
      </div>
    </div>
  );
}
