# Specification: SEO and Metadata Improvements

## Overview
Enhance the discoverability and social sharing experience of Collectstory by implementing comprehensive SEO metadata and structured data (JSON-LD). This ensures that when collections or individual items are shared, they display rich previews with images, and search engines can better understand the content structure.

## Requirements

### 1. Open Graph Media for Collections
- Collection pages must include an `og:image` tag.
- The image should default to the first public item in the collection.
- If the collection is empty, a default brand/app image should be used.

### 2. Structured Data (JSON-LD) for Collections
- Collection pages must include a `CollectionPage` or `ItemList` schema.
- The schema should include the collection name, description, author (collector), and a list of items within the collection (if applicable).

### 3. Structured Data (JSON-LD) for Items
- Individual item pages must include a `Product` or `IndividualProduct` schema.
- The schema should include the item name, description, image, and relevant attributes like brand, line, and category.
- It should represent the item as a collectible or unique object.

## Scope

### In Scope
- Metadata generation for `/[username]/[collectionSlug]` (Collections).
- Metadata generation for `/[username]/[collectionSlug]/[slug]` (Items).
- Implementation of Open Graph image logic for collections.
- Implementation of JSON-LD scripts for both collections and items.

### Out of Scope
- SEO for other pages (e.g., franchises, stores) unless specifically requested later.
- Modifying the visual UI of the pages.
- Analytics or tracking of SEO performance.

## Acceptance Criteria
- [ ] Collection pages have a valid `og:image` tag in the `<head>`.
- [ ] Collection pages contain a valid `application/ld+json` script tag with collection-specific structured data.
- [ ] Item pages contain a valid `application/ld+json` script tag with product-specific structured data.
- [ ] All generated metadata reflects the actual content of the collection or item being viewed.
- [ ] The implementation does not negatively impact page load performance or SSR.

## Session Context
- The project uses Next.js and its built-in `Metadata` API (`generateMetadata`).
- The collection page currently lacks OG images.
- The item page has OG images but lacks structured data.
- Data is fetched from Supabase via `lib/collections.ts`.

## Decisions
1. **Default collection image**: Use a logo when no items with images are available.
2. **Item schema type**: Use the standard `Product` schema for figure items.
3. **Collection item list**: Only include items that have images in the `ItemList` schema.
