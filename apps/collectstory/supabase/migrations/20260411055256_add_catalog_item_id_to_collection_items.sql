ALTER TABLE public.collection_items
  ADD COLUMN catalog_item_id uuid REFERENCES public.catalog_items(id) ON DELETE SET NULL;

CREATE INDEX collection_items_catalog_item_id_idx
  ON public.collection_items (catalog_item_id)
  WHERE catalog_item_id IS NOT NULL;
