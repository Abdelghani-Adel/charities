# Data Model: Login Screen Flow

## Entities

### User (existing)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, unique | |
| email | string | unique, not null, valid email format | Used as login identifier |
| passwordHash | string | not null | bcrypt or argon2 hash |
| tenantId | UUID | FK → Tenant, not null | User's charity tenant |
| role | enum | not null | User role for authorization |
| isActive | boolean | default true | Soft disable account |
| createdAt | timestamp | not null, auto | |
| updatedAt | timestamp | not null, auto | |

**Relationships**:
- Belongs to exactly one `Tenant` (charity)
- Has many `LoginAttempt` records

### LoginAttempt (new — transient/Redis-backed)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| userId | UUID | not null | Target user |
| ipAddress | string | not null | Source IP of the attempt |
| attemptedAt | timestamp | not null | When the attempt occurred |
| success | boolean | not null | Whether login succeeded |
| failureReason | string | nullable | Reason if failed (e.g., invalid password, locked account, rate limited) |

**Notes**:
- Stored in Redis with TTL for lockout tracking (consecutive failures counter)
- Persisted to PostgreSQL for audit trail (FR-020) — async write via queue
- Retention: per audit policy (assumed 1 year minimum)

### AuthToken (conceptual — JWT, not persisted)

| Claim | Type | Description |
|-------|------|-------------|
| sub | UUID | User ID |
| tenantId | UUID | User's tenant |
| email | string | User's email |
| iat | number | Issued-at timestamp |
| exp | number | Expiration timestamp |

**Notes**:
- Signed with server-side secret
- No database storage; validated via JWT signature and expiry
- Token duration defined by backend configuration (e.g., 24 hours)

## State Transitions

### Account Lockout State Machine

```
[Active] ──(N consecutive failures)──→ [Locked]
[Locked] ──(duration expires)────────→ [Active]
[Locked] ──(admin override)──────────→ [Active]
[Active] ──(successful login)────────→ [Active] (reset failure counter)
```

### Login Flow State

```
[Idle] → [Validating] → [Success] → [Redirect to Dashboard]
                        → [Failure] → [Show Error]
                                      → [Locked] → [Show Lockout Error + Remaining Time]
                                      → [Rate Limited] → [Show Rate Limit Error]
```
