# ADR 002: API Versioning Strategy

## Status
Accepted

## Context
The platform will evolve over time with breaking changes to API contracts. Multiple client versions (mobile, web, third-party) must be supported simultaneously.

## Decision
Use URL path versioning with the `/api/v1/` prefix applied globally via NestJS `setGlobalPrefix`:
- All routes are mounted under `/api/v1/`
- Major versions increment the path segment (e.g., `/api/v2/`)
- Breaking changes trigger a new version; backward-compatible changes do not

## Consequences
- Clear, explicit versioning visible in every request URL
- No version negotiation complexity (no Accept headers)
- Entire API surface can be versioned by changing the global prefix
- Older versions remain deployed until all clients migrate
