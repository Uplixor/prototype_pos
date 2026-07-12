# Reporting Module

> Status: Draft
> Owner: Reporting Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

Reporting owns tenant-scoped operational insight derived from completed business facts.

---

# Decisions

## Reports Never Change Commerce Facts

Reporting may calculate, group, filter, and present facts. It never edits a Sale, Payment, Stock Movement, Customer, or Product to correct a report.

Corrections occur in the source module and reach Reporting through new completed facts.

## Every Metric Has a Source and Horizon

Each metric documents its source Bounded Context, inclusion rules, currency and time-zone policy, Organization and Branch scope, and freshness horizon.

The platform does not present a report as real-time when it is based on an asynchronous projection.

## Financial Reports Use Immutable Facts

Revenue, payment, refund, discount, and tax reports derive from completed Sales and immutable Payments. They never recalculate historical results from current Catalog prices or configuration.

## Tenant Scope Precedes Aggregation

Reporting queries scope Organization and authorization before grouping or aggregation. A cross-tenant dashboard is not a normal product capability.

---

# Report Rules

| Report Family | Authoritative Facts |
|---|---|
| Sales | Completed Sales and their frozen item snapshots |
| Payments | Recorded Payments and Refunds |
| Inventory | Immutable Stock Movements and approved availability projections |
| Purchasing | Purchase and goods-receipt facts |
| Operations | Completed operational lifecycle events |

Reporting is allowed to rebuild its projections from PostgreSQL and public Domain Events.

---

# Ownership and Contracts

Reporting owns report definitions, projection freshness, access filtering, export lifecycle, and presentation-oriented read models.

Source modules own the interpretation and correction of their facts. Reporting consumes only published facts and public read contracts.

Exports are generated as tenant-scoped files with a requester, scope, report definition version, and retention policy.

---

# Audit and Permission Decisions

Financial, customer, and staff reports require explicit permissions. Every export retains actor, Organization, Branch scope, selected period, and generation time for audit.

Changing a report formula is a versioned product decision; it must not silently restate historical reports without an explicit migration policy.

---

# Architecture Rules

- Reporting is read-only with respect to core business state.
- Reports consume Domain Events or public Application Services only.
- PostgreSQL is the source for rebuildable reporting truth.
- Report projections, cache, and search never override source facts.
- Plugins may add reports but cannot change core financial metric definitions.

---

# Related Documents

- modules/sales.md
- modules/payments.md
- modules/inventory.md
- architecture/11-cqrs-architecture.md
- backend/11-file-storage-architecture.md
