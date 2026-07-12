# 03. Team Workstream Ownership

> Status: Draft
> Owner: Engineering Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This document divides MVP work across three developers without splitting ownership of the same business invariant.

Developers can work in parallel only after their dependencies are stable. Parallel work must not create competing tenant, identity, Sale, or Inventory models.

---

# Workstreams

| Workstream | Primary Scope | Starts | Cannot Decide Independently |
|---|---|---|---|
| Foundation | API bootstrap, migrations, identity, Organization, Branch, membership, permissions, audit, events | Phase 0 | Sales, payment, catalog, or inventory rules. |
| Commerce Core | Catalog, units, pricing, Sales, Payments, receipts | Phase 3 after Foundation contracts | Tenant, permission, inventory, or provider contract changes. |
| Stock and Experience | Web shell, Branch-aware UI, suppliers, purchases, receipts, Inventory, reporting views | Web shell: Phase 1; stock: Phase 6 | Commercial totals, payment outcomes, or source-module facts. |

---

# Phase Assignments

## Phase 0 and 1

- Foundation: API, database, authentication, membership, roles, permissions, audit, events.
- Commerce Core: web application shell, authenticated session handling, capability-aware navigation.
- Stock and Experience: local development seed scenarios, Organization and Branch selection screens, test data support.

## Phase 2 to 5

- Foundation: tenant, permission, migration, event, and audit review for all changes.
- Commerce Core: Catalog, units, pricing, Sales, Payments, refunds, receipts.
- Stock and Experience: Catalog and Sales UI, authorized read models, error and loading states.

## Phase 6 to 9

- Foundation: background-job, idempotency, synchronization, and observability contracts.
- Commerce Core: public events and contracts required by Purchasing, Inventory, and Reporting.
- Stock and Experience: Suppliers, Purchases, Goods Receipts, Inventory, counts, reporting UI, offline clients.

---

# Collaboration Rules

- The module owner approves changes to its Aggregate invariants and public events.
- The Foundation workstream approves tenant, permission, audit, migration, and event-delivery changes.
- A feature spanning workstreams begins with a short design record naming owners and contracts.
- No developer writes another workstream's module internals to unblock their own feature.
- A shared API contract is agreed before web or mobile implementation begins.

---

# Architecture Rules

- Ownership follows Bounded Contexts, not who starts a task first.
- Parallel work may consume only stable public contracts.
- Integration code cannot be used as a shortcut around module, tenant, or permission boundaries.
- If an invariant has no owner, work stops until the module boundary is decided.

---

# Related Documents

- 01-project-bootstrap.md
- 02-mvp-delivery-sequence.md
- ../development/02-development-workflow.md
- ../architecture/03-module-architecture.md
