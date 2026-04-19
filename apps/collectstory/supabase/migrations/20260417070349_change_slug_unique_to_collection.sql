-- Replace per-user slug uniqueness with per-collection uniqueness.
-- Collision scope is now the collection, not the user.
-- Pre-check: no duplicate (collection_id, slug) pairs exist in production data.

ALTER TABLE collection_items
  DROP CONSTRAINT IF EXISTS collection_items_user_slug_unique,
  ADD CONSTRAINT collection_items_collection_slug_unique UNIQUE (collection_id, slug);
