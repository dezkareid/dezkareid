-- catalog_item_stores: links catalog items to stores where they can be purchased
CREATE TABLE public.catalog_item_stores (
  catalog_item_id uuid NOT NULL REFERENCES public.catalog_items(id) ON DELETE CASCADE,
  store_id        uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  PRIMARY KEY (catalog_item_id, store_id)
);

-- Index for lookups by store
CREATE INDEX catalog_item_stores_store_id_idx
  ON public.catalog_item_stores (store_id);

-- Row Level Security
ALTER TABLE public.catalog_item_stores ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "catalog_item_stores_public_select"
  ON public.catalog_item_stores
  FOR SELECT
  USING (true);

-- Admin insert
CREATE POLICY "catalog_item_stores_admin_insert"
  ON public.catalog_item_stores
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Admin delete
CREATE POLICY "catalog_item_stores_admin_delete"
  ON public.catalog_item_stores
  FOR DELETE
  USING (public.is_admin());
