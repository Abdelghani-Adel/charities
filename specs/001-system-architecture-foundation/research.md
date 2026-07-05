# Research: System Architecture Foundation

## Overview

Research findings for the foundational architecture decisions of the Unified Charity Indigent Management System. All NEEDS CLARIFICATION items from the spec were resolved during the `/speckit.clarify` session.

---

## Decision Log

### 1. Monorepo Tool

- **Decision**: Use npm workspaces (built into npm 7+) for monorepo management
- **Rationale**: Zero additional tooling dependency; native npm support; sufficient for project scale (tens of charities, thousands of records); team familiarity
- **Alternatives considered**: Turborepo (heavier, adds build caching overhead not yet needed), Nx (too opinionated for initial setup), pnpm workspaces (viable but adds adoption friction)

### 2. Backend Framework

- **Decision**: NestJS with feature-based module structure
- **Rationale**: Mandated by constitution; provides built-in modular architecture, dependency injection, guards/interceptors for authN/Z, and TypeScript-first design
- **Alternatives considered**: Express (too minimal, no architectural enforcement), Fastify (faster but ecosystem smaller)

### 3. Frontend Framework

- **Decision**: Vite + TanStack Router + shadcn/ui
- **Rationale**: Mandated by constitution; Vite provides fast HMR; TanStack Router offers type-safe routing; shadcn/ui provides accessible component primitives
- **Alternatives considered**: Next.js (SSR not required; SPA sufficient), React Router (less type-safe)

### 4. API Contract Strategy

- **Decision**: Shared TypeScript package (`packages/api-contracts`) with typed DTOs, Zod validation schemas, and API route definitions consumed by both frontend and backend
- **Rationale**: Single source of truth; compile-time contract enforcement; eliminates duplication
- **Alternatives considered**: OpenAPI codegen (adds build step; generated types harder to debug), tRPC (tight coupling, not REST)

### 5. Database ORM / Query

- **Decision**: Prisma (recommended for NestJS + PostgreSQL)
- **Rationale**: Type-safe queries, auto-generated client, migration tooling built-in, strong NestJS integration via `@nestjs/prisma`
- **Alternatives considered**: TypeORM (heavier, less performant), Knex (no type safety), raw SQL (no migration management)

### 6. Authentication

- **Decision**: JWT-based access tokens with NestJS Passport strategy
- **Rationale**: Stateless auth fits REST API model; JWT signed tokens can carry tenant context; Passport provides strategy abstraction
- **Alternatives considered**: Session-based (requires state store), OAuth2 (premature for current scale)

### 7. Authorization

- **Decision**: CASL for role-based access control
- **Rationale**: Mandated by constitution; CASL provides declarative permission rules; integrates with NestJS via guards
- **Alternatives considered**: NestJS built-in guards (no rule engine), custom RBAC (reinventing the wheel)

### 8. Validation

- **Decision**: Zod for runtime validation (shared between frontend and backend)
- **Rationale**: Shared validation schemas in `packages/api-contracts`; Zod works in both Node.js and browser; TypeScript inference
- **Alternatives considered**: Joi (Node-only), class-validator (NestJS native but couples to decorator syntax)

### 9. Tenant Isolation

- **Decision**: Request-scoped middleware that resolves tenant from JWT claims; repository-level filtering by tenant ID
- **Rationale**: Tenant context resolved once per request; all queries automatically scoped; prevents accidental cross-tenant leaks
- **Alternatives considered**: Separate database per tenant (overkill for scale), schema-per-tenant (complex migration management)

### 10. RTL / Arabic Localization

- **Decision**: shadcn/ui RTL support + i18n library (react-i18next) with Arabic as default locale
- **Rationale**: shadcn/ui components support RTL out of the box; react-i18next is mature and supports Arabic pluralization rules
- **Alternatives considered**: Custom RTL handling (maintenance burden), next-intl (Next.js oriented)

### 11. API Versioning

- **Decision**: URL path versioning (`/v1/resource`, `/v2/resource`) with NestJS global prefix
- **Rationale**: Explicit, visible in logs, easy to route, no header negotiation complexity
- **Alternatives considered**: Header versioning (harder to debug), no versioning (risks breaking clients)

### 12. Error Handling

- **Decision**: NestJS exception filters returning standardized `{ status, message, code, correlationId }` response format
- **Rationale**: Consistent error shape consumed by frontend; correlationId links to server logs; internal details never exposed
- **Alternatives considered**: Custom middleware (filters are the NestJS idiomatic approach)

### 13. Logging

- **Decision**: Structured JSON logging with correlation IDs via NestJS logger + Pino
- **Rationale**: Correlation IDs trace requests across services; structured JSON enables log aggregation; Pino is production-grade
- **Alternatives considered**: Console.log (no structure), Winston (heavier)

### 14. CI Pipeline

- **Decision**: GitHub Actions for formatting (Prettier), linting (ESLint), type checking (tsc), and test execution (Jest/Vitest)
- **Rationale**: Matches common Node.js monorepo patterns; GitHub-native; minimal configuration overhead
- **Alternatives considered**: GitLab CI, CircleCI — not applicable (GitHub-hosted)

### 15. Testing Strategy

- **Decision**: Unit tests for business logic (Jest/Vitest); integration tests for API endpoints (Supertest); dedicated auth/tenant isolation tests
- **Rationale**: FR-026–028 mandate test coverage; Supertest works directly with NestJS HTTP testing utilities
- **Alternatives considered**: Cypress E2E (too heavy for foundation), Postman/Newman (external, not integrated)

### 16. Database Schema Conventions

- **Decision**: UUID primary keys, `created_at`/`updated_at` timestamps, soft deletion via `deleted_at` column, `created_by` FK where applicable
- **Rationale**: FR-029 mandates these conventions; UUIDs prevent sequential ID enumeration; soft deletion preserves audit trail
- **Alternatives considered**: Auto-increment IDs (sequential, leak info), hard delete (violates auditability)
