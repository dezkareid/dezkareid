import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';
import { StoreForm } from '@/components/admin/StoreForm';
import { StoreItemsManager } from '@/components/admin/StoreItemsManager';
import type { LinkedCatalogItem, CatalogItemOption } from '@/components/admin/StoreItemsManager';
import { updateStore } from '../../actions';
import styles from '../../../form.module.css';

export const metadata: Metadata = { title: 'Edit Store' };

type CatalogItemRow = { id: string; name: string; slug: string; image_url: string | null };

type StoreRow = {
  id: string;
  name: string;
  url: string | null;
  country: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  verified: boolean | null;
  cover_url: string | null;
  logo_url: string | null;
  address: string | null;
  google_place_id: string | null;
};

function toLinkedItem(row: { product_url: string | null; catalog_items: unknown }): LinkedCatalogItem | null {
  const item = row.catalog_items as CatalogItemRow | null;
  if (!item) return null;
  return { ...item, product_url: row.product_url ?? null };
}

function toStoreDefaults(store: StoreRow) {
  return {
    id: store.id,
    name: store.name,
    url: store.url ?? undefined,
    country: store.country ?? undefined,
    city: store.city ?? undefined,
    lat: store.lat ?? undefined,
    lng: store.lng ?? undefined,
    verified: store.verified ?? false,
    cover_url: store.cover_url ?? undefined,
    logo_url: store.logo_url ?? undefined,
    address: store.address ?? undefined,
    google_place_id: store.google_place_id ?? undefined,
  };
}

export default async function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connection();
  const supabase = await createClient();

  const [{ data: store }, { data: linkedItems }, { data: allCatalogItems }] = await Promise.all([
    supabase
      .from('stores')
      .select('id, name, url, country, city, lat, lng, verified, cover_url, logo_url, address, google_place_id')
      .eq('id', id)
      .single(),
    supabase
      .from('catalog_item_stores')
      .select('product_url, catalog_items ( id, name, slug, image_url )')
      .eq('store_id', id),
    supabase
      .from('catalog_items')
      .select('id, name, slug')
      .order('name'),
  ]);

  if (!store) notFound();

  const action = updateStore.bind(undefined, id);
  const linked: LinkedCatalogItem[] = (linkedItems ?? [])
    .map(row => toLinkedItem(row))
    .filter((item): item is LinkedCatalogItem => item !== null);
  const all: CatalogItemOption[] = (allCatalogItems ?? []) as CatalogItemOption[];

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit Store</h1>
      <StoreForm
        action={action}
        defaultValues={toStoreDefaults(store)}
        submitLabel="Save Changes"
      />
      <StoreItemsManager
        storeId={id}
        initialItems={linked}
        allCatalogItems={all}
      />
    </div>
  );
}
