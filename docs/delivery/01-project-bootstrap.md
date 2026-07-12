# 01. Project Bootstrap

> Status: Draft
> Owner: Engineering Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This document defines the work that must be completed before feature development begins.

The goal is not to build generic infrastructure. The goal is to establish the constraints every Commerce Platform feature depends on.

---

# Bootstrap Completion Criteria

Project bootstrap is complete only when all of the following are true:

- `apps/api` and `apps/web` can run against local PostgreSQL and Redis.
- The database migration process is repeatable from an empty local database.
- A local environment contains at least two fictional Organizations and Branches.
- The API can establish authenticated identity and trusted Organization context.
- Every protected request can reject missing or cross-Organization scope.
- Audit, correlation, and error outcomes are visible in local development.
- The project can run its required checks before a pull request is merged.

---

# Bootstrap Work Items

## Repository and Runtime

- Establish the API and web application entry points.
- Define local non-secret configuration and secret handling.
- Establish PostgreSQL and Redis local service lifecycle.
- Add formatting, linting, type checking, and test execution to the contribution workflow.

No domain feature is started until a new developer can create a local environment without copying production state.

## Tenant and Identity Foundation

- Implement Organization, Branch, User, Membership, Role, and Permission records.
- Establish trusted tenant context from authenticated membership.
- Enforce Organization and Branch scope at public Application Service boundaries.
- Create seed scenarios proving that users cannot cross tenant boundaries.

Sales, Catalog, Payments, and Inventory may not introduce their own user or tenant models.

## Persistence and Audit Foundation

- Implement the reviewed business data model through migrations.
- Establish immutable audit records for security-sensitive and financial actions.
- Establish idempotency storage for commands that can be retried.
- Establish durable Domain Event recording after successful transactions.

---

# Not Included

- Sales, Products, Payments, Inventory, reports, or mobile screens.
- Provider integrations.
- Plugins, marketplace, advanced analytics, or optional industry workflows.

---

# Architecture Rules

- Bootstrap must prove multi-tenancy before feature work starts.
- PostgreSQL is established before cache, queue, search, or real-time optimizations.
- Redis failure cannot prevent the identity and tenant foundation from remaining correct.
- No feature may bypass the public tenant and permission boundary created here.

---

# Related Documents

- ../development/01-local-development.md
- ../architecture/06-permission-system.md
- ../architecture/10-multi-tenancy-architecture.md
- ../data/commerce-platform-mvp.dbml
