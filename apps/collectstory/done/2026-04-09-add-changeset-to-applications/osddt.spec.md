# Spec: Add Changeset and Web App Manifest to Collectstory

## Overview

The Collectstory application currently has no formal version management and no web app manifest. This feature introduces two complementary improvements:

1. **Changeset configuration** — a structured versioning workflow so that every meaningful change to the application increments its version number and generates a changelog entry. This gives maintainers a clear, auditable history of what changed and when.

2. **Web App Manifest (`manifest.json`)** — a standardised metadata file that tells browsers and operating systems how to present the application when installed or bookmarked. This improves discoverability and makes the app behave as a first-class installable web application on mobile and desktop devices.

Together these changes support Collectstory's growth ambitions by making the application more discoverable, more trustworthy to users, and easier to maintain over time.

---

## Business Context

### Company Outcomes alignment

| Outcome | How this feature contributes |
|---|---|
| **Expand Collectstory user base by 50% through organic discoverability** | A `manifest.json` enables Add-to-Home-Screen prompts on Android and iOS, improves PWA signals for search engines, and provides rich metadata that helps devices (browsers, OS launchers) surface the app. |
| **Increase frequency of meaningful product updates by 20%** | Changeset tooling standardises the release process, reducing friction around versioning and changelog generation so releases happen more often and with confidence. |
| **90% Enterprise Confidence score** | Versioned releases with changelogs create the audit trail and business-logic transparency required by the integrity & auditability standard. |

### Architecture Principles alignment

| Principle | How this feature embodies it |
|---|---|
| **Native Discoverability** | A web app manifest is the canonical standard for making a web application discoverable and installable across devices and platforms. |
| **Integrity and Auditability** | Changesets provide a structured, machine-readable record of every change, satisfying the requirement for clear audit trails. |
| **Configuration-Driven Behavior** | Both the manifest and changeset config are purely declarative — no logic is hard-coded; behaviour is controlled through configuration files. |
| **Documentation as a Primary Artifact** | Generated changelogs are documentation produced automatically from changeset files, kept close to the code they describe. |

---

## Requirements

### Version Management (Changeset)

1. The repository must support a changeset-based versioning workflow for the `@dezkareid/collectstory` package.
2. Contributors must be able to create a changeset file describing a change (patch, minor, or major) as part of any pull request.
3. Consuming the accumulated changesets must produce an updated `version` field in `package.json` and a human-readable `CHANGELOG.md` entry for `apps/collectstory`.
4. The changeset configuration must scope versioning to the `@dezkareid/collectstory` package only (it should not unintentionally version other monorepo packages).
5. The changelog must record the change type, a description, and the date of the release.

### Web App Manifest

6. Collectstory must serve a `manifest.json` (or `manifest.webmanifest`) at a publicly accessible URL that browsers can discover via the page's `<head>`.
7. The manifest must include at minimum:
   - Application name and short name
   - Theme colour and background colour
   - Display mode (`standalone` or `minimal-ui`)
   - At least one icon at 192 × 192 px and one at 512 × 512 px
   - Start URL
8. The manifest must be referenced by a `<link rel="manifest">` tag present on every page of the application.
9. Icon assets must be available in the public directory and served statically.
10. The manifest values (name, colours) must be consistent with the existing Collectstory brand and design tokens.

---

## Scope

### In scope

- Changeset tooling configuration at the monorepo root scoped to `apps/collectstory`.
- A `CHANGELOG.md` generated from changesets for `apps/collectstory`.
- `manifest.json` file with all required fields.
- Icon assets (at minimum 192 px and 512 px variants) created in `design-system/icons` and referenced from the Collectstory public directory.
- `<link rel="manifest">` wired into the Next.js root layout `<head>`.
- Version bump of `package.json` for `@dezkareid/collectstory` from `0.0.1` to `1.0.0`.

### Out of scope

- Service worker / offline support (PWA caching).
- Push notification configuration.
- Changeset CI automation (automated PRs to bump version on merge) — manual workflow only in this iteration.
- Applying changeset tooling to other monorepo packages.
- App store submission or native app packaging.
- Splash screens or maskable icon variants (can be added later).

---

## Acceptance Criteria

1. Running the changeset CLI from the repo root allows a contributor to create a changeset file for `@dezkareid/collectstory`.
2. Running the version command consumes all pending changesets, updates `apps/collectstory/package.json#version`, and appends a new entry to `apps/collectstory/CHANGELOG.md`.
3. A browser navigating to Collectstory can discover and parse the manifest (no console errors, no "manifest not found" warnings in DevTools).
4. On a supported Android device or Chrome desktop, the browser presents an "Add to Home Screen" / "Install App" prompt when visiting the site.
5. The manifest icon appears correctly (no broken image) when the app is added to a device home screen.
6. The installed app launches in standalone mode (no browser chrome), starts at the configured start URL, and displays the correct theme colour in the OS task switcher.
7. The `<link rel="manifest">` tag is present in the `<head>` of the homepage, authenticated routes, and public profile pages.
8. All manifest-referenced icon files exist in the static public directory and return HTTP 200.

---

## Session Context

Decisions resolved during the planning session (2026-04-10):

- **Starting version**: `1.0.0` — signals a production-ready product.
- **Icon assets**: No existing brand icons; create them under `design-system/icons` and reference from `apps/collectstory/public/`.
- **Changeset CI enforcement**: Manual convention is sufficient for now; no CI gate required in this iteration.
