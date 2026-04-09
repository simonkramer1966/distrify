# Distrify

Vertical SaaS platform for film distribution finance. See [CLAUDE.md](./CLAUDE.md) for full product spec.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui
- **Backend:** Fastify, Prisma, PostgreSQL
- **Services:** Postgres 16, Redis 7, MinIO (S3)

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env
cp .env.example .env

# 3. Start services (Postgres, Redis, MinIO)
docker compose up -d

# 4. Generate Prisma client
pnpm --filter @distrify/api prisma:generate

# 5. Start dev (web:3000, api:4000)
pnpm dev
```

Health check: <http://localhost:4000/api/health>

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start web (3000) and api (4000) |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm type-check` | TypeScript type-check all packages |

## Structure

```
apps/
  web/       # Next.js frontend
  api/       # Fastify backend
packages/
  shared/    # Shared types
```
