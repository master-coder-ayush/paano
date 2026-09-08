# Naano Clone

This is a working prototype foundation for a `naano.com` clone. It starts with a Next.js landing page, internationalized copy, Drizzle ORM, MySQL connectivity, and an API health check.

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
