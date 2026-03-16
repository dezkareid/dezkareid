# Spec: Create Types for Speculation Rules API

## Overview
The Speculation Rules API allows developers to specify which URLs should be prefetched or prerendered by the browser to improve perceived page load performance. This feature provides a type-safe way for developers to define these rules in TypeScript, ensuring they follow the correct JSON structure required by the API.

## Requirements
- **Functional Requirements**:
  - The system must provide TypeScript interfaces for the `SpeculationRules` object.
  - Support for the `prefetch` and `prerender` actions.
  - Support for both `list` and `document` sources.
  - Support for the `eagerness` setting (`immediate`, `eager`, `moderate`, `conservative`).
  - Support for URL-based filtering (`where` property for document sources).
  - Ability to specify a `referrer_policy` and `target_hint` for speculation rules.

## Scope
- **In Scope**:
  - TypeScript types and interfaces representing the Speculation Rules JSON structure.
  - Exported from the `@dezkareid/types` package.
  - Support for experimental features like `target_hint` and `referrer_policy`.
- **Out of Scope**:
  - Any browser-side implementation or polyfills for the API.
  - Any logic to automatically inject these rules into the HTML.
  - Logic to stringify or validate the rules at runtime.

## Acceptance Criteria
- [ ] A `SpeculationRules` interface is exported, allowing for both `prefetch` and `prerender` arrays.
- [ ] Support for the `source: "list"` with a `urls` array is included.
- [ ] Support for the `source: "document"` with a `where` filter is included.
- [ ] All `eagerness` levels (`immediate`, `eager`, `moderate`, `conservative`) are correctly typed.
- [ ] The types accurately reflect the current W3C Speculation Rules specification, including experimental fields.

## Session Context
The types will be added to the newly initialized `@dezkareid/types` package, which is set up with TypeScript and exports to a `dist` directory. Reusability is a priority, so a shared `SpeculationRule` type will be used where appropriate.

## Open Questions
(None - all resolved in session)
