# 02. MVP Delivery Sequence

> Status: Draft
> Owner: Product and Engineering Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This document is the dependency order for MVP development.

The team completes a phase only when its invariants are demonstrably true. Screens alone do not complete a phase.

---

# Delivery Order

| Phase | Feature Set | Why It Must Precede the Next Phase | Completion Gate |
|---|---|---|---|
| 0 | Project bootstrap | Every feature depends on trusted tenant, migration, audit, and local development foundations. | Two Organizations are isolated end to end. |
| 1 | Authentication and access | All business actions require a known actor, Organization, Branch, role, and permission. | Unauthorized and cross-tenant actions are rejected. |
| 2 | Organization and Branch configuration | Catalog, Sales, pricing, and stock must have a tenant and operating location. | Branch belongs to exactly one Organization. |
| 3 | Catalog and units | A Sale cannot preserve commercial facts without an approved Product and unit. | Products can be activated, archived, and scoped to a Branch. |
| 4 | Sales | Payments and stock consumption require a durable commercial agreement. | Completed Sales are immutable with item snapshots. |
| 5 | Payments and receipts | A business must record money only against an eligible Sale. | Duplicate payment and over-refund are rejected. |
| 6 | Suppliers, Purchases, and Goods Receipts | Inventory needs a source for inbound stock. | Purchase creation does not increase stock; receipt does. |
| 7 | Inventory movements and counts | Stock workflows need append-only accountability. | Every stock change has a reason and immutable movement. |
| 8 | Reporting | Reports must consume completed source facts. | Financial and stock reports are tenant-scoped and rebuildable. |
| 9 | Offline synchronization | Offline commands require stable core invariants first. | Duplicate, rejected, and conflicted mutations have explicit outcomes. |

---

# Feature Start Rules

- Do not start Payments before completed Sale lifecycle is accepted.
- Do not start Inventory before Product, Unit, Branch, Purchase, and Goods Receipt decisions exist.
- Do not start Reporting before source events and immutable facts exist.
- Do not start mobile offline work before API command idempotency is proven.
- Optional capabilities begin only after Phase 9 or with explicit product approval.

---

# Definition of Done for Every Phase

- Owning module document is current.
- Schema impact is reviewed against the business data model.
- Organization, Branch, capability, and permission scope are tested.
- Audit, event, job, and offline implications are documented.
- Client workflows show durable success, denial, failure, and retry outcomes.
- Existing phase invariants remain protected.

---

# Related Documents

- 01-project-bootstrap.md
- 03-team-workstream-ownership.md
- ../features/01-mvp-feature-plan.md
- ../product/04-critical-business-workflows.md
