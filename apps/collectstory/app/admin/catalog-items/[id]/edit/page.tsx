import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CatalogItemForm } from '@/components/admin/CatalogItemForm';
import { CatalogItemStoreManager } from '@/components/admin/CatalogItemStoreManager';
import { updateCatalogItem, addStoreToCatalogItem, removeStoreFromCatalogItem } from '../../actions';

export const metadata: Metadata = { title: 'Edit Catalog Item' };

export default async function EditCatalogItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: item },
    { data: franchises },
    { data: lines },
    { data: allStores },
    { data: linkedStoreRows },
  ] = await Promise.all([
    supabase
      .from('catalog_items')
      .select('id, name, description, image_url, franchise_id, line_id')
      .eq('id', id)
      .single(),
    supabase.from('franchises').select('id, name').order('name'),
    supabase.from('lines').select('id, name').order('name'),
    supabase.from('stores').select('id, name, city, country').eq('visible', true).order('name'),
    supabase
      .from('catalog_item_stores')
      .select('store_id, stores(id, name, city, country)')
      .eq('catalog_item_id', id),
  ]);

  if (!item) notFound();

  const linkedStores = (linkedStoreRows ?? []).flatMap((row) => {
    const store = Array.isArray(row.stores) ? row.stores[0] : row.stores;
    return store ? [store] : [];
  });

  const linkedStoreIds = new Set(linkedStores.map(s => s.id));
  const availableStores = (allStores ?? []).filter(s => !linkedStoreIds.has(s.id));

  const updateWithId = (formData: FormData) => updateCatalogItem(id, formData);
  const addStore = (storeId: string) => addStoreToCatalogItem(id, storeId);
  const removeStore = (storeId: string) => removeStoreFromCatalogItem(id, storeId);

  return (
    <div style={{ maxWidth: '560px' }}>
      <h1 style={{
        fontSize: 'var(--font-size-700)',
        fontWeight: 'var(--font-weight-bold)',
        marginBottom: 'var(--spacing-32)',
      }}
      >
        Edit Catalog Item
      </h1>

      <CatalogItemForm
        action={updateWithId}
        defaultValues={item}
        franchises={franchises ?? []}
        lines={(lines ?? []).map(l => ({ ...l, franchise_id: null }))}
        submitLabel="Save Changes"
        cancelHref="/admin/catalog-items"
      />

      <hr style={{ margin: 'var(--spacing-48) 0', borderColor: 'var(--color-background-secondary)' }} />

      <h2 style={{
        fontSize: 'var(--font-size-500)',
        fontWeight: 'var(--font-weight-bold)',
        marginBottom: 'var(--spacing-24)',
      }}
      >
        Store Associations
      </h2>

      <CatalogItemStoreManager
        linkedStores={linkedStores}
        availableStores={availableStores}
        addStoreAction={addStore}
        removeStoreAction={removeStore}
      />
    </div>
  );
}
