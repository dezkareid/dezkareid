# collectstory — Best Practices Audit

Reviewed against `frontend-tools:next-best-practices` and `frontend-tools:react-best-practices`.

## Must Fix (affects UX/robustness)

- [ ] Add `app/error.tsx` and `app/collection/error.tsx` — unhandled Server Component errors crash the route with no recovery UI
- [ ] Add `app/not-found.tsx` — missing pages fall back to the default Next.js 404
- [ ] Add `fallback` props to all `<Suspense>` boundaries — UI is blank during streaming (`collection/page.tsx:60`, `collection/layout.tsx:28`)

## Should Fix (good practice)

- [ ] Add `app/collection/loading.tsx` — no route-level loading state for the collection segment
- [ ] Fix FOUC guard in `app/layout.tsx` to handle first-visit OS dark preference — add `window.matchMedia('(prefers-color-scheme: dark)')` fallback for users with no `color-scheme` in `localStorage`

## Low Priority

- [ ] Make the RSC/Client boundary on `SiteHeader` explicit — it renders `<ThemeToggle>` (Client Component) without being marked `'use client'`. Works today but the boundary is implicit. Consider extracting a `ThemeActions` client wrapper or marking `SiteHeader` as `'use client'`.

## Compliant

- `proxy.ts` replaces `middleware.ts` (Next.js 16 file convention)
- `cacheComponents: true` enabled in `next.config.ts`
- `IBM_Plex_Sans` uses `next/font/google` — no layout shift
- External store links use `rel="noopener noreferrer"`
- Server Actions used for OAuth redirects in `login/page.tsx` — no client JS needed
- `"use cache"` + `cacheLife('hours')` with cookie-free Supabase client in `stores/page.tsx`
- `features` array defined at module level in `app/page.tsx` (not inside component)
- Ternary used for conditional render in `stores/page.tsx` (`rendering-conditional-render`)
- `<Suspense>` wraps async components — layout and page stream independently
- FOUC guard uses inline `<script>` in `<head>` with `suppressHydrationWarning` (`rendering-hydration-no-flicker`)
- No barrel file imports — all imports target entry points directly
