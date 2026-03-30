-- =============================================================================
-- 005_profiles_username.sql
-- Adds username and avatar_url to profiles for user-scoped item URLs
-- =============================================================================

-- Add username (unique, format enforced) and avatar_url
alter table profiles
  add column username text unique
    check (username ~ '^[a-z0-9][a-z0-9-]{1,}[a-z0-9]$'),
  add column avatar_url text;

-- Allow public read of profiles (needed to resolve username → user_id for item URLs)
create policy "profiles_public_read"
  on profiles for select using (true);

-- Note: profiles_update_own policy already exists from a prior migration
