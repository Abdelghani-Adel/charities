# Implementation Plan: System Architecture Foundation

**Branch**: `001-system-architecture-foundation` | **Date**: 2026-07-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-system-architecture-foundation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Establish the monorepo (apps/frontend, apps/backend, packages/api-contracts, packages/shared, packages/config), shared strongly-typed API contracts, NestJS feature-module backend, Vite + TanStack Router frontend with RTL/Arabic scaffolding, PostgreSQL migrations, JWT auth, RBAC with CASL, tenant isolation middleware, standardized error handling, correlation-based logging, and CI validation pipeline.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: NestJS, Vite, TanStack Router, shadcn/ui, PostgreSQL (via node-postgres or Prisma), CASL, Zod (validation), Jest, Vitest, ESLint, Prettier

**Storage**: PostgreSQL

**Testing**: Jest (backend), Vitest (frontend, contracts)

**Target Platform**: Web (desktop, tablet, mobile) — modern evergreen browsers

**Project Type**: Web application (monorepo with frontend + backend)

**Performance Goals**: <200ms p95 API response for standard queries; frontend Lighthouse score >90

**Constraints**: RTL/Arabic locale as default from initial scaffolding; responsive layouts at all breakpoints; feature-based directory structure

**Scale/Scope**: Tens of charities, thousands of indigent/aid records

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Single Source of Truth | ✅ Pass | Shared contracts in packages/api-contracts; no type duplication |
| II. Tenant Isolation | ✅ Pass | Tenant context resolution middleware; FR-012, FR-013 |
| III. Complete Auditability | ✅ Pass | Audit log entity; correlation logging; FR-022–025 |
| IV. Approval-Based Changes | ⬜ N/A | Handled by downstream Change Request feature spec |
| V. Aid Transparency | ⬜ N/A | Handled by downstream Aid Recording feature spec |
| VI. Abuse Prevention | ⬜ N/A | Handled by downstream Abuse Reporting feature spec |
| VII. Data Integrity | ✅ Pass | Backend-enforced validation (FR-020); FK constraints (FR-017) |
| VIII. Security & Privacy | ✅ Pass | JWT auth, RBAC, HTTPS termination assumption, least privilege |
| IX. API-First Development | ✅ Pass | Shared contracts, URL path versioning (FR-018) |
| X. Reliability | ✅ Pass | Transactional DB operations implied; standardized error handling (FR-021) |
| XI. Scalability | ✅ Pass | Scale target defined (SC-008); indexed FKs (NFR) |
| XII. Code Quality | ✅ Pass | Feature modules, clear layering (FR-003–007) |
| XIII. Testing | ✅ Pass | Unit, integration, dedicated auth/tenant tests (FR-026–028) |
| XIV. Documentation | ✅ Pass | ADRs mandated; plan artifacts document architecture |
| XV. Guiding Principles | ✅ Pass | All 6 questions answer Yes |

**Gate verdict**: ✅ Pass — no violations requiring justification. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-system-architecture-foundation/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── charities/
│   │   ├── users/
│   │   ├── indigents/
│   │   ├── aid/
│   │   ├── abuse/
│   │   ├── change-requests/
│   │   ├── fundraising/
│   │   ├── donations/
│   │   ├── audit/
│   │   └── common/
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── tests/

packages/
├── api-contracts/       # DTOs, API types, validation schemas
├── shared/              # Enums, constants, utilities
└── config/              # Shared environment configuration

scripts/                 # Development scripts (setup, lint, test)
```

**Structure Decision**: Monorepo with feature-based backend modules (NestJS convention), route-based frontend pages (TanStack Router convention), and shared packages for contracts and utilities. Selected because it enforces clear boundaries, prevents contract duplication, and matches the constitution's feature-based requirement.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — section intentionally left empty.
