-- =============================================================================
-- 003_bootstrap_admin.sql
-- Promote the first admin user by email (idempotent)
--
-- TODO: Replace 'your-email@example.com' below with your actual email address
--       before applying this migration. If the email is not found or an admin
--       already exists, this migration is a no-op.
-- =============================================================================

do $$
declare
  v_user_id uuid;
begin
  -- Only run if no admin exists yet
  if exists (select 1 from public.profiles where role = 'admin') then
    return;
  end if;

  -- Look up the user by email
  select id into v_user_id
  from auth.users
  where email = 'elmaildeldezkareid@gmail.com'
  limit 1;

  if v_user_id is null then
    raise notice 'Bootstrap admin: user not found — skipping.';
    return;
  end if;

  -- Ensure a profiles row exists (in case the trigger hasn't fired yet)
  insert into public.profiles (id, role)
  values (v_user_id, 'admin')
  on conflict (id) do update set role = 'admin';

  raise notice 'Bootstrap admin: user % promoted to admin.', v_user_id;
end;
$$;
