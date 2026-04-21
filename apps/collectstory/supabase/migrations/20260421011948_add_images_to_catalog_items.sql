ALTER TABLE public.catalog_items
  ADD COLUMN images jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.catalog_items
  ADD CONSTRAINT catalog_items_images_max_5
  CHECK (jsonb_array_length(images) <= 5);
