# Auth API Contracts

## Login

### POST /v1/auth/login

Authenticates a user with email and password. Returns a signed JWT token on success.

#### Request

**Headers**:
| Header | Required | Description |
|--------|----------|-------------|
| Content-Type | Yes | `application/json` |
| Accept-Language | No | Locale for error messages (e.g., `ar`, `en`). Defaults to `en` if omitted. |

**Body** (`application/json`):
```typescript
{
  email: string;    // Valid email format
  password: string; // Non-empty string
}
```

**Validation Rules**:
- `email`: Must be a valid email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- `password`: Must be non-empty string

#### Response — 200 OK (Success)

```typescript
{
  token: string;       // Signed JWT
  expiresAt: string;   // ISO 8601 timestamp
}
```

#### Response — 400 Bad Request (Validation Error)

```typescript
{
  statusCode: 400,
  message: string | string[],  // Localized validation error message(s)
  error: "Bad Request"
}
```

#### Response — 401 Unauthorized (Invalid Credentials)

```typescript
{
  statusCode: 401,
  message: string,   // Localized: "Invalid email or password"
  error: "Unauthorized"
}
```

#### Response — 423 Locked (Account Temporarily Locked)

```typescript
{
  statusCode: 423,
  message: string,           // Localized: "Account locked. Try again in X minutes"
  error: "Locked",
  retryAfterSeconds: number  // Seconds until account unlocks
}
```

#### Response — 429 Too Many Requests (Rate Limited)

```typescript
{
  statusCode: 429,
  message: string,   // Localized: "Too many login attempts. Try again later"
  error: "Too Many Requests",
  retryAfterSeconds: number  // Seconds until retry allowed
}
```

#### Response — 500 Internal Server Error

```typescript
{
  statusCode: 500,
  message: string,   // Localized: "An unexpected error occurred"
  error: "Internal Server Error"
}
```

## Error Code Reference

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Request body validation failed |
| 401 | INVALID_CREDENTIALS | Email or password is incorrect |
| 423 | ACCOUNT_LOCKED | Account temporarily locked due to failed attempts |
| 429 | RATE_LIMITED | IP address exceeded rate limit |
| 500 | INTERNAL_ERROR | Unexpected server error |

## Shared DTO (TypeScript — in `packages/api-contracts`)

```typescript
// packages/api-contracts/src/auth/login.dto.ts
import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export interface LoginErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  retryAfterSeconds?: number;
}
```
