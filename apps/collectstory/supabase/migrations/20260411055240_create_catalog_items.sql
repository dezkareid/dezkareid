-- catalog_items: admin-managed product registry
CREATE TABLE public.catalog_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  slug         text NOT NULL UNIQUE,
  description  text,
  image_url    text,
  franchise_id uuid REFERENCES public.franchises(id) ON DELETE SET NULL,
  line_id      uuid REFERENCES public.lines(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- GIN trigram index for similarity-based autocomplete
CREATE INDEX catalog_items_name_trgm_idx
  ON public.catalog_items USING GIN (name gin_trgm_ops);

-- updated_at trigger (reuses existing set_updated_at function)
CREATE TRIGGER catalog_items_updated_at
  BEFORE UPDATE ON public.catalog_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Row Level Security
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "catalog_items_public_select"
  ON public.catalog_items
  FOR SELECT
  USING (true);

-- Admin insert
CREATE POLICY "catalog_items_admin_insert"
  ON public.catalog_items
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Admin update
CREATE POLICY "catalog_items_admin_update"
  ON public.catalog_items
  FOR UPDATE
  USING (public.is_admin());

-- Admin delete
CREATE POLICY "catalog_items_admin_delete"
  ON public.catalog_items
  FOR DELETE
  USING (public.is_admin());
