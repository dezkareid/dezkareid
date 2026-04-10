# Feature Spec: Fix last_arrivals View Security Advisory

## Overview

The `public.last_arrivals` PostgreSQL view in the Collectstory Supabase database is flagged by Supabase's security advisory system with the warning: _"View public.last_arrivals is defined with the SECURITY DEFINER property"_.

This view powers the "Latest Arrivals" section on the Collectstory homepage, displaying the 10 most recently added public collection items. The view itself does not explicitly declare a `SECURITY DEFINER` clause — it defaults to `SECURITY INVOKER` — but Supabase advisories require explicit declaration to resolve the warning and confirm intent.

Resolving this advisory is necessary to maintain a clean security posture, ensure transparency, and restore the advisory dashboard to a clean state.

---

## Business Context

This fix directly supports the following company outcomes and architecture principles:

**Company Outcomes:**
- **Operational Excellence**: Maintaining a 99.9% availability and resolving user-affecting or system-flagged issues promptly aligns with the goal of reducing time-to-resolution by 30%.
- **Efficiency & Velocity**: Achieving the 90% "Enterprise Confidence" score in internal reviews requires resolving open security advisories. A flagged database view represents a gap in system transparency.

**Architecture Principles:**
- **Integrity and Auditability**: Architecture must support clear audit trails and ensure business logic is transparent and verifiable. Explicitly declaring the view's security model makes the intent auditable and verifiable by both human reviewers and automated tooling.
- **Simplicity over Complexity**: The fix should be minimal — update the view definition to explicitly state what it already implicitly does (`SECURITY INVOKER`), with no behavioral change.

---

## Requirements

1. The Supabase security advisory for `public.last_arrivals` must be resolved so that the advisory dashboard shows no open warnings for this view.
2. The view must continue to return the 10 most recently added public collection items (no behavioral change).
3. The view's security model must be explicitly declared as `SECURITY INVOKER`, confirming that it executes with the caller's privileges (the `anon` role) and does not bypass Row Level Security.
4. The change must be applied via a database migration so that it is tracked, reviewable, and reproducible across environments.
5. The TypeScript types generated from the database schema must remain valid and consistent with the updated view definition.

---

## Scope

### In Scope
- Adding `WITH (SECURITY_INVOKER = true)` to the `last_arrivals` view definition via a new Supabase migration.
- Regenerating TypeScript types from the updated schema if needed.
- Verifying the advisory is resolved after applying the migration.

### Out of Scope
- Changes to the view's query logic, columns, or filters.
- Changes to RLS policies on underlying tables.
- Changes to the frontend component, API route, or data-fetching logic.
- Performance optimizations (e.g., materialized views, indexes).

---

## Acceptance Criteria

1. The Supabase security advisory "View public.last_arrivals is defined with the SECURITY DEFINER property" no longer appears in the project's advisor dashboard after the migration is applied.
2. The "Latest Arrivals" section on the Collectstory homepage continues to display the correct data (10 most recent public items) without any errors or visual regressions.
3. A new migration file exists in `supabase/migrations/` that recreates the view with an explicit `SECURITY_INVOKER = true` option.
4. The migration can be applied cleanly to a fresh database without errors.
5. The generated TypeScript types remain consistent with the view's column set (no breaking changes).

---

## Open Questions

_None. The issue is well-defined: the fix is to explicitly add `SECURITY_INVOKER = true` to the view definition via a migration._
