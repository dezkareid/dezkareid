# Implementation Plan: Fix last_arrivals Security Advisory

## Architecture Overview

The Supabase security advisor flags `public.last_arrivals` with `security_definer_view` (ERROR level) because the view was created without explicitly setting `security_invoker = true`. PostgreSQL views default to `SECURITY INVOKER`, but Supabase requires the option to be explicitly declared via `WITH (security_invoker = true)` to clear the advisory.

**Root cause confirmed via Supabase MCP:**
- `pg_class.reloptions` for `last_arrivals` is `null` — no security option is set.
- The view query is correct; only the option declaration is missing.
- Fix: recreate the view with `WITH (security_invoker = true)`.

**Additional advisories found (WARN level) — included in scope of this refactor:**
- `public.handle_new_user` — mutable `search_path`
- `public.is_admin` — mutable `search_path`
- `public.set_updated_at` — mutable `search_path`

These are addressed via `ALTER FUNCTION ... SET search_path = ''` in a separate migration step.

**No application code changes are required.** The fix is entirely at the database layer via migrations.

---

## Implementation Phases

### Phase 1 — Fix the `last_arrivals` view (ERROR)

**Goal:** Recreate the view with explicit `security_invoker = true` to clear the `security_definer_view` advisory.

**Steps:**
1. Create a new migration file via the Supabase CLI:
   ```bash
   # From apps/collectstory/
   npx supabase migration new fix_last_arrivals_security_invoker
   ```
2. Write the migration SQL:
   ```sql
   -- Drop and recreate the view with explicit SECURITY INVOKER
   DROP VIEW IF EXISTS public.last_arrivals;

   CREATE VIEW public.last_arrivals
   WITH (security_invoker = true)
   AS
   SELECT
     ci.id,
     ci.name,
     ci.image_url,
     ci.slug,
     ci.created_at,
     ci.collection_id,
     p.username,
     p.avatar_url,
     l.name   AS line_name,
     l.slug   AS line_slug,
     b.name   AS brand_name,
     b.slug   AS brand_slug,
     col.slug AS collection_slug
   FROM public.collection_items ci
   JOIN public.profiles p      ON p.id = ci.user_id
   JOIN public.collections col ON col.id = ci.collection_id
   LEFT JOIN public.lines l    ON l.id = ci.line_id
   LEFT JOIN public.brands b   ON b.id = l.brand_id
   WHERE ci.visibility = 'public'
   ORDER BY ci.created_at DESC
   LIMIT 10;

   GRANT SELECT ON public.last_arrivals TO anon;
   GRANT SELECT ON public.last_arrivals TO authenticated;
   ```
3. Apply the migration via Supabase MCP (`mcp__supabase__apply_migration`).
4. Verify with `mcp__supabase__get_advisors` that the `security_definer_view` advisory is gone.

### Phase 2 — Fix mutable `search_path` in functions (WARN)

**Goal:** Set an explicit, empty `search_path` on the three flagged functions to prevent search path injection attacks.

**Steps:**
1. Create a second migration:
   ```bash
   npx supabase migration new fix_function_search_paths
   ```
2. Write the migration SQL:
   ```sql
   -- Fix mutable search_path: set search_path = '' to prevent hijacking
   ALTER FUNCTION public.handle_new_user() SET search_path = '';
   ALTER FUNCTION public.is_admin() SET search_path = '';
   ALTER FUNCTION public.set_updated_at() SET search_path = '';
   ```
   > Note: Setting `search_path = ''` forces functions to use fully-qualified names (e.g. `public.profiles`). The existing function bodies already use fully-qualified references, so no body changes are needed — verify this before applying.
3. Apply the migration via Supabase MCP.
4. Verify with `mcp__supabase__get_advisors` that the `function_search_path_mutable` warnings are gone.

### Phase 3 — Verify & regenerate types

**Goal:** Confirm the view columns are unchanged and TypeScript types remain valid.

**Steps:**
1. Run `mcp__supabase__execute_sql` to confirm the view columns match the previous definition.
2. Run `mcp__supabase__generate_typescript_types` to regenerate `lib/supabase/types.ts`.
3. Confirm no TypeScript compilation errors: `pnpm turbo run build --filter=@dezkareid/collectstory --dry-run` (or type-check only).

---

## Technical Dependencies

| Dependency | Details |
|---|---|
| Supabase MCP | Used to apply migrations and verify advisories |
| Supabase CLI | Used to create timestamped migration files |
| `pg_class.reloptions` | Postgres system catalog — confirmed `null` (no option set) |
| `lib/supabase/types.ts` | Generated types — must be regenerated after schema change |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| `WITH (security_invoker = true)` syntax not supported on current Postgres version | Low — Postgres 15+ supports it; Supabase uses 15+ | Verify Postgres version before applying; fallback is `ALTER VIEW ... SET (security_invoker = on)` |
| `ALTER FUNCTION ... SET search_path = ''` breaks function body if it uses unqualified names | Low — functions were reviewed and use `public.` prefix | Read each function body before applying Phase 2 migration |
| View `GRANT` not preserved after `DROP/CREATE` | Medium — GRANTs are lost on DROP | Re-apply `GRANT SELECT TO anon` and `authenticated` in the same migration |
| TypeScript types drift | Low — view columns are unchanged | Regenerate types in Phase 3 and verify no compile errors |

---

## Out of Scope

- Changes to view query logic, filters, or column set.
- Fixing `auth_leaked_password_protection` advisory (requires Supabase Auth dashboard change, not a migration).
- Frontend component, API route, or data-fetching changes.
- Performance optimizations (indexes, materialized views).
- Adding tests (no test infrastructure exists for this app yet).
