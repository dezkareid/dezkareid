-- Add total_items counter column (nullable so existing rows fall back to live COUNT)
ALTER TABLE public.collections
  ADD COLUMN IF NOT EXISTS total_items integer;

-- Trigger function: increment on insert
CREATE OR REPLACE FUNCTION public.increment_collection_total_items()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.collections
  SET total_items = COALESCE(total_items, 0) + 1
  WHERE id = NEW.collection_id;
  RETURN NEW;
END;
$$;

-- Trigger function: decrement on delete
CREATE OR REPLACE FUNCTION public.decrement_collection_total_items()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.collections
  SET total_items = GREATEST(COALESCE(total_items, 0) - 1, 0)
  WHERE id = OLD.collection_id;
  RETURN OLD;
END;
$$;

-- Attach triggers to collection_items
DROP TRIGGER IF EXISTS trg_increment_collection_total_items ON public.collection_items;
CREATE TRIGGER trg_increment_collection_total_items
  AFTER INSERT ON public.collection_items
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_collection_total_items();

DROP TRIGGER IF EXISTS trg_decrement_collection_total_items ON public.collection_items;
CREATE TRIGGER trg_decrement_collection_total_items
  AFTER DELETE ON public.collection_items
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_collection_total_items();

-- Back-fill existing rows from live count
UPDATE public.collections c
SET total_items = (
  SELECT COUNT(*)
  FROM public.collection_items ci
  WHERE ci.collection_id = c.id
);
