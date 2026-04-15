-- Fix collection_items FK to cascade delete when a collection is removed.
-- Previously SET NULL, which orphaned items instead of removing them.
ALTER TABLE public.collection_items
  DROP CONSTRAINT collection_items_collection_id_fkey;

ALTER TABLE public.collection_items
  ADD CONSTRAINT collection_items_collection_id_fkey
    FOREIGN KEY (collection_id)
    REFERENCES public.collections(id)
    ON DELETE CASCADE;
