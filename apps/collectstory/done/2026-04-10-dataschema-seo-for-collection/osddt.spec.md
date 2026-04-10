# Specification: DataSchema SEO for Collection Pages and Items

## Overview

This feature aims to update the structured data (JSON-LD) for collection pages and individual collection items within the **Collecstory** application. The goal is to align with Google's specific requirements for rich data, ensuring that collections are correctly indexed and eligible for enhanced search results (such as carousels or image lists).

Currently, collection items incorrectly use the `Product` schema. They should be transitioned to the `ImageObject` schema. Collection pages, which currently use a general `CollectionPage` schema, should be updated to implement an `ItemList` containing these `ImageObject` entries.

### Business Context

This update directly supports the **Innovation & Growth** objective for 2026, specifically the key result of expanding the Collecstory user base by 50% through improved organic discoverability (SEO). By providing high-quality structured data, we enhance our "Native Discoverability" architecture principle, allowing search engines to better understand and showcase user collections.

## Requirements

### 1. Collection Item Structured Data
- Individual collection items must emit `ImageObject` schema instead of `Product` schema.
- The `ImageObject` must include all required and recommended properties for Google Rich Results (e.g., `contentUrl`, `name`, `description`, `thumbnailUrl`).

### 2. Collection Page Structured Data
- Collection listing pages must implement the `ItemList` schema.
- The `ItemList` must contain an `itemListElement` array where each element is an `ImageObject` representing a collection item.
- Each `itemListElement` should ideally include a `url` pointing to the item's detail page and a `position` in the list.

### 3. Schema Accuracy
- All generated JSON-LD must be valid according to Schema.org and Google's Structured Data guidelines.
- The `Product` schema must be removed from collection items where it is no longer appropriate.

## Scope

- **In-Scope**:
  - Updating the JSON-LD generation logic for collection detail pages.
  - Updating the JSON-LD generation logic for collection listing pages.
  - Ensuring semantic alignment with Google's Rich Results requirements for images and lists.
- **Out-of-Scope**:
  - Visible UI/UX changes to the collection pages.
  - Changes to the underlying database schema or API data structures.
  - SEO updates for non-collection related pages.

## Acceptance Criteria

- The Google Rich Results Test (or Schema Markup Validator) confirms that collection item pages are correctly identified as `ImageObject`.
- The Google Rich Results Test confirms that collection listing pages are correctly identified as an `ItemList` of `ImageObject`.
- No critical errors or warnings are reported by Google's validation tools regarding missing required fields for these specific types.
- Search engine crawlers can successfully parse the new `ItemList` and `ImageObject` structures.

## Decisions

1. **Metadata**: Include `creator` in addition to standard `ImageObject` properties.
2. **Hierarchy**: `ItemList` should be the primary type as `CollectionPage` is not valid for Google's rich result requirements for this use case.
3. **Product Overlap**: `Product` schema should not be used; this is a universal change for Collecstory collection items.
