# ADR 001: Monorepo Structure

## Status
Accepted

## Context
The charities platform needs to serve multiple applications (NestJS backend, Vite frontend) with shared code (validation schemas, types, enums, config). Each team member must be able to work across packages without friction.

## Decision
Use npm workspaces monorepo with this structure:
- `apps/backend` — NestJS API server
- `apps/frontend` — Vite + React + TanStack Router SPA
- `packages/api-contracts` — Zod schemas and TypeScript types
- `packages/shared` — Enums, constants, shared utilities
- `packages/config` — Environment validation schemas

## Consequences
- Single `npm install` at root installs all dependencies
- Shared packages are referenced via workspace protocol (`"@charities/api-contracts": "*"`)
- Build order enforced via root `npm run build` script with explicit workspace ordering
- All packages share root `tsconfig.json` base config with per-package overrides
- ESLint runs across all workspaces from a single root config
