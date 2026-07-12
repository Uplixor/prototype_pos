# 01. Project Bootstrap Guide

> Status: Draft
> Owner: Engineering Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Why This Exists

The team needs one repeatable environment before business features are built. Without it, each feature invents its own tenant, migration, error, and local-data behavior.

---

# Scope

Build:

- API and web application startup.
- Local PostgreSQL and Redis configuration.
- Migration execution from an empty database.
- Seed data for two Organizations and Branches.
- Logging, error correlation, linting, and test execution.

Do not build Catalog, Sales, Payments, Inventory, or provider integrations in this guide.

---

# Database Scope

Create the migration baseline for the DBML. No domain records are exposed until the tenant foundation guide is complete.

```text
Required infrastructure state
PostgreSQL database
Redis instance
Migration history
Seed scenario: Organization A and Organization B
```

The seed scenario must prove that data created for Organization A cannot be queried through Organization B context.

---

# Steps

1. Create `apps/api` and `apps/web` runtime entry points.
2. Define local configuration names, validation, and secret-loading rules.
3. Start PostgreSQL and Redis with development-only credentials.
4. Establish migration creation, application, and rollback verification.
5. Establish test, lint, formatting, and type-check commands.
6. Add structured correlation to API errors and background work.
7. Add fictional tenant seed data for local development.
8. Prove the project starts from an empty database on another developer machine.

---

# Acceptance Checks

- A new developer can create the local environment without production data.
- Migrations apply in order to an empty database.
- PostgreSQL failure is distinguishable from Redis failure.
- Redis can be unavailable without claiming that business data was lost.
- The repository has one documented command path for validation before merge.

---

# Related Documents

- README.md
- ../development/01-local-development.md
- ../delivery/01-project-bootstrap.md
- ../data/commerce-platform-mvp.dbml
