-- Migration: add_item_likes
-- Adds likes_count to collection_items and creates item_likes table
-- with RLS, a no-self-like trigger, and a denormalized count sync trigger.

-- ============================================================
-- 1. Add likes_count column to collection_items
-- ============================================================
ALTER TABLE public.collection_items
  ADD COLUMN likes_count INTEGER NOT NULL DEFAULT 0;

-- ============================================================
-- 2. Create item_likes table
-- ============================================================
CREATE TABLE public.item_likes (
  user_id    UUID        NOT NULL REFERENCES public.profiles(id)          ON DELETE CASCADE,
  item_id    UUID        NOT NULL REFERENCES public.collection_items(id)  ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);

-- Index to look up all likes for a given item efficiently
CREATE INDEX idx_item_likes_item_id ON public.item_likes (item_id);

-- ============================================================
-- 3. Sync likes_count trigger (AFTER INSERT OR DELETE)
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_item_id UUID;
BEGIN
  v_item_id := COALESCE(NEW.item_id, OLD.item_id);

  UPDATE public.collection_items
    SET likes_count = (
      SELECT COUNT(*) FROM public.item_likes WHERE item_id = v_item_id
    )
  WHERE id = v_item_id;

  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_sync_likes_count
AFTER INSERT OR DELETE ON public.item_likes
FOR EACH ROW EXECUTE FUNCTION public.sync_likes_count();

-- ============================================================
-- 5. Row Level Security on item_likes
-- ============================================================
ALTER TABLE public.item_likes ENABLE ROW LEVEL SECURITY;

-- Authenticated users can like any public item.
-- RLS enforces authentication and item visibility.
CREATE POLICY "Authenticated users can like public items"
  ON public.item_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.collection_items
      WHERE id = item_id AND visibility = 'public'
    )
  );

-- Users can only unlike (delete) their own likes.
CREATE POLICY "Users can unlike their own likes"
  ON public.item_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can read their own like rows to determine liked state on the item page.
CREATE POLICY "Users can read their own likes"
  ON public.item_likes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
