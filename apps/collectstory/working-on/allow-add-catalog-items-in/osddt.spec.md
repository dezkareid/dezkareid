# Feature Specification: Bulk Catalog Item Import (JSON)

**Status**: Draft
**Feature Name**: `allow-add-catalog-items-in`
**Project**: `apps/collectstory`

## Overview
The goal of this feature is to allow users to add multiple items to their Collecstory catalogs efficiently by importing data from a JSON source. Currently, adding items requires manual entry for each individual piece, which is time-consuming for collectors with large inventories. By providing a bulk import mechanism, we significantly reduce the barrier to entry and improve the overall utility of the platform.

### Business Context
This feature aligns with Dezkareid Enterprise's strategic objectives and architecture principles as follows:

- **Objective: Efficiency & Velocity**: By standardizing a bulk data entry pattern, we enable users to build their catalogs faster, increasing the value they derive from the product.
- **Objective: High-Quality User Experience**: Reducing manual data entry effort directly contributes to a "fast and easy" user experience, aligning with our goal for superior usability.
- **Architecture Principle: Configuration-Driven Behavior**: Supporting external data formats (JSON) as a source for system state reflects our commitment to behavior controlled through external parameters.
- **Architecture Principle: Simplicity over Complexity**: Implementing a direct JSON import is a simple, maintainable solution for bulk operations compared to building complex interactive wizards or scrapers.

## Requirements
- **JSON Input**: The system must accept item data in JSON format via file upload or text pasting.
- **Schema Validation**: All imported data must be validated against the standard Collecstory item schema (e.g., name, description, tags, acquisition date).
- **Bulk Processing**: The system must process multiple items in a single operation.
- **Feedback Mechanism**: Users must receive clear feedback upon completion, including:
  - Total number of items successfully imported.
  - Detailed error messages for any items that failed validation (specifying field name and reason).
- **Data Integrity**: The system must ensure that only valid items are committed to the database.

## Scope
- **In Scope**:
  - File upload interface for `.json` files.
  - Text area for pasting JSON content.
  - Client-side and server-side validation of the JSON structure and content.
  - Database insertion of valid catalog items.
- **Out of Scope**:
  - Support for other formats (CSV, Excel) in this initial release.
  - Advanced mapping UI (e.g., "map your JSON keys to our fields").
  - Bulk image uploading as part of the JSON import (URLs to existing images are allowed).

## Acceptance Criteria
- A user can upload a valid JSON file with 50+ items and see them appear in their collection immediately.
- If the JSON is malformed, the system displays a clear "Invalid JSON format" error.
- If a required field (e.g., `title`) is missing from one of the items, the system reports exactly which item and which field is missing.
- The import process completes within 5 seconds for a batch of 100 items.

## Session Context
- The user specified that this feature should be implemented within the `apps/collectstory` package.
- The initial request was "allow add catalog items in bulk from json".

## Open Questions
- **Partial Imports**: Should the system allow "partial success" (importing valid items while skipping invalid ones) or should the entire batch fail if any item is invalid?
- **Schema Definition**: What are the mandatory fields for a catalog item in the current `collectstory` implementation?
- **Duplicate Handling**: How should the system handle items that appear to be duplicates of existing entries (e.g., same title and date)?
- **Rate/Size Limits**: Is there a maximum number of items or file size limit we should enforce for performance reasons?
