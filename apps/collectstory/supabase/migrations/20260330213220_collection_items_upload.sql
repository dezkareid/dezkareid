-- =============================================================================
-- 004_collection_items_upload.sql
-- Adds visibility, slug to collection_items for item upload feature
-- =============================================================================

-- Add visibility column with three states
alter table collection_items
  add column visibility text not null default 'public'
    check (visibility in ('public', 'private', 'draft'));

-- Add slug column for human-readable URLs
alter table collection_items
  add column slug text not null default '';

-- Unique slug per user
alter table collection_items
  add constraint collection_items_user_slug_unique unique (user_id, slug);

-- Allow unauthenticated reads for public items (item detail pages)
create policy "collection_items_public_read"
  on collection_items for select
  using (visibility = 'public');
