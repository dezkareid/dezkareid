-- =============================================================================
-- add_franchise_catalog.sql
-- Adds franchises and franchise_localized_names tables.
-- Adds nullable franchise_id FK to collection_items (ON DELETE SET NULL).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- franchises
-- -----------------------------------------------------------------------------

create table public.franchises (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text not null,
  created_at  timestamptz not null default now()
);

alter table public.franchises enable row level security;

create policy "franchises_public_read"
  on public.franchises for select using (true);

create policy "franchises_admin_insert"
  on public.franchises for insert
  with check (is_admin());

create policy "franchises_admin_update"
  on public.franchises for update
  using (is_admin());

create policy "franchises_admin_delete"
  on public.franchises for delete
  using (is_admin());

-- -----------------------------------------------------------------------------
-- franchise_localized_names
-- -----------------------------------------------------------------------------

create table public.franchise_localized_names (
  id           uuid primary key default gen_random_uuid(),
  franchise_id uuid not null references public.franchises(id) on delete cascade,
  locale       text not null,
  name         text not null,
  slug         text not null unique,
  created_at   timestamptz not null default now(),
  unique (franchise_id, locale)
);

alter table public.franchise_localized_names enable row level security;

create policy "franchise_localized_names_public_read"
  on public.franchise_localized_names for select using (true);

create policy "franchise_localized_names_admin_insert"
  on public.franchise_localized_names for insert
  with check (is_admin());

create policy "franchise_localized_names_admin_update"
  on public.franchise_localized_names for update
  using (is_admin());

create policy "franchise_localized_names_admin_delete"
  on public.franchise_localized_names for delete
  using (is_admin());

-- -----------------------------------------------------------------------------
-- collection_items — add optional franchise FK
-- -----------------------------------------------------------------------------

alter table public.collection_items
  add column franchise_id uuid references public.franchises(id) on delete set null;
