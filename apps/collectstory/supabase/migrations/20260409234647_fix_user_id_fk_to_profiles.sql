-- Safety guard: abort if any item/collection has no matching profile
DO $$
DECLARE
  orphaned_items integer;
  orphaned_collections integer;
BEGIN
  SELECT COUNT(*) INTO orphaned_items
  FROM public.collection_items ci
  WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = ci.user_id);

  SELECT COUNT(*) INTO orphaned_collections
  FROM public.collections c
  WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = c.user_id);

  IF orphaned_items > 0 OR orphaned_collections > 0 THEN
    RAISE EXCEPTION
      'Migration aborted: % collection_item(s) and % collection(s) have no matching profile row. Fix orphaned rows before re-running.',
      orphaned_items, orphaned_collections;
  END IF;
END $$;

-- Drop old FK constraints pointing to auth.users
ALTER TABLE public.collection_items
  DROP CONSTRAINT collection_items_user_id_fkey;

ALTER TABLE public.collections
  DROP CONSTRAINT collections_user_id_fkey;

-- Add new FK constraints pointing to profiles.id
ALTER TABLE public.collection_items
  ADD CONSTRAINT collection_items_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.collections
  ADD CONSTRAINT collections_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
