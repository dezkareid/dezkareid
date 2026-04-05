# Feature Specification: Franchise Catalog

**Feature:** `add-serie-store`
**Date:** 2026-04-05
**Status:** Draft

---

## Overview

Collectstory allows collectors to organise figures and collectibles into personal collections, but currently lacks a concept of *franchise or intellectual-property series*. Items can be grouped by brand and line, yet there is no way to express that a Dragon Ball figure, a Naruto figure, and a Saint Seiya figure each belong to different animated franchises — nor that Saint Seiya is known as *Caballeros del Zodiaco* in Latin America.

This feature introduces a **Franchise Catalog**: a curated, admin-managed reference entity that represents an IP franchise (e.g. Dragon Ball, Naruto, Saint Seiya). Each franchise carries an *official name* and zero or more *localised names* keyed by region or locale. Collection items can then be linked to a franchise, enabling franchise-based discovery, filtering, and SEO-driven landing pages.

The feature directly supports the strategic goal of expanding the Collecstory user base through improved organic discoverability, and aligns with the architecture principle of *native discoverability* by making content structured and indexable by franchise name and regional aliases.

---

## Business Context

| Company Outcome | Alignment |
|---|---|
| Expand Collecstory user base 50% via SEO and discoverability | Franchise pages become unique, crawlable content surfaces per franchise and per locale name |
| 20% increase in lead generation for Personal Website | — (not primary) |
| High-Quality User Experience | Franchise browsing reduces friction when discovering figures by franchise |
| Efficiency & Velocity | Standardised reference catalog pattern (matches existing brands/lines/categories) reuses established infrastructure |

**Architecture principles applied:**
- **Native Discoverability** — franchise slugs and localised names enable semantic URLs and structured data (e.g. `/franchises/saint-seiya`, with alternate title metadata)
- **Simplicity over Complexity** — franchise is a lightweight reference table; localisation is additive data, not a new i18n system
- **Configuration-Driven Behavior** — admin controls the canon franchise catalog; no hard-coded franchise data
- **Integrity and Auditability** — admin-managed catalog with clear ownership (not user-editable)

---

## Requirements

### Franchise Catalog (Admin)

1. Admins can **create a franchise** with:
   - An official name (required, e.g. "Saint Seiya")
   - A unique URL-safe slug (required, auto-derived from official name, editable)
   - An optional description
   - A cover image (required)
2. Admins can **add localised names** to a franchise, each with:
   - A locale or region identifier (BCP 47 code, e.g. `es-419`, `ja`, `en`)
   - The name as known in that locale (e.g. "Caballeros del Zodiaco")
3. Admins can **edit** and **delete** franchises and their localised names.
4. The franchise catalog is publicly readable (any visitor can see franchises and their names).

### Linking Items to a Franchise

5. When creating or editing a collection item, users can **optionally assign a franchise** from the catalog.
6. A single item may belong to **at most one franchise**.
7. The link to a franchise is optional — existing items without a franchise remain valid.
8. If a franchise is deleted, the item's franchise link is removed and the item remains intact.

### Public Discovery

9. A **franchise detail page** is publicly accessible at a canonical URL (e.g. `/franchises/saint-seiya`) and displays:
   - The official name
   - All localised names and their locale codes
   - A grid of public collection items linked to that franchise
10. A **franchise index page** lists all franchises in the catalog, each linking to its detail page.
11. A franchise detail page accessed via a localised name slug performs a 301 redirect to the canonical URL, to avoid duplicate content.
12. The collection item detail page displays the linked franchise name (if any), linking to the franchise page.

---

## Scope

### In Scope

- Franchise entity: official name, slug, optional description, required cover image
- Franchise localised names: BCP 47 locale code + name pairs (one-to-many per franchise)
- Admin CRUD for franchises and localised names
- Optional `franchise_id` foreign key on `collection_items` (nullable, `ON DELETE SET NULL`)
- Franchise detail page (public) and franchise index page (public)
- Item form: franchise selector when creating/editing an item
- Standalone franchise browse section (public)

### Out of Scope

- User-created franchises (franchises are admin-curated only)
- Assigning multiple franchises to one item
- Full internationalisation (i18n) of the UI — only the *franchise names* are localised, not the interface
- Automatic locale detection for name display (localised names are informational)
- Search across franchise localised names (stretch goal, not v1)
- Franchise-level analytics or engagement metrics

---

## Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | An admin can create a franchise with an official name, slug, and cover image; it appears in the franchise index page |
| AC-2 | An admin can add a localised name (e.g. locale `es-419`, name "Caballeros del Zodiaco") to the Saint Seiya franchise |
| AC-3 | A user editing a collection item can select a franchise from a dropdown; the item is saved with that franchise association |
| AC-4 | An item with no franchise selected saves successfully (the field is optional) |
| AC-5 | The franchise detail page at `/franchises/<slug>` displays the official name, all localised names with their locale codes, and all public items linked to that franchise |
| AC-6 | The franchise index page lists all franchises and links to each detail page |
| AC-7 | Removing a franchise from an item (setting it to none) works without error |
| AC-8 | Deleting a franchise from the admin catalog sets `franchise_id = null` on all associated items; items are not deleted |
| AC-9 | The item detail page shows the linked franchise name, linked to the franchise page |
| AC-10 | An admin can delete a localised name without deleting the franchise itself |
| AC-11 | Accessing `/franchises/caballeros-del-zodiaco` performs a 301 redirect to `/franchises/saint-seiya` |
| AC-12 | Private items are not shown on franchise pages |

---

## Decisions

1. **Slug resolution for localised names**: Localised name slugs (e.g. `/franchises/caballeros-del-zodiaco`) perform a canonical redirect (HTTP 301) to the official slug (e.g. `/franchises/saint-seiya`). This avoids duplicate content SEO penalties.
2. **Franchise cover image**: Required at launch. The admin create/edit form must include a cover image upload; a franchise cannot be saved without one.
3. **Locale identifier format**: Use BCP 47 structured codes (e.g. `es-419`, `ja`, `en`). Free-text labels are not accepted.
4. **Franchise filter placement**: Standalone franchise browse section only (not embedded in collector profile or collection pages) for v1.
5. **Franchise on item visibility**: Item visibility always governs. Private items are never shown on franchise pages, regardless of the franchise being public.
