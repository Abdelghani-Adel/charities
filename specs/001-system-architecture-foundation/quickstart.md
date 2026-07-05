# Quickstart: System Architecture Foundation

## Prerequisites

- Node.js 20.x LTS
- PostgreSQL 16.x (local or Docker)
- npm 10.x

## Setup & Validation

### 1. Clone and Install

```bash
git clone <repo-url> charities
cd charities
npm install
```

**Expected**: All packages install without errors. Node modules exist in root `node_modules/` and each workspace's `node_modules/`.

### 2. Verify Monorepo Build

```bash
npm run build
```

**Expected**: All packages compile (TypeScript `tsc` passes). Check each workspace:
- `packages/api-contracts` compiles without errors
- `packages/shared` compiles without errors
- `packages/config` compiles without errors
- `apps/backend` compiles without errors (NestJS build)
- `apps/frontend` compiles without errors (Vite build)

### 3. Run Lint & Type Check

```bash
npm run lint
npm run typecheck
```

**Expected**: ESLint reports 0 errors. TypeScript strict mode passes across all workspaces. (CI gate validation — FR-030)

### 4. Start Database & Run Migrations

```bash
# Start PostgreSQL (Docker example)
docker run -d --name charities-db -e POSTGRES_PASSWORD=localdev -e POSTGRES_DB=charities -p 5432:5432 postgres:16

# Run migrations
cd apps/backend
npm run migration:run
```

**Expected**: Migrations execute successfully. Schema tables created:
- `charities`
- `users`
- `indigents`
- `aid_records`
- `audit_logs`
- `abuse_reports`
- `change_requests`
- `roles`

### 5. Start Backend & Verify Health

```bash
cd apps/backend
npm run start:dev
```

```bash
curl http://localhost:3000/api/v1/health
```

**Expected**: Returns `{ "status": "success", "data": { "healthy": true } }`

### 6. Verify Auth Flow

```bash
# Register or login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@charity1.org", "password": "..."}'
```

**Expected**: Returns `{ "status": "success", "data": { "accessToken": "eyJ..." } }`

### 7. Start Frontend

```bash
cd apps/frontend
npm run dev
```

Open `http://localhost:5173`.

**Expected**: Application renders without console errors. Login page displays in Arabic (default RTL layout).

### 8. Verify Shared Contracts Import

```bash
# Test that frontend can import contracts
cd apps/frontend
npm run typecheck
```

**Expected**: TypeScript strict mode passes. Frontend successfully imports and uses types from `packages/api-contracts`.

### 9. Verify Tenant Isolation

```bash
# Authenticate as user from Charity A
# Try to access Charity B's resource
curl http://localhost:3000/api/v1/charities/<charity-b-id> \
  -H "Authorization: Bearer <token-from-charity-a>"
```

**Expected**: Returns 403 `{ "status": "error", "code": "FORBIDDEN", "message": "Cross-tenant access denied" }`

### 10. Verify Error & Logging

```bash
# Send invalid request
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "not-an-email"}'
```

**Expected**: Returns 422 `{ "status": "error", "code": "VALIDATION_ERROR", "message": "...", "correlationId": "uuid-here" }`. Server logs contain the correlation ID.

## CI Pipeline Validation

```bash
npm run ci       # Runs: lint → typecheck → test → build
npm run test     # Runs all unit + integration tests
```

**Expected**: All stages pass. No failures in formatting, linting, types, tests, or build.
