import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { CatalogItemForm } from '@/components/admin/CatalogItemForm';
import { createCatalogItem } from '../actions';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'New Catalog Item' };

type Properties = {
  searchParams: Promise<{ source_item_id?: string }>;
};

export default async function NewCatalogItemPage({ searchParams }: Properties) {
  const { source_item_id: sourceItemId } = await searchParams;

  const supabase = await createClient();
  const [{ data: franchises }, { data: lines }] = await Promise.all([
    supabase.from('franchises').select('id, name').order('name'),
    supabase.from('lines').select('id, name').order('name'),
  ]);

  let defaultValues: {
    name?: string;
    description?: string | null;
    image_url?: string | null;
    franchise_id?: string | null;
    line_id?: string | null;
  } | undefined;
  let sourceAlreadyLinked = false;

  if (sourceItemId) {
    const adminSupabase = createAdminClient();
    const { data: sourceItem } = await adminSupabase
      .from('collection_items')
      .select('name, description, image_url, franchise_id, line_id, catalog_item_id')
      .eq('id', sourceItemId)
      .single();

    if (sourceItem) {
      defaultValues = {
        name: sourceItem.name,
        description: sourceItem.description,
        image_url: sourceItem.image_url,
        franchise_id: sourceItem.franchise_id,
        line_id: sourceItem.line_id,
      };
      sourceAlreadyLinked = Boolean(sourceItem.catalog_item_id);
    }
  }

  return (
    <div style={{ maxWidth: '560px' }}>
      <h1 style={{
        fontSize: 'var(--font-size-700)',
        fontWeight: 'var(--font-weight-bold)',
        marginBottom: 'var(--spacing-32)',
      }}
      >
        New Catalog Item
      </h1>

      {sourceAlreadyLinked && (
        <p className={styles.warning} role="alert">
          This collection item is already linked to a catalog entry. You can still create a new one.
        </p>
      )}

      <CatalogItemForm
        action={createCatalogItem}
        defaultValues={defaultValues}
        sourceItemId={sourceItemId}
        franchises={franchises ?? []}
        lines={(lines ?? []).map(l => ({ ...l, franchise_id: undefined }))}
        submitLabel="Create Catalog Item"
        cancelHref="/admin/catalog-items"
      />
    </div>
  );
}
