# 10. Multi-Tenancy Architecture

> Status: Draft
> Owner: Platform Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the mandatory multi-tenancy model of the Commerce Operating Platform.

Multi-tenancy protects Organization data, operations, configuration, and extensions while allowing shared platform infrastructure.

---

# Design Goals

- Prevent cross-Organization data access.
- Support Branch-scoped operations.
- Provide a consistent tenant context at every boundary.
- Keep tenant isolation independent of client behavior.
- Support operational investigation without exposing tenant data.

---

# Design Principles

## Organization Is the Tenant Boundary

An Organization is the primary tenant. Every tenant-owned record, event, job, cache entry, file, search document, and real-time channel belongs to one Organization.

## Branch Is an Operational Scope

A Branch belongs to one Organization. Branch scope refines access and workflow visibility but never crosses the Organization boundary.

## Trusted Context

Tenant context is derived from authenticated identity and authorized routing or claims. Client-supplied identifiers are validated and never trusted by themselves.

---

# Architecture Overview

```text
Authenticated Identity
↓
Resolve Organization Membership
↓
Resolve Branch and Capability Scope
↓
Authorize Public Application Service
↓
Tenant-Scoped Business Operation
```

---

# Core Concepts

## Tenant Context

Tenant context includes Organization ID, actor identity, permitted Branches, role and permissions, enabled capabilities, correlation information, and locale where relevant.

The context is propagated to synchronous operations, Domain Events, jobs, cache access, files, search, real-time delivery, and audit records.

## Data Isolation

PostgreSQL data is tenant-scoped by design and queried only within authorized context.

Redis keys, object locations, search documents, and message channels include Organization scope. Shared in-memory state is prohibited for tenant business data.

## Tenant Lifecycle

Organization creation establishes tenant configuration and initial authorized administration. Suspension, archival, and deletion follow explicit business and retention policies.

Historical records retain Organization ownership throughout their lifecycle.

---

# Lifecycle / Flow

```text
Request, Event, or Job
↓
Authenticate or Validate Service Identity
↓
Resolve Trusted Organization Context
↓
Authorize Action and Branch Scope
↓
Execute Tenant-Scoped Work
↓
Persist and Emit Tenant-Scoped Outcome
```

---

# Best Practices

- Test cross-tenant denial for every protected capability.
- Include tenant scope in correlation and audit context.
- Treat background jobs and integrations as tenant-sensitive operations.
- Keep tenant configuration separate from global platform configuration.
- Revalidate access after permission or capability changes.

---

# Architecture Rules

- Multi-tenancy is mandatory.
- PostgreSQL is the source of truth for tenant ownership and access state.
- No module may perform unscoped tenant data access.
- Modules communicate only through Domain Events or public Application Services.
- Plugins are tenant-scoped and cannot access other Organizations.
- Cache, search, files, and real-time delivery must include tenant isolation.
- Business logic never exists in controllers, repositories, or infrastructure.

---

# Related Documents

- architecture/04-persistence.md
- architecture/06-permission-system.md
- architecture/07-offline-sync.md
- backend/06-caching-architecture.md
- backend/08-security-architecture.md
