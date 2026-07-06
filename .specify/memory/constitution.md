<!--
  Sync Impact Report
  Version change: 1.0.0 -> 1.1.0
  Modified principles:
    - XIV. Documentation — added bullet requiring TDD record per spec
  Added sections: N/A
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/spec-template.md ✅ (updated — TDD record metadata line)
    - .specify/templates/plan-template.md ✅ (updated — docs/tdd/ in Documentation section)
    - .specify/templates/tasks-template.md ✅ (updated — TDD creation task in Polish phase)
  Follow-up TODOs:
    - TODO(RATIFICATION_DATE): Original adoption date unknown. Determine and update.
-->

# Unified Charity Indigent Management System Constitution

## Core Principles

### I. Single Source of Truth

- The shared indigent registry is the authoritative source of indigent
  information across all participating charities.
- Duplicate indigent records MUST be prevented whenever possible.
- Identity resolution MUST prioritize accuracy over convenience.
- Every shared record MUST remain consistent across all participating
  charities.

### II. Tenant Isolation with Shared Collaboration

- Every charity operates as an independent tenant with isolated users,
  permissions, and organization-specific data.
- Shared registry data MUST be accessible only according to each user's
  permissions.
- A tenant MUST never gain unauthorized access to another tenant's private
  operational data.
- Collaboration MUST never compromise tenant security.

### III. Complete Auditability

- Every significant action MUST be traceable.
- No critical business data MAY be permanently deleted.
- Record modifications MUST preserve historical versions where appropriate.
- Every change MUST identify who performed it, when it occurred, and why.

### IV. Approval-Based Shared Data Changes

- Changes affecting shared registry data MUST follow an approval workflow
  unless explicitly exempted.
- Proposed changes MUST remain reviewable before becoming authoritative.
- Rejected changes MUST preserve their review history.
- Approved changes MUST maintain a complete audit trail.

### V. Aid Transparency

- Every aid transaction MUST be attributable to the charity that provided it.
- Aid history MUST accurately represent assistance delivered across
  participating charities.
- The platform MUST minimize duplicated assistance while respecting
  organizational autonomy.
- Historical aid records MUST remain immutable except through authorized
  correction workflows.

### VI. Abuse Prevention

- Abuse reports MUST never immediately alter registry data.
- Reports MUST initiate a review process rather than automatic enforcement.
- Investigations MUST remain transparent and auditable.
- Resolution outcomes MUST preserve historical evidence.

### VII. Data Integrity

- Business rules MUST be enforced by the backend.
- All incoming data MUST be validated before persistence.
- Database integrity constraints MUST reinforce business rules whenever
  practical.
- Data consistency MUST take precedence over implementation convenience.

### VIII. Security & Privacy

- Least-privilege access is mandatory.
- Sensitive personal information MUST be protected in transit and at rest.
- Authentication and authorization MUST be centralized and consistently
  enforced.
- Secrets and credentials MUST never be stored in source code.
- System behavior MUST comply with applicable privacy and data protection
  regulations.

### IX. API-First Development

- All client-server communication MUST occur through well-defined, versioned
  APIs.
- Shared contracts are the single source of truth between frontend and
  backend.
- Breaking API changes MUST require explicit versioning or migration
  strategies.
- API contracts MUST remain strongly typed and synchronized across
  applications.

### X. Reliability

- Business operations MUST be transactional whenever consistency is required.
- Failures MUST never leave shared data in a partially updated state.
- The system MUST be resilient to concurrent operations from multiple
  charities.
- Recoverable failures MUST support safe retries.

### XI. Scalability

- The architecture MUST support onboarding additional charities without
  fundamental redesign.
- Features MUST be designed to accommodate increasing users, records, and aid
  transactions.
- Performance optimizations MUST never compromise correctness or
  auditability.

### XII. Code Quality

- Code MUST prioritize readability, maintainability, and simplicity.
- Business logic MUST remain independent of transport and presentation
  layers.
- Components and modules MUST have clear responsibilities.
- Shared functionality MUST be reusable rather than duplicated.

### XIII. Testing

- Critical business rules MUST have automated tests.
- Security-sensitive functionality MUST have dedicated test coverage.
- Regression tests MUST accompany bug fixes.
- Multi-tenant isolation and authorization rules MUST be verified through
  testing.

### XIV. Documentation

- Public APIs MUST be documented.
- Significant architectural decisions MUST be recorded.
- Business workflows MUST be documented alongside implementation.
- Changes affecting shared collaboration or data integrity MUST have updated
  documentation.
- Every specification MUST produce a Technical Design Document (TDD) record in
  the `docs/` directory, detailing business rules and the high-level technical
  implementation approach.

### XV. Guiding Principles

Every feature added to the platform MUST answer "Yes" to the following
questions:

- Does it preserve the integrity of the shared registry?
- Does it protect tenant isolation and user privacy?
- Is every important action auditable?
- Can the behavior be understood and verified by participating charities?
- Does it reduce duplication while improving collaboration?
- Can it scale without sacrificing correctness?

## Technical Stack & Constraints

### Technology Stack

| Layer     | Technology                                                             |
| --------- | ---------------------------------------------------------------------- |
| Frontend  | Vite, TanStack Router, shadcn/ui                                       |
| Backend   | NestJS                                                                 |
| Database  | PostgreSQL                                                             |
| API Layer | Shared, strongly-typed contracts consumed by both frontend and backend |

### Design & Platform Constraints

- MUST fully support mobile, tablet, and desktop viewports.
- MUST support English and Arabic, with Arabic as the default locale.
- MUST render right-to-left (RTL) by default.
- MUST check the UI library for needed components before building custom
  ones.
- MUST check the utilities library for needed functionality before building
  custom ones.
- Every feature MUST be implemented on both frontend and backend.
- MUST follow a feature-based directory architecture.

## Development Workflow

- All server communication MUST go through dedicated API clients. Components
  MUST never call `fetch()` directly.
- Business logic MUST be independent from UI components.
- Runtime validation is required for all external data.
- Authentication MUST be handled centrally using the CASL library for
  role-based authorization.
- Page state SHOULD be stored in URL parameters where appropriate.
- Design tokens MUST come from the theme.
- Global variables MUST be defined in a constants file.
- ESLint and Prettier are mandatory and MUST pass before commits.
- Readability MUST be preferred over cleverness.
- Complex business rules MUST be documented.
- Architectural decisions MUST be recorded as Architecture Decision Records
  (ADRs).

## Governance

This constitution supersedes all other practices, guidelines, and
conventions within the project. All specifications, plans, pull requests,
and implementations MUST comply with the principles and rules above.

### Amendment Procedure

1. A proposed amendment MUST be documented in writing, specifying the exact
   changes and rationale.
2. The amendment MUST include a migration plan for any existing work that
   would be affected.
3. The amendment MUST be reviewed and approved by the project maintainers.
4. After approval, the constitution MUST be updated with the new version
   number and amended date.
5. All templates referencing the constitution MUST be reviewed for
   consistency.

### Versioning Policy

- **MAJOR**: Backward incompatible governance or principle removals, or
  redefinitions.
- **MINOR**: New principle or section added, or materially expanded guidance.
- **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements.

### Compliance

- All specifications MUST reference relevant constitutional principles.
- All implementation plans MUST include a "Constitution Check" gate.
- All pull requests MUST verify constitutional compliance before merging.
- Any complexity beyond what principles justify MUST be documented and
  explicitly approved.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2026-07-06
