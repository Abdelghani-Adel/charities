# Data Model: System Architecture Foundation

## Conventions (applied to all entities)

- Primary key: UUID (`id` column)
- Timestamps: `created_at` (not-null), `updated_at` (not-null)
- Soft delete: `deleted_at` (nullable timestamp)
- Audit trail: `created_by` (nullable FK to users) on entities requiring attribution
- Tenant scope: `charity_id` (FK to charities) on tenant-owned entities
- Indexing: Foreign keys and frequently-queried columns indexed

---

## Entity: Charity

Represents an independent charity organization (tenant).

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| name | string | Required, unique |
| slug | string | Required, unique, URL-safe |
| locale | enum | `ar` or `en`, default `ar` |
| is_active | boolean | Default true |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |
| deleted_at | timestamp | Nullable |

**Relationships**: Has many Users, Aid Records, Audit Logs

---

## Entity: User

An individual who can authenticate and access the system.

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| charity_id | UUID | FK to Charity, required |
| email | string | Required, unique per charity |
| name | string | Required |
| password_hash | string | Required |
| role | enum | `admin`, `manager`, `viewer` |
| is_active | boolean | Default true |
| last_login_at | timestamp | Nullable |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |
| deleted_at | timestamp | Nullable |

**Relationships**: Belongs to Charity; has many Audit Log entries; has many Aid Records (as creator)

**Unique constraint**: (email, charity_id)

---

## Entity: Role & Permission

Defines what actions a user can perform within their tenant context.

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| name | string | Required, unique |
| permissions | jsonb | Array of permission strings |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

**Relationships**: Referenced by User.role; permissions evaluated by CASL at runtime.

**Validation**: Permissions follow `<action>:<resource>` format (e.g., `read:indigents`, `create:aid-records`)

---

## Entity: Indigent (Registry Entry)

An individual registered in the shared indigent registry. Cross-tenant shared entity.

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| full_name | string | Required |
| date_of_birth | date | Required |
| national_id | string | Required, unique |
| phone | string | Nullable |
| address | text | Nullable |
| created_by | UUID | FK to User, required |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |
| deleted_at | timestamp | Nullable |

**Relationships**: Created by User; has many Aid Records; has many Abuse Reports

**Note**: Shared across tenants; visibility controlled by permission rules rather than `charity_id` scoping.

---

## Entity: Aid Record

Tracks assistance provided by a charity to an indigent. Immutable after creation.

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| charity_id | UUID | FK to Charity, required |
| indigent_id | UUID | FK to Indigent, required |
| type | enum | `food`, `medical`, `financial`, `clothing`, `other` |
| amount | decimal | Nullable (for financial aid) |
| description | text | Required |
| provided_at | date | Required |
| created_by | UUID | FK to User, required |
| created_at | timestamp | Required |

**Relationships**: Belongs to Charity; belongs to Indigent; created by User

**Note**: No `updated_at` or `deleted_at` — records are immutable (Constitution Principle V).

---

## Entity: Audit Log

Immutable record of significant system actions.

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| charity_id | UUID | FK to Charity, nullable (for system-wide events) |
| user_id | UUID | FK to User, nullable (for system actions) |
| action | string | Required (e.g., `user.login`, `indigent.create`) |
| resource_type | string | Required |
| resource_id | UUID | Required |
| details | jsonb | Nullable (additional context) |
| ip_address | string | Nullable |
| correlation_id | UUID | Required |
| created_at | timestamp | Required |

**Relationships**: Belongs to Charity (optional); belongs to User (optional)

**Note**: Immutable — no update or delete operations.

---

## Entity: Abuse Report

Report of potential abuse or duplicate in the registry. Initiates review rather than automatic action.

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| charity_id | UUID | FK to Charity, required |
| indigent_id | UUID | FK to Indigent, required |
| type | enum | `duplicate`, `fraudulent`, `incorrect_data`, `other` |
| description | text | Required |
| status | enum | `open`, `under_review`, `resolved`, `dismissed` |
| resolution_notes | text | Nullable |
| created_by | UUID | FK to User, required |
| reviewed_by | UUID | FK to User, nullable |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

**Relationships**: Belongs to Charity; belongs to Indigent; created by User; reviewed by User (optional)

---

## Entity: Change Request

Proposed change to shared registry data requiring approval.

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| charity_id | UUID | FK to Charity, required |
| indigent_id | UUID | FK to Indigent, required |
| field_name | string | Required |
| old_value | text | Nullable |
| new_value | text | Required |
| reason | text | Required |
| status | enum | `pending`, `approved`, `rejected` |
| reviewed_by | UUID | FK to User, nullable |
| reviewed_at | timestamp | Nullable |
| created_by | UUID | FK to User, required |
| created_at | timestamp | Required |
| updated_at | timestamp | Required |

**Relationships**: Belongs to Charity; belongs to Indigent; created by User; reviewed by User (optional)
