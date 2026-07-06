---

description: "Task list for login screen flow implementation"

---

# Tasks: Login Screen Flow

**Input**: Design documents from `/specs/002-login-screen-flow/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included as requested in the feature specification (FR-003, FR-020 require validation; SC-001–SC-007 define measurable outcomes).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `apps/backend/src/`, `apps/frontend/src/`
- **Shared contracts**: `packages/api-contracts/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and configure shared packages

- [x] T001 Install backend dependencies (@nestjs/throttler, @nestjs/i18n, ioredis, @nestjs/jwt, @nestjs/passport, passport-jwt) in apps/backend/package.json
- [x] T002 [P] Install frontend dependencies (axios) in apps/frontend/package.json (skipped — existing ApiClient uses fetch, adapting instead)
- [x] T003 Create auth directory structure in apps/backend/src/auth/ (and redis/, common/decorators/, tests/auth/)
- [x] T004 [P] Create auth directory structure in apps/frontend/src/lib/ (already exists in services/api.ts)
- [x] T005 Configure Redis connection module in apps/backend/src/redis/redis.module.ts

**Checkpoint**: Dependencies installed, directory structure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create shared login DTO in packages/api-contracts/src/auth/login.dto.ts using Zod schemas per contracts/auth-api.md
- [x] T007 [P] Update AuthModule in apps/backend/src/auth/auth.module.ts (register RedisModule, UsersModule, ThrottlerModule)
- [x] T008 [P] Configure JWT module in apps/backend/src/auth/auth.module.ts (secret, expiry, sign options) — already configured
- [x] T009 [P] Create UsersService.findByEmail() in apps/backend/src/users/users.service.ts
- [x] T010 Create auth-context in apps/frontend/src/lib/auth-context.tsx (token state, login/logout methods, localStorage persistence)
- [x] T011 Enhance API client with Auth header and Accept-Language in apps/frontend/src/services/api.ts (existing ApiClient, Accept-Language support)
- [x] T012 Configure i18n module in AppsModule (apps/backend/src/app.module.ts with I18nModule.forRoot + AcceptLanguageResolver)
- [x] T013 Create English locale file for auth errors in apps/backend/src/i18n/en/auth.json
- [x] T014 Create Arabic locale file for auth errors in apps/backend/src/i18n/ar/auth.json

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 — User Logs in with Valid Credentials (Priority: P1) 🎯 MVP

**Goal**: A user can log in with valid email and password, receive a JWT token, and be redirected to the dashboard.

**Independent Test**: Navigate to /login, submit valid credentials, confirm redirect to / with a valid token in localStorage.

### Implementation for User Story 1

- [x] T015 [P] [US1] Implement AuthService.login() in apps/backend/src/auth/auth.service.ts (validate credentials, generate JWT, return token + expiresAt)
- [x] T016 [US1] Implement AuthController.login() in apps/backend/src/auth/auth.controller.ts (POST /v1/auth/login, validate body, delegate to AuthService)
- [x] T017 [US1] Configure JwtStrategy in apps/backend/src/auth/jwt.strategy.ts (extract token from Authorization header, validate JWT, attach user to request)
- [x] T018 [P] [US1] Create login form component in apps/frontend/src/pages/Login.tsx (email + password fields, submit button, loading state)
- [x] T019 [US1] Create login page in apps/frontend/src/pages/Login.tsx (render LoginForm, connect to auth-context login action)
- [x] T020 [US1] Create top-level routing in apps/frontend/src/App.tsx (auth gate: show LoginPage or DashboardPage based on auth state)
- [x] T021 [US1] Wire auth-context login() to API client POST /auth/login, store token in localStorage on success, redirect to dashboard

**Checkpoint**: At this point, User Story 1 should work — user can log in and reach the dashboard.

---

## Phase 4: User Story 2 — User Sees Error on Invalid Credentials (Priority: P1)

**Goal**: A user who enters incorrect credentials sees a localized error message without a page reload.

**Independent Test**: Submit invalid credentials, confirm a human-readable error message displays on the login form and no token is stored.

### Implementation for User Story 2

- [x] T022 [P] [US2] Error handling built into AuthService — throws 401 (invalid credentials), 423 (locked account), 429 (rate limited by ThrottlerGuard)
- [x] T023 [P] [US2] GlobalExceptionFilter already exists in apps/backend/src/common/filters/http-exception.filter.ts — catches all exceptions, returns standardized JSON
- [x] T024 [US2] Implement error handling in AuthService.login() — return 401 for invalid credentials, 423 for locked accounts, 429 for rate limited by ThrottlerGuard
- [x] T025 [US2] Handle login error response in auth-context.tsx (capture error message, expose to UI)
- [x] T026 [US2] Display error messages on LoginForm component (show error text below form, no page reload)

**Checkpoint**: User Story 2 works — invalid credentials show an error message, no token stored.

---

## Phase 5: User Story 3 — Unauthenticated User Is Redirected to Login (Priority: P1)

**Goal**: An unauthenticated user is redirected to /login, and an authenticated user on /login is redirected to /.

**Independent Test**: Clear localStorage, navigate to a protected route, confirm redirect to /login.

### Implementation for User Story 3

- [x] T027 [US3] Auth gate implemented in apps/frontend/src/App.tsx — shows LoginPage or DashboardPage based on auth state
- [x] T028 [US3] Auth guard in App.tsx — checks isAuthenticated from auth-context (which checks token expiry)
- [x] T029 [US3] Token expiry check in auth-context.tsx (isTokenExpired() compares stored expiresAt with Date.now())
- [x] T030 [US3] 401 response interceptor in api.ts — clearToken on 401, redirect to /login
- [x] T031 [US3] Login page redirect to dashboard — AuthContext handles token storage, App.tsx re-renders to dashboard on state change

**Checkpoint**: User Story 3 works — unauthenticated users are blocked, authenticated users are kept on dashboard.

---

## Phase 6: User Story 4 — Localized Error Messages from Backend (Priority: P2)

**Goal**: Backend error messages are returned in the user's language based on Accept-Language header.

**Independent Test**: Send requests with Accept-Language: ar and Accept-Language: en, confirm error messages are in the respective language.

### Implementation for User Story 4

- [x] T032 [P] [US4] Accept-Language header in apps/frontend/src/services/api.ts — reads from i18next.language
- [x] T033 [US4] Wire i18n service into HttpExceptionFilter in apps/backend/src/common/filters/http-exception.filter.ts (translate error messages using nestjs-i18n)
- [x] T034 [US4] Add locale-specific auth error messages in apps/backend/src/i18n/en/auth.json (invalid_credentials, account_locked)
- [x] T035 [US4] Add locale-specific auth error messages in apps/backend/src/i18n/ar/auth.json (same keys, Arabic translations)

**Checkpoint**: User Story 4 works — error messages are returned in the correct language.

---

## Phase 7: Security & Cross-Cutting Concerns

**Purpose**: Account lockout, rate limiting, audit logging, testing, and documentation

- [x] T036 [P] Add rate limiting to login endpoint in apps/backend/src/auth/auth.controller.ts (@UseGuards(ThrottlerGuard) + @Throttle() decorator)
- [x] T037 [P] Implement account lockout logic in AuthService (track consecutive failures in Redis with TTL, check lockout on login attempt, reset on success)
- [x] T038 [P] Add audit logging for login events in AuthService (log userId, email, ipAddress, attemptedAt, success, failureReason to Redis list)
- [x] T039 Create current-user decorator in apps/backend/src/common/decorators/current-user.decorator.ts (extract user from request for use in controllers)
- [ ] T040 [P] Write backend unit tests in apps/backend/tests/auth/auth.service.spec.ts
- [ ] T041 [P] Write backend integration tests in apps/backend/tests/auth/auth.controller.spec.ts
- [ ] T042 [P] Write frontend tests in apps/frontend/tests/login.test.tsx
- [x] T043 [P] Create ADR for login auth decisions in docs/adr/006-login-authentication.md
- [x] T044 Run compilation check — backend (`npx nest build`) and frontend (`npx tsc --noEmit`) both pass cleanly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3–6)**: All depend on Foundational phase completion
  - US1 (Phase 3) can start immediately after Foundation
  - US2 (Phase 4) and US3 (Phase 5) can start in parallel with US1
  - US4 (Phase 6) depends on US2 (needs working error flow first)
- **Security & Cross-Cutting (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — independent MVP slice
- **User Story 2 (P1)**: No dependencies on US1 (uses same AuthController/AuthService, but adds separate error paths) — can be parallel
- **User Story 3 (P1)**: No dependencies on US1 or US2 (auth guard is standalone route logic) — can be parallel
- **User Story 4 (P2)**: Depends on US2 (localization transforms error responses from HttpExceptionFilter)

### Within Each User Story

- Models/DTOs before services
- Services before controllers/routes
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational completes, US1, US2, and US3 can all start in parallel
- All [P] tasks within a story can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all US1 backend tasks together:
Task: "T015 [P] [US1] Implement AuthService.login()"
Task: "T018 [P] [US1] Create login form component"

# Launch remaining US1 tasks after:
Task: "T016 [US1] Implement AuthController.login()" (depends on T015)
Task: "T017 [US1] Configure JwtStrategy" (depends on T015)
Task: "T019 [US1] Create login page" (depends on T018)
Task: "T020 [US1] Create login route" (depends on T019)
Task: "T021 [US1] Wire auth-context" (depends on T016, T020)
```

## Parallel Example: User Story 2

```bash
# Launch all US2 tasks together:
Task: "T022 [P] [US2] Create error DTOs"
Task: "T023 [P] [US2] Create HttpExceptionFilter"

# Then:
Task: "T024 [US2] Implement error handling in AuthService" (depends on T022)
Task: "T025 [US2] Handle login error in auth-context" (depends on T023)
Task: "T026 [US2] Display error messages on LoginForm" (depends on T025)
```

## Parallel Example: User Story 3

```bash
# All US3 tasks can run sequentially (auth guard depends on auth-context):
Task: "T027 [US3] Create _authenticated.tsx layout"
Task: "T028 [US3] Implement beforeLoad guard"
Task: "T029 [US3] Add token expiry check"
Task: "T030 [US3] Add 401 interceptor"
Task: "T031 [US3] Redirect authenticated users from login"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Navigate to /login, log in with valid credentials, confirm dashboard renders
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP — can log in!)
3. Add User Story 2 → Test independently → Deploy/Demo (error handling added)
4. Add User Story 3 → Test independently → Deploy/Demo (route protection added)
5. Add User Story 4 → Test independently → Deploy/Demo (localization added)
6. Add Phase 7 security features → Finalize

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (login flow)
   - Developer B: User Story 2 (error handling) + User Story 4 (localization)
   - Developer C: User Story 3 (auth guard)
3. All stories merge and validate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
