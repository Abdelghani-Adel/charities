# ADR 004: Authentication Strategy

## Status
Accepted (partially implemented)

## Context
The platform requires stateless authentication that can carry tenant context (charity ID) and user role information. Every API request (except login and health) must be authenticated. The system uses a shared-schema multi-tenant database where each user belongs to exactly one charity.

## Decision
Use **JWT-based access tokens** with NestJS Passport strategy as the authentication mechanism:

1. **Token format**: JWT signed with HMAC (`JWT_SECRET`) containing `{ sub, email, charityId, role }` in the payload
2. **Token expiration**: Configurable via `JWT_EXPIRATION` env var (default: 1 day)
3. **Token transport**: `Authorization: Bearer <token>` header on every request
4. **Validation**: Passport JWT strategy verifies the signature, checks expiration, and attaches the decoded user to `req.user`
5. **Global guard** (`JwtAuthGuard`): Registered as `APP_GUARD` in the root module — protects all routes by default
6. **Public routes**: `@Public()` decorator sets `isPublic: true` metadata to bypass the global guard (used for login, health)
7. **Login endpoint** (`POST /auth/login`): Validates credentials, signs and returns a JWT

### Current implementation status
| Component | Status | Details |
|-----------|--------|---------|
| JWT signing | Done | `auth.controller.ts` signs tokens on login |
| JWT validation | Done | `jwt.strategy.ts` verifies tokens |
| Global guard | Done | `JwtAuthGuard` as `APP_GUARD` |
| `@Public()` decorator | Done | Marks login and health routes |
| Real user DB lookup | **TODO** | Currently hardcoded (`admin@charity.com` / `password`) |
| Password hashing (bcrypt) | **TODO** | Prisma `User.passwordHash` exists but no bcrypt dependency added |
| Registration endpoint | **TODO** | No `POST /auth/register` |

## Consequences
- No session state to manage — JWT carries all needed claims
- Tenant context (`charityId`) is available in every request without a DB call
- Token expiration forces periodic re-authentication
- Real user lookup and bcrypt must be implemented before production use
- JWT payload size is limited — only basic claims are embedded (role, charityId)
