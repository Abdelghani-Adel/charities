---

description: "Task list for implementing the System Architecture Foundation"

---

# Tasks: System Architecture Foundation

**Input**: Design documents from `specs/001-system-architecture-foundation/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: FR-026–028 mandate unit, integration, and dedicated auth/tenant tests — included as implementation tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo root**: `apps/backend/`, `apps/frontend/`, `packages/`
- **Backend**: `apps/backend/src/` (feature modules), `apps/backend/prisma/` (schema)
- **Frontend**: `apps/frontend/src/` (components, pages, routes, services)
- **Contracts**: `packages/api-contracts/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and monorepo structure

- [ ] T001 Initialize root package.json with npm workspaces at `/package.json`
- [ ] T002 [P] Create apps/backend NestJS project with `@nestjs/cli` at `/apps/backend/`
- [ ] T003 [P] Create apps/frontend Vite + React + TypeScript project at `/apps/frontend/`
- [ ] T004 [P] Create packages/api-contracts TypeScript library at `/packages/api-contracts/`
- [ ] T005 [P] Create packages/shared TypeScript library at `/packages/shared/`
- [ ] T006 [P] Create packages/config TypeScript library at `/packages/config/`
- [ ] T007 [P] Configure ESLint flat config at `/eslint.config.js` and Prettier at `/.prettierrc`
- [ ] T008 [P] Configure root tsconfig with project references at `/tsconfig.json`
- [ ] T009 Create root scripts (`setup`, `build`, `lint`, `typecheck`, `test`, `ci`) in `/package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 [P] Configure Prisma with PostgreSQL in `/apps/backend/prisma/schema.prisma` — add base conventions (UUID PKs, timestamps, soft-delete mixin)
- [ ] T011 [P] Create NestJS common module structure at `/apps/backend/src/common/` — include empty global filter, pipe, and interceptor directories
- [ ] T012 [P] Create shared environment configuration in `/packages/config/src/env.ts` with validation
- [ ] T013 Set up GitHub Actions CI workflow at `/.github/workflows/ci.yml` — lint, typecheck, test, build stages

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 — Developer Sets Up the Monorepo (Priority: P1) 🎯 MVP

**Goal**: Developer can clone, install, build, and lint the entire monorepo with a single command.

**Independent Test**: `git clone <repo> && npm install && npm run build && npm run lint && npm run typecheck` — all packages compile and pass checks.

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create root `.gitignore` with Node.js defaults at `/.gitignore`
- [ ] T015 [P] [US1] Configure npm workspace scripts (install, build, lint, typecheck) in `/package.json` using `--workspaces` flag
- [ ] T016 [P] [US1] Create build ordering — add `"build"` script in each package/package.json with correct dependency order in root `/package.json`
- [ ] T017 [US1] Verify monorepo builds end-to-end — run `npm install && npm run build && npm run lint && npm run typecheck` and fix any issues

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 — Developer Runs the Backend with Database (Priority: P2)

**Goal**: Developer starts the backend, PostgreSQL migrations run, health endpoint responds.

**Independent Test**: Start PostgreSQL, run `cd apps/backend && npm run migration:run && npm run start:dev`, then `curl localhost:3000/api/v1/health` returns success.

### Implementation for User Story 2

- [ ] T018 [P] [US2] Create Charity and User Prisma models in `/apps/backend/prisma/schema.prisma` per data-model.md
- [ ] T019 [P] [US2] Create Role Permission Prisma model in `/apps/backend/prisma/schema.prisma` per data-model.md
- [ ] T020 [P] [US2] Create initial Prisma migration with `npx prisma migrate dev --name init` in `/apps/backend/prisma/migrations/`
- [ ] T021 [P] [US2] Create NestJS AppModule with global prefix `/api/v1` in `/apps/backend/src/app.module.ts`
- [ ] T022 [P] [US2] Create health-check module — controller at `/apps/backend/src/health/health.controller.ts`, module at `/apps/backend/src/health/health.module.ts`
- [ ] T023 [US2] Configure PrismaModule and database connection in `/apps/backend/src/prisma/` — include service and module
- [ ] T024 [P] [US2] Create NestJS Passport JWT auth module — strategy at `/apps/backend/src/auth/jwt.strategy.ts`, guard at `/apps/backend/src/auth/jwt-auth.guard.ts`, module at `/apps/backend/src/auth/auth.module.ts`
- [ ] T025 [P] [US2] Create auth endpoints — login controller at `/apps/backend/src/auth/auth.controller.ts` with `/api/v1/auth/login` POST
- [ ] T026 [US2] Configure NestJS CORS, validation pipe, and global prefix in `/apps/backend/src/main.ts`
- [ ] T027 [US2] Write backend integration tests — health endpoint, auth login flow, unauthenticated rejection in `/apps/backend/tests/integration/`

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 — Developer Runs the Frontend Connected to Shared Contracts (Priority: P3)

**Goal**: Developer starts the frontend, which imports shared contracts and renders the login page in Arabic RTL.

**Independent Test**: Start frontend dev server, navigate to localhost:5173 — app renders without console errors, login page displays in Arabic RTL layout.

### Implementation for User Story 3

- [ ] T028 [P] [US3] Create shared API contracts in `/packages/api-contracts/src/` — Zod validation schemas for Charity, User, Indigent, Auth (login/register) DTOs, and API route type definitions
- [ ] T029 [P] [US3] Create shared enums and constants in `/packages/shared/src/` — role enums, aid type enums, error code constants
- [ ] T030 [P] [US3] Create Vite + React app entry at `/apps/frontend/src/main.tsx` with TanStack Router provider
- [ ] T031 [P] [US3] Create shadcn/ui component configuration at `/apps/frontend/components.json` and install base UI primitives
- [ ] T032 [US3] Configure react-i18next with Arabic as default locale at `/apps/frontend/src/i18n/` — include locale detection and Arabic translation files
- [ ] T033 [US3] Set up TanStack Router with route tree at `/apps/frontend/src/routes/` — include login route placeholder
- [ ] T034 [P] [US3] Create login page component in `/apps/frontend/src/pages/Login.tsx`
- [ ] T035 [P] [US3] Create API client service layer in `/apps/frontend/src/services/api.ts` using shared contracts
- [ ] T036 [US3] Configure RTL layout — set `dir="rtl"` on HTML element, apply RTL-aware styles in `/apps/frontend/src/layouts/RootLayout.tsx`
- [ ] T037 [US3] Verify frontend builds and renders — `cd apps/frontend && npm run dev` — no contract import errors, Arabic RTL layout renders

**Checkpoint**: At this point, User Stories 1–3 should all work independently

---

## Phase 6: User Story 4 — Multi-Tenant Request is Properly Isolated (Priority: P2)

**Goal**: Authenticated requests are scoped to the user's charity; cross-tenant access is denied with 403.

**Independent Test**: Authenticate as users from two charities — cross-tenant resource access returns `{ "code": "FORBIDDEN" }`.

### Implementation for User Story 4

- [ ] T038 [P] [US4] Create tenant context resolver middleware at `/apps/backend/src/common/middleware/tenant.middleware.ts` — extract charity_id from JWT claims
- [ ] T039 [P] [US4] Create tenant-scoped repository base class at `/apps/backend/src/common/repositories/tenant.repository.ts` — auto-filters queries by charity_id
- [ ] T040 [US4] Register tenant middleware globally in `/apps/backend/src/app.module.ts` — apply to all protected routes
- [ ] T041 [US4] Write tenant isolation integration tests in `/apps/backend/tests/integration/tenant-isolation.spec.ts` — mock two charities, verify cross-tenant 403

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently

---

## Phase 7: User Story 5 — Error and Logging Infrastructure Works (Priority: P3)

**Goal**: Invalid requests return standardized error responses with correlationId; errors are logged with correlation context.

**Independent Test**: Send invalid POST — response has `{ "status": "error", "code": "VALIDATION_ERROR", "correlationId": "..." }`. Server log contains matching correlationId.

### Implementation for User Story 5

- [ ] T042 [P] [US5] Create global exception filter at `/apps/backend/src/common/filters/http-exception.filter.ts` — returns standardized `{ status, message, code, correlationId }` format per contracts/api-response.md
- [ ] T043 [P] [US5] Configure Pino structured logging with NestJS logger at `/apps/backend/src/common/logger/pino-logger.service.ts`
- [ ] T044 [US5] Create correlation ID interceptor at `/apps/backend/src/common/interceptors/correlation.interceptor.ts` — generates UUID per request, injects into request context
- [ ] T045 [US5] Create standardized response interceptor at `/apps/backend/src/common/interceptors/response.interceptor.ts` — wraps all successful responses in `{ status: "success", data }` format
- [ ] T046 [P] [US5] Register exception filter, interceptors, and logger globally in `/apps/backend/src/app.module.ts`
- [ ] T047 [US5] Write error handling and logging tests in `/apps/backend/tests/integration/error-logging.spec.ts` — verify error format, correlationId presence, log output

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T048 [P] Write ADR for monorepo structure decision in `/docs/adr/001-monorepo-structure.md`
- [ ] T049 [P] Write ADR for API versioning strategy in `/docs/adr/002-api-versioning.md`
- [ ] T050 [P] Write ADR for tenant isolation approach in `/docs/adr/003-tenant-isolation.md`
- [ ] T051 Run quickstart.md validation — execute all 10 steps, fix any issues
- [ ] T052 Final security review — verify no secrets in code, auth guards on all protected routes, CORS restricted

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–7)**: All depend on Foundational phase completion
  - **US1 (Phase 3)**: Can start after Foundational — No dependencies on other stories
  - **US2 (Phase 4)**: Can start after Foundational — No dependencies on other stories
  - **US3 (Phase 5)**: Can start after Foundational — May integrate with shared contracts from US2
  - **US4 (Phase 6)**: Can start after Foundational — Depends on auth from US2 (JWT with tenant claims)
  - **US5 (Phase 7)**: Can start after Foundational — Shared infrastructure, independent of other stories
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Start after Phase 2 — No external story dependencies
- **US2 (P2)**: Start after Phase 2 — No external story dependencies
- **US3 (P3)**: Start after Phase 2 — May reference contracts from US2's shared package structure
- **US4 (P2)**: Start after Phase 2 — Requires JWT auth with tenant claims (from US2)
- **US5 (P3)**: Start after Phase 2 — Standalone; can be developed independently

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Phase 1 [P] tasks can run in parallel
- All Phase 2 [P] tasks can run in parallel
- Once Phase 2 completes: US1, US2, US3, US5 can start in parallel (US4 waits for US2)
- Models within a story marked [P] can run in parallel
- Test files within a story marked [P] can run in parallel

---

## Parallel Example: Phase 1 Setup

```bash
# Launch all Phase 1 tasks together:
Task: T001 "Initialize root package.json with npm workspaces"
Task: T002 "Create apps/backend NestJS project"
Task: T003 "Create apps/frontend Vite + React project"
Task: T004 "Create packages/api-contracts library"
Task: T005 "Create packages/shared library"
Task: T006 "Create packages/config library"
Task: T007 "Configure ESLint and Prettier"
Task: T008 "Configure root tsconfig with project references"
```

## Parallel Example: Phase 4 (User Story 2)

```bash
# Launch models and scaffolding together:
Task: T018 "Create Charity and User Prisma models"
Task: T019 "Create Role Permission Prisma model"
Task: T021 "Create NestJS AppModule with global prefix"
Task: T022 "Create health-check module"

# After those complete, launch dependent tasks:
Task: T023 "Configure PrismaModule and database connection"
Task: T024 "Create NestJS Passport JWT auth module"
Task: T025 "Create auth endpoints"
Task: T026 "Configure NestJS CORS, validation pipe, main.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Monorepo)
4. **STOP and VALIDATE**: `npm run build && npm run lint && npm run typecheck` — all pass
5. Foundation ready — can deploy/demo monorepo structure

### Incremental Delivery

1. Complete Setup + Foundational → Monorepo skeleton running
2. Add US1 (Monorepo build) → `npm run build` works → **MVP!**
3. Add US2 (Backend + DB) → Backend serves health endpoint → Deploy/Demo
4. Add US3 (Frontend + Contracts) → Frontend renders login page → Deploy/Demo
5. Add US4 (Multi-Tenant) → Tenant isolation enforced → Deploy/Demo
6. Add US5 (Error + Logging) → Standard errors, correlation logs → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:
1. Team completes Phase 1 + Phase 2 together
2. Once Phase 2 is done:
   - Developer A: US1 (Monorepo) + US3 (Frontend)
   - Developer B: US2 (Backend + DB) + US4 (Tenant isolation)
   - Developer C: US5 (Error + Logging) + Phase 8 (Polish)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
