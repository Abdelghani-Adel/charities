# Quickstart: Login Screen Flow

This guide walks through validation scenarios to verify the login feature works end-to-end.

## Prerequisites

- Backend and frontend development servers running locally
- Database seeded with at least one test user (email + hashed password)
- Redis server running (for rate limiting and lockout tracking)
- Browser with localStorage enabled

## Setup

```bash
# From repository root
# Start backend
cd apps/backend && npm run start:dev

# In another terminal, start frontend
cd apps/frontend && npm run dev

# Ensure Redis is running (default: localhost:6379)
```

## Validation Scenarios

### Scenario 1: Successful Login

1. Navigate to `http://localhost:5173/login`
2. Enter a valid user email and password
3. Click submit
4. **Expected**: Redirected to `http://localhost:5173/`. A JWT token stored in `localStorage`. The auth guard allows access to protected routes.

### Scenario 2: Invalid Credentials

1. Navigate to `http://localhost:5173/login`
2. Enter an invalid email/password combination
3. Click submit
4. **Expected**: A localized error message appears on the login form. No token stored in localStorage. User remains on `/login`.

### Scenario 3: Auth Guard Redirect

1. Clear `localStorage` (or use browser incognito)
2. Navigate to any protected route (e.g., `http://localhost:5173/`)
3. **Expected**: Redirected to `http://localhost:5173/login` automatically.

### Scenario 4: Authenticated User on Login Page

1. Complete a successful login (Scenario 1)
2. Navigate to `http://localhost:5173/login`
3. **Expected**: Redirected to `/` (dashboard) automatically.

### Scenario 5: Localized Error Message (Arabic)

1. Set browser language preference to Arabic (`Accept-Language: ar`)
2. Navigate to `http://localhost:5173/login`
3. Enter invalid credentials
4. **Expected**: Error message displayed in Arabic.

### Scenario 6: Account Lockout

1. Submit N consecutive invalid login attempts for the same user (N = lockout threshold from config)
2. On attempt N+1
3. **Expected**: Error message indicating account is temporarily locked, with remaining lockout time.

### Scenario 7: Rate Limiting

1. Send login requests exceeding the rate limit threshold from the same IP (using curl or Postman)
2. **Expected**: `429 Too Many Requests` response with retry-after information.

### Scenario 8: Token Expiry

1. Complete a successful login (Scenario 1)
2. Wait for the token to expire (or use a short-lived token for testing)
3. Make an API request to a protected endpoint
4. **Expected**: Backend returns 401. Frontend clears token and redirects to `/login`.

### Scenario 9: Expired Token Redirect

1. Manually set an expired JWT in `localStorage`
2. Refresh the page
3. **Expected**: Redirected to `/login`.

### Scenario 10: Concurrent Sessions

1. Log in on Browser A (Scenario 1)
2. Log in with the same user on Browser B (incognito)
3. **Expected**: Both sessions remain active. Actions in either browser succeed.

## API Contract Tests

Test the login endpoint directly (using curl or Postman):

```bash
# Successful login
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@charity.org","password":"correct-password"}'

# Expected: 200 with { token, expiresAt }

# Invalid credentials
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@charity.org","password":"wrong-password"}'

# Expected: 401 with localized error message

# Validation error (empty password)
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@charity.org","password":""}'

# Expected: 400 with validation error

# Arabic locale
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept-Language: ar" \
  -d '{"email":"test@charity.org","password":"wrong-password"}'

# Expected: 401 with Arabic error message
```

## Expected Outcomes

| Scenario | Result | Signal |
|----------|--------|--------|
| 1 (Success) | Redirect to `/`, token in localStorage | Login flow works end-to-end |
| 2 (Invalid) | Error message, no token | Error handling works |
| 3 (Auth Guard) | Redirect to `/login` | Route protection works |
| 4 (Auth → Login) | Redirect to `/` | Auth guard prevents login page loop |
| 5 (Arabic) | Arabic error | Localization works |
| 6 (Lockout) | Lock error with remaining time | Lockout mechanism works |
| 7 (Rate Limit) | 429 response | Rate limiting works |
| 8 (Token Expiry) | 401 + redirect | Token lifecycle works |
| 9 (Expired Token) | Redirect to `/login` | Client-side expiry check works |
| 10 (Concurrent) | Both sessions active | Concurrent session support works |

## Related Documents

- [Specification](spec.md) — business requirements and user stories
- [Data Model](data-model.md) — entity definitions and relationships
- [API Contracts](contracts/auth-api.md) — endpoint request/response formats
- [TDD Record](../../docs/tdd/002-login-screen-flow.md) — technical design details
