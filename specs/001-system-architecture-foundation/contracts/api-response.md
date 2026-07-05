# API Response Contracts

## Success Response Format

```typescript
interface ApiResponse<T> {
  status: "success";
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}
```

## Error Response Format

```typescript
interface ApiError {
  status: "error";
  message: string;       // Human-readable description
  code: string;          // Machine-readable error code (e.g., "VALIDATION_ERROR", "UNAUTHORIZED")
  correlationId: string; // UUID linking to server-side logs
  details?: unknown;     // Validation errors array or additional context (never stack traces)
}
```

## Pagination Contract

```typescript
interface PaginationParams {
  page?: number;     // Default: 1
  pageSize?: number; // Default: 20, Max: 100
  sort?: string;     // Field name, optional "-" prefix for descending
}
```

## Common Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| VALIDATION_ERROR | 422 | Request body failed validation |
| UNAUTHORIZED | 401 | Missing or invalid authentication token |
| FORBIDDEN | 403 | Authenticated but insufficient permissions |
| NOT_FOUND | 404 | Resource does not exist |
| TENANT_MISMATCH | 403 | Cross-tenant access attempt |
| CONFLICT | 409 | Duplicate or conflicting state |
| INTERNAL_ERROR | 500 | Unexpected server error |
| RATE_LIMITED | 429 | Too many requests |
