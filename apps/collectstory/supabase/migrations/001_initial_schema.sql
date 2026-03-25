-- =============================================================================
-- 001_initial_schema.sql
-- Initial schema for Collectstory
-- =============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Reference tables (public read, service-role write)
-- -----------------------------------------------------------------------------

create table brands (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

create table lines (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references brands(id) on delete cascade,
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

create table categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

create table stores (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  url        text,
  country    text,
  city       text,
  lat        numeric(9, 6),
  lng        numeric(9, 6),
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- User collection items
-- -----------------------------------------------------------------------------

create table collection_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  image_url   text,
  brand_id    uuid references brands(id) on delete set null,
  line_id     uuid references lines(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  description text,
  date_acquired date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Keep updated_at current on every update
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger collection_items_updated_at
  before update on collection_items
  for each row execute procedure set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table brands          enable row level security;
alter table lines           enable row level security;
alter table categories      enable row level security;
alter table stores          enable row level security;
alter table collection_items enable row level security;

-- Reference tables: public SELECT
create policy "brands_public_read"
  on brands for select using (true);

create policy "lines_public_read"
  on lines for select using (true);

create policy "categories_public_read"
  on categories for select using (true);

create policy "stores_public_read"
  on stores for select using (true);

-- collection_items: users manage only their own rows
create policy "collection_items_select_own"
  on collection_items for select
  using (auth.uid() = user_id);

create policy "collection_items_insert_own"
  on collection_items for insert
  with check (auth.uid() = user_id);

create policy "collection_items_update_own"
  on collection_items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "collection_items_delete_own"
  on collection_items for delete
  using (auth.uid() = user_id);
