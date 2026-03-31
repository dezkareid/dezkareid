# Tasks: Web Quality Auditor Implementation

## Phase 1: Backend Foundation & Infrastructure
- [x] [S] Initialize NestJS application in `ui-tools/auditor/server`
- [x] [S] Setup Prisma with SQLite provider and configuration
- [x] [M] Define and migrate database schema (Domain, Url, Environment, AuditRun, Metric, Budget)
- [x] [M] Implement CRUD services and controllers for Domains, URLs, and Environments
- [x] [S] Add basic validation and error handling for CRUD operations

**Definition of Done**: A running NestJS API capable of managing URLs, domains, and environments, with data persisting in a local SQLite database.

## Phase 2: Audit Engine Core
- [x] [S] Install and configure `lighthouse`, `puppeteer`, and `chrome-launcher`
- [x] [M] Implement `AuditService` with headless Chrome execution and network/CPU throttling
- [x] [M] Implement Lighthouse result parsing and database persistence logic
- [x] [S] Implement Budget validation logic to flag "Out of Budget" audits
- [x] [S] Create API endpoint to trigger a manual audit for a specific URL

**Definition of Done**: The backend can successfully execute a Lighthouse audit against a given URL, apply environment-specific throttling, and save the results (including budget status) to the database.

## Phase 3: Frontend Foundation & UI Primitives
- [x] [S] Initialize Angular application in `ui-tools/auditor/client` (Standalone components, OnPush)
- [x] [S] Configure global styles using Vanilla CSS and `@dezkareid/design-tokens`
- [x] [M] Implement `ButtonComponent` mirroring `@dezkareid/components` design/API
- [x] [M] Implement `TagComponent` mirroring `@dezkareid/components` design/API
- [x] [M] Implement `CardComponent` mirroring `@dezkareid/components` design/API
- [x] [M] Implement `ThemeToggleComponent` mirroring `@dezkareid/components` design/API
- [x] [S] Setup routing (Dashboard, URL Management, Settings) and main Layout
- [x] [S] Implement API service using `HttpClient` and Angular Signals for state

**Definition of Done**: An Angular shell with a working theme toggle, navigation, and local UI primitives that match the project's design system.

## Phase 4: Dashboard & Analytics
- [x] [M] Develop URL Management UI: Views and forms for CRUD operations on Domains/URLs/Environments
- [x] [M] Develop Audit Execution UI: Status indicators and manual trigger buttons
- [x] [L] Develop Dashboard: Integrate `chart.js` for historical time-series of LCP, TBT, and CLS
- [x] [M] Implement Environment comparison view (e.g., side-by-side metrics for Local vs Prod)
- [x] [S] Implement Budget status visual indicators (Pass/Fail) across the dashboard

**Definition of Done**: A fully functional dashboard allowing users to manage URLs, run audits, and visualize performance trends over time with budget awareness.

## Phase 5: Refinement & Validation
- [x] [S] Implement background data retention policy (Prisma cleanup script for old runs)
- [x] [S] Perform accessibility audit (AXE) on the Auditor UI itself and fix violations
- [x] [M] Add unit and integration tests for core backend services and frontend components
- [x] [S] Finalize documentation (README.md) and local setup instructions

**Definition of Done**: The application is production-ready for local use, with automated cleanup, high accessibility, and comprehensive documentation.

## Dependencies
- Phase 2 depends on Phase 1 (Prisma models and API structure).
- Phase 4 depends on Phase 3 (UI primitives) and Phase 2 (Audit data availability).
- Phase 5 depends on all previous phases.
