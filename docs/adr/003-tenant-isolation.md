# ADR 003: Tenant Isolation Approach

## Status
Accepted

## Context
The platform serves multiple charities, each with their own data. Users from one charity must never access another charity's data. The database uses a shared-schema model with a `charity_id` foreign key on every tenant-scoped table.

## Decision
Use middleware-based tenant context resolution combined with repository-level query scoping:
1. **Middleware** (`TenantMiddleware`): Extracts `charity_id` from JWT claims and attaches it to the request context
2. **Repository base class** (`TenantRepository`): Automatically adds `charity_id` filter to all Prisma queries
3. **Access control**: Cross-tenant requests are denied at the repository layer, not the controller layer

## Consequences
- Tenant isolation is enforced at the data access layer by default
- Controller code does not need to manually filter by tenant — it's automatic
- Middleware runs on every request, adding minimal overhead
- Testing tenant isolation requires mocking JWT claims with different charity IDs
- This approach works with the shared-schema, single-database model
