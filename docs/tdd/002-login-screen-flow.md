# TDD Record: Login Screen Flow

**Spec**: `specs/002-login-screen-flow/spec.md`
**Created**: 2026-07-06
**Status**: Draft

## Business Rules

### Authentication & Credential Validation

- User must provide email and password to authenticate (FR-001, FR-003).
- Empty fields must be rejected before any API call (FR-002).
- Credentials are validated against the database on the backend (FR-003).
- Successful authentication returns a signed token (FR-004).
- Passwords are stored as hashes in the database (Assumption).
- Email is the unique user identifier for login (Assumption).

### Token Management

- On successful login, the returned token is stored in browser local storage (FR-005).
- The token is attached to every subsequent API request automatically (FR-006).
- Expired or invalid tokens are rejected by the backend with a clear error response (FR-012).
- On token rejection, the frontend clears the stored token and redirects to /login (FR-013).
- Multiple concurrent sessions per user are allowed — logging in from a new device does not invalidate existing sessions (FR-015).

### Session & Access Control

- An auth-guard checks token presence/validity before rendering any protected route (FR-007).
- Users without a valid token are redirected to /login (FR-007).
- Users with a valid token who navigate to /login are redirected to the dashboard (US3, scenario 3).
- After successful login, user is redirected to / (dashboard) (FR-008).

### Error Handling & Localization

- The frontend sends `Accept-Language` header with every API request (FR-010).
- Backend error messages are localized based on the `Accept-Language` header (FR-009).
- Error messages are displayed on the login form without page reload (FR-011).
- Supported error conditions: invalid credentials, account temporarily locked, rate limited, server error (SC-002).

### Security & Abuse Prevention

- Account is temporarily locked after N consecutive failed login attempts (N configurable) (FR-016).
- Locked account auto-unlocks after a configurable duration (FR-017).
- During lockout, login attempts return remaining lockout time (FR-018).
- IP-based rate limiting on the login endpoint with configurable threshold and window (FR-019).
- All login attempts (success and failure) are logged with timestamp, user identifier, IP, and outcome (FR-020).

### Scope Boundaries

- Only login is in scope — registration, password reset, and account management are excluded (FR-014).

## High-Level Technical Approach

### Backend (NestJS)

- **Endpoint**: `POST /v1/auth/login`
  - Accepts: `{ email: string, password: string }` + `Accept-Language` header
  - Returns: `{ token: string, expiresAt: ISO8601 }` on success
  - Returns: localized error response on failure
- **Auth Module**: Handles login logic, credential validation, token signing, rate limiting, and lockout enforcement.
- **Credential Validation**: Repository layer queries user by email; service layer compares password hash.
- **Token Signing**: JWT signed with a server-side secret; payload includes `userId`, `tenantId`, `iat`, `exp`.
- **Rate Limiting**: Filter/middleware on the login route; configurable threshold (e.g., 10 req/min per IP) and window stored in constants/environment.
- **Lockout**: Track consecutive failed attempts per user in a cache (Redis) or database; reset on successful login. Configurable N failures and duration in constants.
- **Localization**: Use NestJS built-in i18n features; map `Accept-Language` to locale bundle key; fallback to default locale.
- **Audit Logging**: Log login event asynchronously (queue) with user ID, IP, timestamp, and outcome.

### Frontend (React/Vite + TanStack Router)

- **Login Page Route**: `/login` — public route with email and password form fields, submit button, error display area.
- **Auth Context**: Manages token in React state + localStorage; exposes `login()`, `logout()`, `isAuthenticated`.
- **API Client**: Axios or fetch wrapper that automatically attaches token from auth context and `Accept-Language` header.
- **Auth Guard (Route Guard)**: TanStack Router `beforeLoad` hook that checks token presence/validity; redirects to `/login` if missing/expired.
- **Login Flow**: 
  1. User fills email + password → submits
  2. Button disabled, loading indicator shown
  3. API call to `POST /v1/auth/login` with credentials + `Accept-Language`
  4. On success: store token in localStorage, update auth context, redirect to `/`
  5. On error: display localized error message, re-enable form
- **Token Expiry Check**: On app load and route transitions, verify token expiry client-side before making API calls.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Token Storage | localStorage | Persists across browser sessions; simpler than cookie-based approaches for SPA |
| Concurrent Sessions | Allowed | Users may work on multiple devices; avoids unexpected logouts |
| Lockout | Temporary (auto-unlock) | Balances security with usability; avoids admin burden for manual unlocks |
| Rate Limiting | IP-based | Defense-in-depth against distributed brute force; combined with per-account lockout |
| Lockout Config | Constants | N and duration stored as constants for easy operational adjustment without code changes |
| Audit Logging | Both success + failure | Provides security monitoring capability and non-repudiation audit trail |
| Localization | Backend-driven (Accept-Language) | Consistent error messages regardless of client; single translation source |
| Auth Guard Behavior | Also redirects authenticated users away from /login | Prevents showing login page to already-logged-in users |

## Assumptions

- User database already exists with securely hashed passwords.
- Backend token signing infrastructure (JWT secret) is already in place.
- Frontend routing infrastructure supports route guards (TanStack Router).
- Redis or caching layer available for lockout tracking (fallback to database if not).
- I18n infrastructure exists on the backend for localized error messages.
- Email is the primary login identifier.
