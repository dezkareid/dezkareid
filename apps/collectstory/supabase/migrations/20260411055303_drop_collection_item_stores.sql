-- Guard: abort if table is not empty (should be 0 rows in prod)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.collection_item_stores LIMIT 1) THEN
    RAISE EXCEPTION 'collection_item_stores is not empty — cannot drop safely';
  END IF;
END $$;

DROP TABLE public.collection_item_stores;
