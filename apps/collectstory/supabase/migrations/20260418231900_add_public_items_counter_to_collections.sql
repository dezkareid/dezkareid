-- Add public_items counter column (public-only items, for visitor-facing counts)
ALTER TABLE public.collections
  ADD COLUMN IF NOT EXISTS public_items integer;

-- Replace trigger functions to maintain both counters

CREATE OR REPLACE FUNCTION public.increment_collection_total_items()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.collections
  SET
    total_items  = COALESCE(total_items,  0) + 1,
    public_items = COALESCE(public_items, 0) + CASE WHEN NEW.visibility = 'public' THEN 1 ELSE 0 END
  WHERE id = NEW.collection_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_collection_total_items()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.collections
  SET
    total_items  = GREATEST(COALESCE(total_items,  0) - 1, 0),
    public_items = GREATEST(COALESCE(public_items, 0) - CASE WHEN OLD.visibility = 'public' THEN 1 ELSE 0 END, 0)
  WHERE id = OLD.collection_id;
  RETURN OLD;
END;
$$;

-- New trigger function for UPDATE (visibility changes)
CREATE OR REPLACE FUNCTION public.update_collection_item_counters()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.visibility <> NEW.visibility THEN
    UPDATE public.collections
    SET public_items = GREATEST(
      COALESCE(public_items, 0)
        + CASE WHEN NEW.visibility = 'public' THEN 1 ELSE -1 END,
      0
    )
    WHERE id = NEW.collection_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_collection_item_counters ON public.collection_items;
CREATE TRIGGER trg_update_collection_item_counters
  AFTER UPDATE OF visibility ON public.collection_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_collection_item_counters();

-- Back-fill public_items from live count
UPDATE public.collections c
SET public_items = (
  SELECT COUNT(*)
  FROM public.collection_items ci
  WHERE ci.collection_id = c.id
    AND ci.visibility = 'public'
);
