export enum UserRole {
  Admin = "admin",
  Manager = "manager",
  Viewer = "viewer",
}

export enum AidType {
  Food = "food",
  Medical = "medical",
  Financial = "financial",
  Clothing = "clothing",
  Other = "other",
}

export enum ErrorCode {
  ValidationError = "VALIDATION_ERROR",
  Unauthorized = "UNAUTHORIZED",
  Forbidden = "FORBIDDEN",
  NotFound = "NOT_FOUND",
  TenantMismatch = "TENANT_MISMATCH",
  Conflict = "CONFLICT",
  InternalError = "INTERNAL_ERROR",
  RateLimited = "RATE_LIMITED",
}
