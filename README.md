# Unified Charity Indigent Management System

A collaborative platform that lets charities within a city share a **single, unified registry of indigents (people in need)**, so aid is coordinated instead of duplicated. Every charity can log the assistance it provides, see what aid others have already given to the same person, flag suspected abuse or fraud, and run fundraising events to collect money for those in need.

## Why this exists

Charities in the same city often help the same people without knowing it — leading to duplicated aid for some and neglect for others. This system solves that by giving all participating charities:

- **One shared list** of indigents instead of separate, siloed spreadsheets
- **Visibility** into aid already given by other charities
- **A way to flag abuse** (e.g. someone falsely registered, or exploiting multiple charities)
- **Fundraising tools** to collect and direct donations toward specific indigents or campaigns

## Core Features

- **Unified Indigent Registry** — a shared, city-wide list of indigents that all participating charities can view and reference.
- **Aid Recording** — any charity can log the aid it gave to an indigent (cash, food, medical, education, etc.), visible to all other charities.
- **Cross-Charity Visibility** — before helping someone, a charity can see the full aid history recorded by other organizations.
- **Abuse Reporting** — any charity can flag an indigent's record for suspected abuse or fraud, triggering a review process.
- **Change Request / Audit Workflow** — edits to shared indigent records go through a change-request flow so the registry stays accurate and auditable across organizations.
- **Fundraising Events** — charities can create and manage fundraising campaigns/events to collect donations for indigents or causes.
- **Multi-Tenant Access** — each charity operates as its own tenant with its own staff, while sharing the common registry.

## Tech Stack

| Layer     | Technology                                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------------- |
| Frontend  | [Vite](https://vitejs.dev/), [TanStack Router](https://tanstack.com/router), [shadcn/ui](https://ui.shadcn.com/) |
| Backend   | [NestJS](https://nestjs.com/)                                                                                    |
| Database  | PostgreSQL                                                                                                       |
| API Layer | Shared, strongly-typed contracts consumed by both frontend and backend                                           |

## Monorepo Structure

Frontend and backend live in a single repository and **share the same API contract definitions**, so requests/responses stay in sync and type-safe across both sides.

```
.
├── apps/
│   ├── frontend/          # Vite + TanStack Router + shadcn app
│   └── backend/           # NestJS API server
├── packages/
│   └── api-contracts/     # Shared types, DTOs, and API schemas
│                          # used by both frontend and backend
├── package.json
└── README.md
```

> Adjust the structure above to match your actual workspace tool (e.g. pnpm workspaces, Turborepo, Nx).

## Data Model (high level)

- **Charity (Tenant)** — an organization participating in the network, with its own staff/users.
- **Indigent** — a shared record representing a person in need (identity info, situation, status).
- **Aid Record** — an entry logged by a charity describing aid given to an indigent (type, amount/value, date, notes).
- **Abuse Report** — a flag raised by a charity against an indigent record, with reason and status (pending/reviewed/resolved).
- **Change Request** — a proposed edit to a shared indigent record, requiring review before being applied.
- **Fundraising Event** — a campaign created by a charity (or jointly) to raise funds, optionally linked to specific indigents.
- **Donation** — a contribution made toward a fundraising event.
