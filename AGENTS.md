<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Notes

This repository is a Naano clone prototype built with the Next.js App Router.

Core stack:

- Next.js 16 with React 19 and TypeScript.
- Tailwind CSS 4 for styling through `app/globals.css` and utility classes.
- `lucide-react` for interface icons.
- `next-intl` for internationalization. Request config lives in `i18n/request.ts`, and English messages live in `messages/en.json`.
- Drizzle ORM for database access.
- Drizzle Kit for schema migrations. The schema lives in `db/schema.ts`, migration output goes to `drizzle/`, and config lives in `drizzle.config.ts`.
- MySQL via `mysql2`, configured through `DATABASE_URL`.

Useful commands:

- `npm run dev` starts the local Next.js server.
- `npm run build` runs the production build.
- `npm run lint` runs ESLint.
- `npm run db:generate` creates Drizzle migrations from `db/schema.ts`.
- `npm run db:migrate` applies migrations to the configured MySQL database.
- `npm run db:studio` opens Drizzle Studio.
