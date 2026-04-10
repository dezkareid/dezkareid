-- Fix security advisory: mutable search_path on public functions
-- Setting search_path = '' forces fully-qualified object references and prevents
-- search path injection attacks.
--
-- Notes:
-- - handle_new_user: already uses public.profiles (fully-qualified) — safe to set search_path = ''
-- - is_admin: body used unqualified `profiles`; recreated below with public.profiles
-- - set_updated_at: uses only built-ins (now()) — safe to set search_path = ''

ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.set_updated_at() SET search_path = '';

-- is_admin must be recreated because its body referenced unqualified `profiles`
CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;
