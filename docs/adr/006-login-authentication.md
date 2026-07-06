# ADR 006: Login Authentication Flow

## Status
Accepted

## Context
The login flow needs to handle credential validation, account lockout, rate limiting, audit logging, and localized error messages. The system uses a shared-schema multi-tenant database where each user has a unique `[email, charityId]` pair.

## Decision

### 1. Credential Validation
- Use `bcrypt.compare()` against `User.passwordHash` stored in Prisma
- Look up user by `email` only (charity context is derived from the user's `charityId`)
- Return 401 with `auth.invalid_credentials` for both invalid email and invalid password (no enumeration)

### 2. Account Lockout
- Track consecutive failures in Redis with key `failures:<userId>` (TTL = lockout duration window)
- Threshold: 5 failures (configurable via `LOCKOUT_THRESHOLD` env var)
- Lockout duration: 15 minutes (configurable via `LOCKOUT_DURATION_MS` env var)
- Lockout stored in Redis with key `lockout:<userId>` (JSON `{ lockedUntil: timestamp }`)
- Both keys are deleted on successful login
- Returns 423 with `retryAfterSeconds` in the response body

### 3. Rate Limiting
- Applied via `@nestjs/throttler` with `ThrottlerGuard` on the login endpoint only
- Default: 10 requests per 60 seconds per IP (configurable via `RATE_LIMIT_MAX` and `RATE_LIMIT_TTL`)
- Returns 429 status code when exceeded

### 4. Audit Logging
- Each login attempt (success/failure) logged to Redis list `audit:login`
- Entry includes: userId, email, ipAddress, attemptedAt, success, failureReason
- List trimmed to 10,000 entries to prevent unbounded growth
- Future: can be migrated to a dedicated audit table or external service

### 5. Localized Error Messages
- Messages use `nestjs-i18n` with `AcceptLanguageResolver`
- AuthService calls `I18nContext.current().t()` for each error message
- Fallback language: Arabic (`ar`)
- Locale files: `apps/backend/src/i18n/{en,ar}/auth.json`
- Keys: `invalid_credentials`, `account_locked`, `rate_limited`, `server_error`

### 6. API Response Format
- Success: `{ status: "success", data: { token, expiresAt } }`
- Error: `{ status: "error", message, code, correlationId }`
- Login-specific locked error: `{ statusCode: 423, message, error: "Locked", retryAfterSeconds }`

## Consequences
- Stateless JWT — no server-side session required
- Lockout state in Redis survives server restarts (but not Redis restarts)
- Rate limiting protects against brute force at the IP level
- Lockout protects against credential stuffing at the user level
- Audit log provides forensic visibility into login attempts
- Localized errors improve UX for Arabic-speaking users
- All error messages are returned through `GlobalExceptionFilter` for consistent formatting

## Alternatives Considered
- **Database-based lockout**: Rejected — Redis provides faster reads/writes and automatic TTL expiry
- **Session-based auth**: Rejected — JWT is already the established pattern (ADR-004)
- **No audit logging**: Rejected — Principle XIII (Security by Design) requires audit trails
