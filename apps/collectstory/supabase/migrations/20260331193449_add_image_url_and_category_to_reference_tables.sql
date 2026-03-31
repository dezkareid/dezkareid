-- Migration A: Add image_url to brands and categories; add image_url + category_id to lines

ALTER TABLE public.brands
  ADD COLUMN image_url text;

ALTER TABLE public.categories
  ADD COLUMN image_url text;

ALTER TABLE public.lines
  ADD COLUMN image_url text,
  ADD COLUMN category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;
