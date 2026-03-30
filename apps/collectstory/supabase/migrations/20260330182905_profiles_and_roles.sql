-- =============================================================================
-- 002_profiles_and_roles.sql
-- Profiles table with role support + admin write policies on reference tables
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Profiles table
-- -----------------------------------------------------------------------------

create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every update
create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();

-- Auto-create a profile row (role = 'user') when a new user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Index for efficient admin-check queries
create index profiles_role_idx on profiles (role);

-- -----------------------------------------------------------------------------
-- Row Level Security on profiles
-- -----------------------------------------------------------------------------

alter table profiles enable row level security;

-- Users can read and update only their own profile
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Helper function: returns true if the calling user has the 'admin' role
create or replace function is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- Admin write policies on reference tables
-- (public SELECT policies already exist from migration 001)
-- -----------------------------------------------------------------------------

-- brands
create policy "brands_admin_insert"
  on brands for insert
  with check (is_admin());

create policy "brands_admin_update"
  on brands for update
  using (is_admin());

create policy "brands_admin_delete"
  on brands for delete
  using (is_admin());

-- lines
create policy "lines_admin_insert"
  on lines for insert
  with check (is_admin());

create policy "lines_admin_update"
  on lines for update
  using (is_admin());

create policy "lines_admin_delete"
  on lines for delete
  using (is_admin());

-- categories
create policy "categories_admin_insert"
  on categories for insert
  with check (is_admin());

create policy "categories_admin_update"
  on categories for update
  using (is_admin());

create policy "categories_admin_delete"
  on categories for delete
  using (is_admin());

-- stores
create policy "stores_admin_insert"
  on stores for insert
  with check (is_admin());

create policy "stores_admin_update"
  on stores for update
  using (is_admin());

create policy "stores_admin_delete"
  on stores for delete
  using (is_admin());
