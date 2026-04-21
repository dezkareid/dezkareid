ALTER TABLE public.stores
  ADD COLUMN slug         text UNIQUE,
  ADD COLUMN cover_url    text,
  ADD COLUMN logo_url     text,
  ADD COLUMN address      text,
  ADD COLUMN google_place_id text;

-- Backfill slugs from name using the same slugify logic as the app
UPDATE public.stores
SET slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- Make slug NOT NULL after backfill
ALTER TABLE public.stores ALTER COLUMN slug SET NOT NULL;
