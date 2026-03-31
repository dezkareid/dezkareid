# Web Quality Auditor

An internal tool to systematically measure, monitor, and ensure high standards of performance and accessibility across the Dezkareid Enterprise product portfolio.

## Architecture

- **Backend**: NestJS + Prisma + SQLite.
- **Frontend**: Angular 19 (Standalone, Signals, OnPush).
- **Audit Engine**: Lighthouse + Headless Chrome.

## Features

- **Domain & URL Management**: Organize URLs by domain and environment (Local, Dev, Production).
- **Automated Audits**: Run Lighthouse audits with standard mobile throttling.
- **Performance Budgets**: Define thresholds for key metrics (LCP, TBT, CLS).
- **Visual Dashboard**: Historical trends and environment comparisons using Chart.js.
- **Accessibility First**: Designed with WCAG AA compliance in mind.

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm

### Installation

1. Install dependencies from the monorepo root:
   ```bash
   pnpm install
   ```

2. Initialize the database:
   ```bash
   cd ui-tools/auditor
   npx prisma migrate dev --name init
   ```

### Running the Application

Always run tasks from the monorepo root using Turborepo:

- **Run Server**:
  ```bash
  pnpm turbo run dev:server --filter=@dezkareid/auditor
  ```

- **Run Client**:
  ```bash
  pnpm turbo run dev:client --filter=@dezkareid/auditor
  ```

- **Build Project**:
  ```bash
  pnpm build --filter=@dezkareid/auditor
  ```

## Development

The project is organized into two main parts:
- `server/`: NestJS application logic, database services, and audit engine.
- `client/`: Angular application with features for dashboard, URL management, and shared UI components.

### UI Components

We use local Angular versions of the `@dezkareid/components` library, located in `client/src/app/shared/components`. These use the shared design tokens from `@dezkareid/design-tokens`.
