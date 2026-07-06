# Research: Login Screen Flow

## Technical Context Resolutions

### 1. NestJS Auth Module with JWT

**Decision**: Use `@nestjs/jwt` with `@nestjs/passport` and `passport-jwt` strategy.

**Rationale**: NestJS has first-class support for JWT authentication through these packages. The pattern is well-documented, widely adopted, and already established in the project's foundation architecture (ADR-004). JWT payload includes `sub` (userId), `tenantId`, `iat`, and `exp`.

**Alternatives considered**:
- Custom middleware without Passport — more flexible but loses NestJS/Passport integration benefits (guards, decorators)
- Session-based auth — not suitable for SPA + API architecture; JWT is the standard for this pattern

### 2. Backend i18n / Localization

**Decision**: Use `@nestjs/i18n` middleware to extract locale from `Accept-Language` header.

**Rationale**: NestJS i18n package supports header-based locale resolution, pluralization, and fallback locales out of the box. Error messages are stored in locale files (JSON) per language (e.g., `i18n/en/auth.json`, `i18n/ar/auth.json`). The middleware is globally registered and injects `I18nContext` into request-scoped services.

**Alternatives considered**:
- Custom locale resolver — reinventing the wheel; `@nestjs/i18n` is mature and well-integrated
- Frontend-side localization — rejected per spec requirements (backend MUST localize error messages)

### 3. Rate Limiting with Redis

**Decision**: Use `@nestjs/throttler` with Redis store for distributed rate limiting.

**Rationale**: `@nestjs/throttler` v5+ supports Redis as a storage backend, making rate limits consistent across multiple backend instances. The module provides decorators (`@Throttle()`, `@SkipThrottle()`) for per-route configuration. Default: 10 requests per minute per IP on the login endpoint, configurable via environment variables.

**Alternatives considered**:
- In-memory rate limiting — doesn't work with multiple instances
- Custom Redis middleware — more flexible but `@nestjs/throttler` covers the use case with less code
- No rate limiting — rejected per FR-019

### 4. Account Lockout Tracking

**Decision**: Use Redis with TTL-based keys for lockout state tracking.

**Rationale**: Redis is ideal for transient state like lockout counters and durations. Key pattern: `lockout:<userId>` with value `{ attempts, lockedUntil }`. TTL set to the lockout duration. On login failure, increment counter; if counter >= N (configurable), set lockedUntil. On successful login, delete the key.

**Alternatives considered**:
- Database column (`locked_until`) — requires schema changes and DB writes per attempt; Redis is more appropriate for this transient, high-frequency data
- In-memory cache — doesn't survive restarts or scale across instances

### 5. TanStack Router Auth Guard

**Decision**: Use TanStack Router's `beforeLoad` route option for authentication checks.

**Rationale**: TanStack Router supports route-level `beforeLoad` hooks that can redirect or throw errors to prevent access. The auth guard checks for a valid token in the auth context and redirects to `/login` if missing/expired. The login route itself also uses `beforeLoad` to redirect authenticated users to `/`.

**Alternatives considered**:
- Wrapper component — less declarative; route-level guards are more idiomatic for TanStack Router
- Middleware — not supported by TanStack Router; `beforeLoad` is the recommended approach

### 6. API Client Setup

**Decision**: Use axios with request/response interceptors for token attachment and error handling.

**Rationale**: axios interceptors provide a clean way to attach the token and `Accept-Language` header to every request automatically. Response interceptor handles 401 responses by clearing the token and redirecting to login.

**Alternatives considered**:
- fetch wrapper — more manual setup; axios has better interceptor and error handling UX
- TanStack Query — overkill; the API client is needed for raw HTTP calls, not just data fetching

### 7. Login DTO Validation

**Decision**: Define shared Zod schemas in `packages/api-contracts/src/auth/login.dto.ts`.

**Rationale**: The project already has a shared api-contracts package for DTOs. Zod provides runtime validation on both frontend (form validation) and backend (pipe validation). The schema defines email (valid email format) and password (non-empty string).

**Alternatives considered**:
- Separate DTOs in frontend and backend — violates single source of truth principle
- class-validator (NestJS default) — works but doesn't share well with frontend; Zod is the project standard

### 8. Token Expiry Handling

**Decision**: Check token expiry both client-side (before API calls) and server-side (validate JWT `exp` claim).

**Rationale**: Client-side check prevents unnecessary API calls with an expired token. Server-side check is the authoritative validation. On the frontend, decode the JWT payload and compare `exp` with `Date.now()`. On the backend, Passport strategy validates `exp` automatically.

**Alternatives considered**:
- Server-side only — results in unnecessary API calls that will be rejected anyway
- Client-side only — insecure; server MUST be the authoritative validator
