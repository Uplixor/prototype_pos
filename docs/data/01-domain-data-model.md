# 01. Domain Data Model

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This document defines the business records that must exist before implementation schemas are designed.

It establishes ownership and invariants. It is not a Prisma schema or SQL design.

---

# Global Record Rules

- Every tenant-owned record has exactly one Organization owner.
- Branch-scoped records retain their Branch identity permanently.
- Completed Sales, Payments, Refunds, Stock Movements, and audit records are never edited or deleted.
- All corrections create new, linked business records.
- PostgreSQL is authoritative for every listed record.

---

# Core Records

| Owner | Required Records | Critical Constraint |
|---|---|---|
| Platform | Organization, Branch, Capability Enablement, Audit Record | Organization is the tenant boundary. |
| Identity | User, Membership, Role, Permission Grant | Access is Organization and optionally Branch scoped. |
| Catalog | Product, Category, Variant, Modifier, Price Definition | Product changes do not rewrite Sales. |
| Sales | Sale, Sale Item, Discount Allocation | Completed Sale is immutable. |
| Payments | Payment, Refund, Reconciliation Record | Financial corrections are new transactions. |
| Inventory | Stock Movement, Stock Count, Transfer, Batch when enabled | Stock changes only through movement. |
| Purchasing | Supplier, Purchase, Goods Receipt | Purchase creation does not increase stock. |
| CRM | Customer, Customer Credit Entry when enabled | Customer records are tenant-scoped. |
| Operations | Reservation, Table, Kitchen Ticket, Delivery when enabled | Operational state does not rewrite financial state. |

---

# Required References

- Sale Item references a Product identity and stores a frozen commercial snapshot.
- Payment and Refund reference one Sale and retain Branch, method, currency, actor, and time.
- Stock Movement references its business cause: receipt, completed sale, count, transfer, return, or adjustment.
- Audit Record references the actor, Organization, action, affected business record, and immutable outcome.
- Every event, job, file, cache key, search document, and offline mutation carries Organization scope.

---

# Schema Admission Rules

A new persisted record requires documented owner, tenant scope, lifecycle, retention, audit behavior, public contract, and migration path.

A schema cannot be introduced solely because a screen needs data; the owning module must first identify the business fact or policy it represents.

---

# Related Documents

- ../architecture/04-persistence.md
- ../architecture/10-multi-tenancy-architecture.md
- ../modules/catalog.md
- ../modules/sales.md
- ../modules/payments.md
- ../modules/inventory.md
