# API Endpoint Conventions

## Base URL

```
/api/v1/{resource}
```

## Versioning

All endpoints are versioned via URL path prefix (`/api/v1/`, `/api/v2/`).
Breaking changes require a new version; backward-compatible additions may be made within the current version.

## Standard Endpoint Patterns

| Method | Path | Description |
|--------|------|-------------|
| GET | `/{resource}` | List resources (paginated) |
| GET | `/{resource}/:id` | Get single resource |
| POST | `/{resource}` | Create resource |
| PATCH | `/{resource}/:id` | Partial update |
| DELETE | `/{resource}/:id` | Soft delete resource |

## Tenant Context

Tenant is resolved from the JWT claims; not passed as a URL or body parameter.
All tenant-scoped queries are automatically filtered by the resolved charity ID.

## Authentication

```
Authorization: Bearer <jwt-token>
```

## Content Type

All requests and responses use `application/json`.
