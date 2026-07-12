# 01. Local Development

> Status: Draft
> Owner: Engineering Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This document defines the local environment required to develop the Commerce Operating Platform without weakening tenant, event, or persistence assumptions.

---

# Required Local Services

Local development requires isolated instances of:

- PostgreSQL for authoritative business data.
- Redis for cache and BullMQ coordination.
- Object-storage-compatible service only when file workflows are developed.

Local services must not share production credentials, tenant data, payment credentials, or provider endpoints.

---

# Local Data Rules

- Seed data uses fictional Organizations, Branches, users, Products, and customers.
- Every seed scenario creates explicit Organization and Branch scope.
- Development data must exercise at least two Organizations to expose tenant-isolation mistakes.
- Financial, inventory, and audit fixtures must use realistic immutable histories, not edited balances.
- Database resets are permitted only for local development data.

---

# Environment Rules

- Secrets are supplied locally and never committed.
- Development configuration identifies the local environment explicitly.
- Provider integrations default to sandbox or disabled state.
- Cache failure must be testable by running without Redis.
- Offline and job workflows require reproducible local failure scenarios.

---

# Read Before Coding

1. [Documentation Map](../README.md)
2. [Project Structure](../architecture/09-project-structure.md)
3. The owning module document under [modules](../modules/)
4. [Permission System](../architecture/06-permission-system.md)
5. [Offline Sync](../architecture/07-offline-sync.md) when changing a mobile-supported workflow

---

# Architecture Rules

- Local convenience must not introduce a production-only business path.
- PostgreSQL remains the local source of truth.
- Redis is never used as local business truth.
- A developer must be able to prove tenant isolation before merging tenant-scoped work.
