import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteCatalogItem } from './actions';
import styles from '../list.module.css';

export const metadata: Metadata = { title: 'Catalog Items' };

export default async function CatalogItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await connection();
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('catalog_items')
    .select(`
      id,
      name,
      slug,
      image_url,
      franchises(name),
      lines(name),
      catalog_item_stores(store_id)
    `)
    .order('name');

  if (q?.trim()) {
    query = query.ilike('name', `%${q.trim()}%`);
  }

  const { data: items } = await query;
  const hasItems = items && items.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Catalog Items</h1>
        <Link href="/admin/catalog-items/new" className={styles.newButton}>+ New Catalog Item</Link>
      </div>

      <form method="GET" style={{ marginBottom: 'var(--spacing-24)' }}>
        <input
          name="q"
          type="search"
          defaultValue={q ?? ''}
          placeholder="Search by name…"
          style={{
            fontSize: 'var(--font-size-300)',
            padding: 'var(--spacing-8) var(--spacing-12)',
            border: '1px solid var(--color-text-secondary)',
            borderRadius: 'var(--border-radius-medium)',
            width: '100%',
            maxWidth: '360px',
            backgroundColor: 'var(--color-background-primary)',
            color: 'var(--color-text-primary)',
            outline: 'none',
          }}
        />
      </form>

      {hasItems
        ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Franchise</th>
                  <th className={styles.th}>Line</th>
                  <th className={styles.th}>Stores</th>
                  <th className={styles.th} aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const franchise = Array.isArray(item.franchises)
                    ? item.franchises[0]
                    : item.franchises;
                  const line = Array.isArray(item.lines) ? item.lines[0] : item.lines;
                  const storeCount = Array.isArray(item.catalog_item_stores)
                    ? item.catalog_item_stores.length
                    : 0;

                  return (
                    <tr key={item.id} className={styles.tr}>
                      <td className={styles.td}>{item.name}</td>
                      <td className={styles.td}>{franchise?.name ?? '—'}</td>
                      <td className={styles.td}>{line?.name ?? '—'}</td>
                      <td className={styles.td}>{storeCount}</td>
                      <td className={styles.tdActions}>
                        <Link href={`/admin/catalog-items/${item.id}/edit`} className={styles.editLink}>Edit</Link>
                        <DeleteButton
                          id={item.id}
                          label={item.name}
                          deleteAction={deleteCatalogItem}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        : (
            <p className={styles.empty}>
              {q
                ? `No catalog items matching "${q}".`
                : (
                    <>
                      {'No catalog items yet. '}
                      <Link href="/admin/catalog-items/new">Add one.</Link>
                    </>
                  )}
            </p>
          )}
    </div>
  );
}
