# Spec: Setup Collectstory App

## Overview

Collectstory is a collector-focused web application that allows users to browse a public homepage and manage their personal collection through a dedicated collector page. The app is the primary product for the collector community within the Dezkareid portfolio, and its initial setup establishes the full production-ready foundation: authentication, data persistence, image hosting, and UI consistency via the shared design system.

This setup is the foundation from which all future Collectstory features will be built. Getting the scaffolding right — integrating the design system, social login, cloud storage, and database — eliminates repeated boilerplate work and ensures alignment with company standards from day one.

## Business Context

### Alignment with Company Outcomes

- **Innovation & Growth**: Collectstory is a primary product in the portfolio. A well-structured setup accelerates feature delivery and supports the goal of expanding the user base by 50% through improved UX and discoverability.
- **High-Quality User Experience**: Using the design system ensures visual consistency, accessibility compliance, and performance-first design across all screens — directly supporting the "High Quality" performance rating goal and 100% accessibility compliance target.
- **Efficiency & Velocity**: Scaffolding the app with established patterns (design tokens, shared components, Turbo build pipeline) increases delivery frequency by standardizing business and design patterns, contributing to the 20% improvement goal.

### Alignment with Architecture Principles

- **Simplicity over Complexity**: Use established tools (Next.js, Supabase, Cloudinary, Vercel) with minimal custom infrastructure.
- **Statelessness and Modularity**: Next.js App Router with server components promotes stateless request handling; design system components are modular and reusable.
- **Documentation as a Primary Artifact**: README and AGENTS.md must be created/updated alongside the implementation.
- **Universal Accessibility**: Design system tokens and components encode accessibility baselines.
- **Native Discoverability**: The homepage must be SEO-friendly with proper semantic HTML and metadata support.

## Requirements

### Homepage

1. The homepage must be publicly accessible without authentication.
2. The homepage must present the Collectstory brand and purpose to visitors.
3. The homepage must use design system components (Button, Card, Tag, ThemeToggle) and design tokens exclusively — no hardcoded colors, spacing, or typography.
4. The homepage must support light and dark themes via the ThemeToggle component.
5. The homepage must include proper page metadata (title, description) for SEO.

### Collector Page

6. The collector page must be accessible only to authenticated users.
7. Unauthenticated visitors who navigate to the collector page must be redirected to a sign-in flow.
8. An authenticated user must be able to view their own collection on the collector page.
9. Collection items must be displayed with their associated image (served from Cloudinary).

### Authentication

10. Users must be able to sign in using at least one social login provider (e.g., Google or GitHub).
11. Users must be able to sign out from the application.
12. Authentication state must persist across page refreshes within a session.

### General

13. All pages must meet accessibility standards (semantic HTML, keyboard navigation, sufficient contrast via design tokens).
14. The application must be deployable to Vercel without manual configuration beyond environment variables.
15. Images uploaded or referenced in the app must be stored and served via Cloudinary.
16. All data (users, collections) must be persisted in Supabase.

## Scope

### In Scope

- Next.js application scaffold bootstrapped with `create-next-app@latest` (TypeScript, App Router)
- Integration of `@dezkareid/design-tokens` and `@dezkareid/components` (React) into the app
- Public homepage with brand presentation and design system UI
- Collector page (authenticated-only) showing the user's collection
- Social login via Supabase Auth (at least one provider)
- Supabase database schema for users and collection items
- Cloudinary integration for collection item images
- Vercel deployment configuration
- Updated `package.json` registered in the monorepo workspace
- README and AGENTS.md for the `collectstory` app

### Out of Scope

- Adding or editing collection items (create/update/delete flows)
- Public profiles or sharing collections with other users
- Search or filtering of collection items
- Notifications or social features
- Mobile native app
- Payment or subscription features

## Acceptance Criteria

1. **Homepage loads publicly**: Visiting the app root without being logged in renders the homepage with brand content and design system styling.
2. **Theme toggle works**: Users can switch between light and dark themes on the homepage; the preference is reflected immediately.
3. **Unauthenticated redirect**: Navigating to `/collector` (or equivalent) while not logged in redirects the user to the sign-in page.
4. **Social login succeeds**: A user can complete sign-in via a social provider and be redirected back to the collector page.
5. **Collection visible**: An authenticated user on the collector page sees their collection items displayed with images.
6. **Sign-out works**: A signed-in user can sign out and is returned to the homepage or sign-in screen.
7. **Design system only**: No inline colors, hardcoded spacing, or typography values appear in any page or component — all visuals use CSS custom properties from the design tokens.
8. **Accessible**: All interactive elements are keyboard-reachable; pages pass basic automated accessibility checks.
9. **Vercel deployable**: The app builds and deploys successfully on Vercel with only environment variables configured (Supabase URL/key, Cloudinary credentials, OAuth secrets).
10. **Monorepo integrated**: The app runs via `pnpm turbo run dev --filter=@dezkareid/collectstory` from the monorepo root.

## Decisions

1. **Social login providers**: Google, Facebook, and X (Twitter) — all three enabled at launch via Supabase Auth.
2. **Collection data model**: Items have `name`, `image` (Cloudinary URL), `brand` (FK → brands), `line` (FK → lines, optional/"no line"), `category` (FK → categories), `description`, `date_acquired`. Supporting models: `brands`, `lines` (belongs to one brand), `categories`, `stores` (name, URL, country, city, geographic coordinates). Lines and categories are optional on a collection item.
3. **Collector page URL**: `/collection` for the authenticated area.
4. **Image upload flow**: Out of scope for this setup. Image upload is a paid-tier feature — deferred to the roadmap. Free and paid user tiers will be designed later.
5. **Next.js rendering strategy**: Public pages (homepage, stores directory) use SSG; authenticated/dynamic pages (collection) use SSR.
