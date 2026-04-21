ALTER TABLE public.catalog_items
  ADD COLUMN images jsonb NOT NULL DEFAULT '[]'::jsonb;
