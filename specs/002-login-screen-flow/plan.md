# Implementation Plan: Login Screen Flow

**Branch**: `002-login-screen-flow` | **Date**: 2026-07-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-login-screen-flow/spec.md`

## Summary

Implement a login screen in the frontend connected to a backend authentication API. Users provide email and password, receive a signed JWT token, and are redirected to the dashboard. The feature includes account lockout after failed attempts, IP-based rate limiting, localized error messages, audit logging, and an auth-guard that protects all authenticated routes.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**:
- Backend: NestJS, @nestjs/jwt, @nestjs/throttler, @nestjs/i18n, ioredis (Redis client)
- Frontend: Vite, TanStack Router, shadcn/ui, axios (API client)
- Shared: Zod (validation schemas in api-contracts)

**Storage**: PostgreSQL (user credentials); Redis (rate limiting counters, lockout state)

**Testing**: Jest (backend unit/integration), Vitest (frontend), Supertest (API contract tests)

**Target Platform**: Web — modern evergreen browsers (Chrome, Firefox, Safari, Edge), mobile/tablet/desktop viewports

**Project Type**: Web application (frontend + backend)

**Performance Goals**: Login flow completes in under 5 seconds page-load to dashboard on standard broadband (SC-001); API login response <500ms p95

**Constraints**:
- Arabic as default locale, RTL layout (constitution)
- Must use existing project structures (feature-based dirs, shared api-contracts)
- Token must be stored in localStorage (FR-005)
- ESLint + Prettier must pass before commits

**Scale/Scope**: Tens of charities, thousands of users; login-only (no registration, password reset, account management)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check |
|-----------|-------|
| I. Single Source of Truth | Login credentials validated against the user database; no duplication of auth logic |
| II. Tenant Isolation | Token includes tenant context; login resolves user's tenant |
| III. Complete Auditability | FR-020: All login attempts logged with user, IP, outcome |
| VII. Data Integrity | FR-003: Credentials validated server-side; FR-002: client-side validation first |
| VIII. Security & Privacy | FR-016–019: Lockout, rate limiting, centralized auth; passwords hashed |
| IX. API-First | FR-006: All communication via API; contracts in api-contracts package |
| XII. Code Quality | Business logic in services, not controllers (NestJS pattern) |
| XIII. Testing | Login flow must have automated tests for critical paths |
| XIV. Documentation | TDD record created at docs/tdd/002-login-screen-flow.md; ADR if needed |
| XV. Guiding Principles | Yes to all: registry integrity, tenant isolation, auditability, verifiability, collaboration, scalability |

**Result**: PASS — all constitutional principles are satisfied or have clear compliance paths. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/002-login-screen-flow/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)

docs/
└── tdd/
    └── 002-login-screen-flow.md  # TDD record (per Constitution XIV)
```

### Source Code (repository root)

```text
apps/backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   ├── guards/
│   │   │   └── throttle.guard.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   └── users/
│       └── users.service.ts
└── tests/
    └── auth/
        ├── auth.controller.spec.ts
        └── auth.service.spec.ts

apps/frontend/
├── src/
│   ├── routes/
│   │   ├── login.tsx
│   │   └── _authenticated.tsx
│   ├── components/
│   │   └── ui/
│   │       └── login-form.tsx
│   ├── lib/
│   │   ├── auth-context.tsx
│   │   └── api-client.ts
│   └── pages/
│       └── login-page.tsx
└── tests/
    └── login.test.tsx
```

**Structure Decision**: Feature-based modules in both backend (NestJS modules) and frontend (TanStack Router routes). Login lives in `apps/backend/src/auth/` and `apps/frontend/src/routes/`. Shared DTOs are defined in `packages/api-contracts/`.

## Complexity Tracking

No complexity violations identified. All patterns follow existing project conventions.
