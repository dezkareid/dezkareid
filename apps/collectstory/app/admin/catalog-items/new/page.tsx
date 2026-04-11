import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CatalogItemForm } from '@/components/admin/CatalogItemForm';
import { createCatalogItem } from '../actions';

export const metadata: Metadata = { title: 'New Catalog Item' };

export default async function NewCatalogItemPage() {
  const supabase = await createClient();

  const [{ data: franchises }, { data: lines }] = await Promise.all([
    supabase.from('franchises').select('id, name').order('name'),
    supabase.from('lines').select('id, name').order('name'),
  ]);

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
      <CatalogItemForm
        action={createCatalogItem}
        franchises={franchises ?? []}
        lines={(lines ?? []).map(l => ({ ...l, franchise_id: null }))}
        submitLabel="Create Catalog Item"
        cancelHref="/admin/catalog-items"
      />
    </div>
  );
}
