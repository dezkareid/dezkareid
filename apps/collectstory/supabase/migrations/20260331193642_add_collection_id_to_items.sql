-- Migration C: Add collection_id to collection_items, backfill orphaned items,
-- make NOT NULL, then drop denormalized brand_id and category_id FKs.

-- Step 1: Add nullable collection_id
ALTER TABLE public.collection_items
  ADD COLUMN collection_id uuid REFERENCES public.collections(id) ON DELETE SET NULL;

-- Step 2: For each user with items that have no collection_id, create a default
-- "My Collection" and assign all their orphaned items to it.
DO $$
DECLARE
  r RECORD;
  new_col_id uuid;
BEGIN
  FOR r IN
    SELECT DISTINCT user_id FROM public.collection_items WHERE collection_id IS NULL
  LOOP
    -- Create default collection (idempotent via ON CONFLICT)
    INSERT INTO public.collections (user_id, name, slug, visibility)
    VALUES (r.user_id, 'My Collection', 'my-collection', 'public')
    ON CONFLICT (user_id, slug) DO NOTHING;

    -- Look up the collection id (handles both insert and conflict cases)
    SELECT id INTO new_col_id FROM public.collections
    WHERE user_id = r.user_id AND slug = 'my-collection';

    -- Assign orphaned items
    UPDATE public.collection_items
    SET collection_id = new_col_id
    WHERE user_id = r.user_id AND collection_id IS NULL;
  END LOOP;
END $$;

-- Step 3: Make collection_id NOT NULL and drop denormalized FKs
ALTER TABLE public.collection_items
  ALTER COLUMN collection_id SET NOT NULL;

ALTER TABLE public.collection_items
  DROP COLUMN brand_id,
  DROP COLUMN category_id;
