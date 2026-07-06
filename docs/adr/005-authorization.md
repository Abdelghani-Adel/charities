# ADR 005: Authorization Strategy

## Status
Accepted (not yet implemented)

## Context
The platform has three user roles — `admin`, `manager`, and `viewer` — with different permission levels across domain resources (indigents, aid records, abuse reports, change requests, users, charities). Authorization checks must be declarative, consistent, and easy to audit. The `User.role` column and `Role` table already exist in the Prisma schema.

## Decision
Use **CASL (`@casl/ability`)** for role-based access control with a dedicated NestJS guard:

1. **Ability factory** (`CaslAbilityFactory`): Defines permission rules per role using CASL's `Ability` class
2. **Permission guard** (`PermissionsGuard`): A per-route guard that checks `ability.can(action, subject)` before allowing access
3. **Role definitions**:
   - **`admin`**: Full access (`manage all`) to all resources within their charity
   - **`manager`**: Read access to all resources; create access to indigents, aid records, abuse reports; no user/charity management
   - **`viewer`**: Read-only access to indigents, aid records, and abuse reports
4. **Decorator** (`@RequirePermission()`): Declares required permissions per endpoint (e.g., `@RequirePermission('create', 'Indigent')`)
5. **Enforcement**: Checked after JWT authentication passes — the user object from the JWT payload (`req.user.role`) drives the permission evaluation

### Implementation plan
| Component | Priority | Details |
|-----------|----------|---------|
| `CaslAbilityFactory` | High | Define rules for admin/manager/viewer using CASL `Ability` |
| `PermissionsGuard` | High | NestJS guard that reads `@RequirePermission()` metadata and calls `ability.can()` |
| `@RequirePermission()` decorator | High | Sets action + subject metadata on route handlers |
| Wire into domain modules | Medium | Add `@RequirePermission()` to each endpoint in users, indigents, aid, abuse, etc. |
| Role management endpoints | Low | CRUD for roles and user role assignment (admin-only) |

## Consequences
- Authorization logic is centralized in one factory — easy to audit and modify
- Permissions are declared at the endpoint level, making security posture visible
- CASL's `Ability` API supports both simple (CRUD) and complex (field-level, conditional) rules
- The guard runs after authentication — `req.user` must be populated first
- Roles are coarse-grained (3 tiers); CASL supports future migration to fine-grained permissions if needed
- `@casl/ability` is already declared in `apps/backend/package.json` — no additional dependency required
