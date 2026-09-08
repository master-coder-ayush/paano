# Paano

Paano is a planned B2B LinkedIn creator marketplace inspired by `naano.com`. The product will let brands discover vetted LinkedIn creators, create campaign briefs, manage collaborations, track creator-post performance, handle billing/payouts, and later expand into agencies, enterprise controls, automation, and third-party integrations.

This repository is currently a scaffolded Next.js prototype. Product planning lives in `docs/` and should be treated as the source of truth before development begins.

## Product Documentation

- [Product roadmap](docs/features.md) defines the seven product versions and the order in which capabilities should be built.
- [Data model](docs/data-model.md) defines the baseline entities, fields, ownership rules, statuses, and later-version tables.
- [Sprint pack](docs/sprints/README.md) explains how to use the sprint documentation.
- `docs/sprints/version-1` through `docs/sprints/version-7` contain seven sprint files per version.
- [Module docs](docs/modules/README.md) explains the module-documentation requirement.

Every sprint file lists affected modules. Before implementing a sprint, developers must read or create the corresponding `docs/modules/<module>.md` files and keep them updated with routes, data entities, service contracts, permissions, state transitions, edge cases, and test notes.

## Security Requirements

All product changes must be protected by authentication and role-based access control.

- Protected pages, server actions, route handlers, and APIs must resolve the authenticated user before reading or changing data.
- Mutation/API endpoints must require an authentication header token, using an `Authorization: Bearer <token>` style contract unless the module doc defines a stricter standard.
- RBAC must be enforced server-side against workspace membership, workspace role, entity ownership, and module-specific permissions.
- UI hiding is not sufficient; unauthorized requests must fail even when called directly.
- Public routes, such as marketing pages, creator cards, tracking redirects, and pixel ingestion, must be explicitly documented as public and must not leak protected workspace data.
- New data model changes must document ownership, token/auth requirements, permission checks, and audit/activity expectations.

## Version Strategy

The product is intentionally sequenced so codebase-only features come before third-party integrations:

1. Version 1: foundation and manual marketplace.
2. Version 2: complete self-serve workflow.
3. Version 3: first-party tracking, pixel, attribution, and results.
4. Version 4: agencies, public growth tools, and content engine with no required integrations.
5. Version 5: enterprise codebase features, internal API/webhooks, rule-based matching, managed ops, and automation.
6. Version 6: payments, payouts, AI assistance, email, LinkedIn import, calendar, and community integrations.
7. Version 7: CRM, SSO, e-signature, tax, data warehouse, and multi-channel integrations.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- lucide-react
- next-intl
- Drizzle ORM
- Drizzle Kit migrations
- MySQL with mysql2
- ESLint

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Set `DATABASE_URL` in `.env.local`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/naano"
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` renders the landing page.
- `/api/health` returns service status and checks MySQL connectivity.

If `DATABASE_URL` is not configured or MySQL is unavailable, `/api/health` returns `503` with `database.connected: false`.

## Database

The Drizzle schema is in `db/schema.ts`.

Generate migrations:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

Open Drizzle Studio:

```bash
npm run db:studio
```

Migration files are written to `drizzle/`.

## Checks

Run the production build:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```
