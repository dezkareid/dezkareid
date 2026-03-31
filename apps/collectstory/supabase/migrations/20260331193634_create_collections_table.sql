-- Migration B: Create collections table with RLS policies and updated_at trigger

CREATE TABLE public.collections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  slug        text NOT NULL,
  description text,
  visibility  text NOT NULL DEFAULT 'public'
              CHECK (visibility IN ('public', 'private')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, slug)
);

-- Reuse existing set_updated_at trigger function
CREATE TRIGGER set_collections_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Public can read public collections
CREATE POLICY collections_public_read ON public.collections
  FOR SELECT USING (visibility = 'public');

-- Owner can read all their own collections (including private)
CREATE POLICY collections_owner_read ON public.collections
  FOR SELECT USING (auth.uid() = user_id);

-- Owner can insert their own collections
CREATE POLICY collections_owner_insert ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Owner can update their own collections
CREATE POLICY collections_owner_update ON public.collections
  FOR UPDATE USING (auth.uid() = user_id);

-- Owner can delete their own collections
CREATE POLICY collections_owner_delete ON public.collections
  FOR DELETE USING (auth.uid() = user_id);
