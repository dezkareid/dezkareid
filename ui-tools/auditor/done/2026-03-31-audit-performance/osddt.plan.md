# Implementation Plan: Web Quality Auditor

## Architecture Overview
The Web Quality Auditor will be a standalone tool within the `ui-tools/auditor` directory, composed of a NestJS backend and an Angular frontend.

- **Backend (NestJS)**: 
    - **API Layer**: Provides RESTful endpoints for managing URLs, Environments, and retrieving Audit results.
    - **Service Layer**: Manages the audit execution lifecycle using Lighthouse and Puppeteer.
    - **Persistence Layer**: Uses Prisma ORM with SQLite for a lightweight, zero-configuration local database.
    - **Task Scheduling**: Local execution of audits triggered via API or simple internal scheduler.
- **Frontend (Angular)**:
    - **Architecture**: Modern Angular (v19+) using standalone components, signals for state management, and `OnPush` change detection.
    - **UI/UX**: Since `@dezkareid/components` does not currently support Angular, we will implement local Angular versions of necessary components (Button, Tag, Card, ThemeToggle) in the client application. These will use the shared CSS from `@dezkareid/components/css` and design tokens from `@dezkareid/design-tokens` to maintain consistency. The implementation will mirror the design and API of the existing components as closely as possible to facilitate future migration into a shared `@dezkareid/components/angular` package.
    - **Visualization**: Charting libraries to display historical performance trends and budget compliance.

## Implementation Phases

### Phase 1: Backend Foundation & Infrastructure
- [ ] Initialize NestJS application in `ui-tools/auditor/server`.
- [ ] Setup Prisma with SQLite provider.
- [ ] Define database schema:
    - `Domain`: Logical grouping of URLs.
    - `Url`: The specific page to be audited.
    - `Environment`: Configuration for Production, Dev, Local (URL prefixes, headers).
    - `AuditRun`: Metadata about a specific audit execution.
    - `Metric`: Individual performance/accessibility scores and values.
    - `Budget`: Thresholds for performance metrics.
- [ ] Implement CRUD API for Domains, URLs, and Environments.

### Phase 2: Audit Engine Core
- [ ] Integrate `lighthouse`, `puppeteer`, and `chrome-launcher`.
- [ ] Implement `AuditService` to:
    - Launch headless Chrome.
    - Apply network and CPU throttling based on Environment configuration.
    - Execute Lighthouse audit.
    - Parse and persist results into the SQLite database.
- [ ] Implement Budget validation logic (compare audit results against defined thresholds).

### Phase 3: Frontend Foundation & UI Primitives
- [ ] Initialize Angular application in `ui-tools/auditor/client`.
- [ ] Configure global styles using Vanilla CSS and `@dezkareid/design-tokens`.
- [ ] Implement local Angular UI primitives using `@dezkareid/components/css` BEM classes and Vanilla CSS:
    - `ButtonComponent`
    - `TagComponent`
    - `CardComponent`
    - `ThemeToggleComponent`
- [ ] Set up routing for Dashboard, URL Management, and Settings.
- [ ] Implement core Layout component (Navigation, Sidebar).
- [ ] Create shared services for API interaction using Angular `inject()` and `signal`.

### Phase 4: Dashboard & Analytics
- [ ] Develop **URL Management UI**: Forms to add/edit URLs, assign to domains, and set budgets.
- [ ] Develop **Audit Execution UI**: Trigger manual audits and see real-time status.
- [ ] Develop **Dashboard**:
    - Summary view of all domains.
    - Time-series charts for key metrics (LCP, TBT, CLS).
    - Comparison view for different environments (e.g., Local vs Prod).
    - Budget status visualization (Pass/Fail).

### Phase 5: Refinement & Validation
- [ ] Implement data retention policy (cleanup old audit runs).
- [ ] Add accessibility checks to the Auditor UI (WCAG AA compliance).
- [ ] Comprehensive testing (Unit and Integration).
- [ ] Final documentation (README.md, setup instructions).

## Technical Dependencies
- **Backend**:
    - `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
    - `@prisma/client`, `prisma`
    - `lighthouse`, `puppeteer`, `chrome-launcher`
- **Frontend**:
    - `@angular/core`, `@angular/common`, `@angular/router`, `@angular/forms`
    - `chart.js`, `ng2-charts` (or similar visualization library)
    - `@dezkareid/design-tokens`, `@dezkareid/components`

## Risks & Mitigations
- **Resource Consumption**: Lighthouse audits are heavy. *Mitigation: Queue audits to run sequentially.*
- **Database Growth**: Storing full reports is expensive. *Mitigation: Store only aggregate metrics and critical "opportunity" data in SQLite; archive or discard full JSON reports.*
- **Network Flakiness**: Local network impacts synthetic audits. *Mitigation: Use strict network emulation and multiple runs to average results if necessary.*

## Out of Scope
- Multi-user authentication and authorization.
- Cloud hosting or remote database.
- Real User Monitoring (RUM).
- Automated remediation of performance issues.
