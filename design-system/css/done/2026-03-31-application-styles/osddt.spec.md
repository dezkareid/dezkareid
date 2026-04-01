# Specification: Application Styles Package

## Overview
The goal of this feature is to create a shared CSS package within the `design-system/css` directory that provides common styles, resets, and layout utilities for application pages across the monorepo. By extracting and consolidating styling patterns from `apps/main-website` and `apps/collectstory`, we aim to improve visual consistency, reduce redundancy, and simplify the creation of new application pages.

Additionally, we will provide comprehensive documentation in the form of an `AGENTS.md` file to guide AI agents in understanding the structure and usage of this new package.

## Requirements
- **Extraction of Common Styles**: Identify and extract common CSS patterns from `apps/main-website` and `apps/collectstory`, including:
    - Global resets and base styles (typography, box-sizing, link behavior).
    - Page-level layout containers and spacing.
    - Common utility classes (e.g., visibility, scroll-reveal).
- **Shared CSS Implementation**: Implement the extracted styles in the `design-system/css` package.
- **Agent Documentation**: Create an `AGENTS.md` file in `design-system/css` that provides:
    - An overview of the package's purpose and structure.
    - Guidance on how to use and extend the shared styles.
    - Reference to key CSS custom properties and utility classes.
- **Consistency with Design Tokens**: Ensure all styles strictly adhere to the project's design tokens by using `@dezkareid/design-tokens`.

## Scope
- **In-Scope**:
    - Research and analysis of `apps/main-website` and `apps/collectstory` style files.
    - Creation of new CSS files and structure within `design-system/css`.
    - Creation of `AGENTS.md` for AI agent guidance.
- **Out-of-Scope**:
    - Modifying `apps/main-website` or `apps/collectstory` to consume the new shared styles (this will be handled in a separate feature).
    - Refactoring existing component-specific styles within the applications.

## Acceptance Criteria
- A new shared CSS structure is implemented in `design-system/css`.
- Shared styles include global resets, typography, and basic layout utilities.
- The `AGENTS.md` file is present in `design-system/css` and provides clear, actionable information for AI agents.
- All new styles use CSS custom properties from `@dezkareid/design-tokens`.
- The build process for `design-system/css` is updated (if necessary) to include the new shared styles.

## Session Context
- The package `design-system/css` was identified as the target for these shared styles.
- Initial exploration revealed that both `main-website` and `collectstory` use `@dezkareid/design-tokens` but have overlapping global resets and base styles that can be unified.
- `main-website` uses a `reveal` utility for scroll animations, which is a candidate for the shared package.

## Decisions
1. **Import Strategy**: Both approach: provide both individual modules and a bundled `index.css`.
2. **Naming Convention & Layout Patterns**: Use BEM for naming and OOCSS (Object-Oriented CSS) to split responsibility in layout patterns.
3. **Theming Logic**: Automatic theming base: include base styles that automatically react to `.light` / `.dark` classes or system preferences.
