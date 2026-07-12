# 06. Reporting and Offline Sync Guide

> Status: Draft
> Owner: Foundation and Stock Workstreams
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Why This Exists

Reporting gives operators insight from completed facts. Offline synchronization lets supported work continue through unreliable connectivity. Neither may invent or overwrite business truth.

---

# Dependencies and Exclusions

Requires completed Sale, Payment, Refund, Goods Receipt, and Stock Movement facts; durable events; command idempotency; and trusted tenant context.

Build authorized report projections and offline synchronization for supported MVP commands. Do not treat real-time messages, cache, search, or local device data as authoritative history.

---

# Database Scope

| Records | Required Rule |
|---|---|
| `domain_events` | Completed facts are retained with Organization, Aggregate, version, and time. |
| Reporting projections | Rebuildable from PostgreSQL and public events; never source truth. |
| `idempotency_records` | Duplicate offline command returns original outcome. |
| Offline mutation records | Retain accepted, rejected, and conflict outcome with tenant and actor context. |

---

# Build Steps

1. Define each report metric, source fact, Organization/Branch scope, and freshness horizon.
2. Build Sales, Payment, and Stock Movement projections from completed facts.
3. Enforce reporting permissions before aggregation and export.
4. Expose projection freshness to users.
5. Define supported offline commands and prohibited commands.
6. Persist a stable client mutation identity before retrying a command.
7. Validate synchronized commands through normal server-side Application Services and Aggregates.
8. Return confirmed, rejected, or conflict outcomes; never silently overwrite local state.
9. Rebuild client read models from authoritative outcomes after synchronization.

---

# Invariants

- Reports never update Sales, Payments, or Inventory.
- Report values use immutable historical facts, not current Catalog configuration.
- Offline acceptance is determined by the server, not client time or optimistic UI state.
- A real-time signal may refresh a view but cannot confirm a pending mutation.
- A user cannot export or synchronize data outside their Organization and permission scope.

---

# Acceptance Checks

- Rebuild a report projection and obtain the same result from authoritative facts.
- Reject duplicate, cross-tenant, revoked-permission, and invalid offline mutations.
- Demonstrate clear conflict and retry outcomes after connectivity interruption.
- Confirm reports remain read-only during all failure scenarios.

---

# Related Documents

- ../modules/reporting.md
- ../architecture/07-offline-sync.md
- ../architecture/11-cqrs-architecture.md
- ../data/commerce-platform-mvp.dbml
