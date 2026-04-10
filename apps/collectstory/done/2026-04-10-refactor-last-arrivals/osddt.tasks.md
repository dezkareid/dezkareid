# Task List: Fix last_arrivals Security Advisory

## Phase 1 — Fix `last_arrivals` view (ERROR)

- [x] [S] Read function bodies of `handle_new_user`, `is_admin`, and `set_updated_at` to confirm all references are fully-qualified before applying search_path fix
- [x] [S] Create migration file `fix_last_arrivals_security_invoker` via Supabase CLI
- [x] [M] Write migration SQL: drop and recreate `public.last_arrivals` with `WITH (security_invoker = true)`, re-apply `GRANT SELECT TO anon` and `authenticated`
- [x] [S] Apply migration via Supabase MCP (`apply_migration`)
- [x] [S] Verify `security_definer_view` advisory is cleared via `mcp__supabase__get_advisors`

**Definition of Done:** `get_advisors` returns no `security_definer_view` entry for `public.last_arrivals`.

---

## Phase 2 — Fix mutable `search_path` in functions (WARN)

> Depends on: Phase 1 function body review task

- [x] [S] Create migration file `fix_function_search_paths` via Supabase CLI
- [x] [S] Write migration SQL: `ALTER FUNCTION` for `handle_new_user`, `is_admin`, and `set_updated_at` with `SET search_path = ''`
- [x] [S] Apply migration via Supabase MCP (`apply_migration`)
- [x] [S] Verify all three `function_search_path_mutable` warnings are cleared via `mcp__supabase__get_advisors`

**Definition of Done:** `get_advisors` returns no `function_search_path_mutable` entries for the three functions.

---

## Phase 3 — Verify & regenerate types

> Depends on: Phase 1 complete

- [x] [S] Confirm view columns are unchanged via `mcp__supabase__execute_sql` (query `pg_views`)
- [x] [M] Regenerate `lib/supabase/types.ts` via `mcp__supabase__generate_typescript_types` and write the output to the file
- [x] [S] Run TypeScript type-check to confirm no compile errors: `pnpm turbo run build --filter=@dezkareid/collectstory`

**Definition of Done:** Types file is up to date, build passes with no type errors, and view columns match the previous definition.

---

## Dependencies

```
Phase 1: function body review → create migration → write SQL → apply → verify
Phase 2: (after function body review) → create migration → write SQL → apply → verify
Phase 3: (after Phase 1 apply) → verify columns → regenerate types → type-check
```

Phases 2 and 3 can proceed in parallel once Phase 1 is complete and function bodies have been reviewed.
