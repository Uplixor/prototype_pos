# 01. MVP Feature Plan

> Status: Draft
> Owner: Product Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This plan defines the first build sequence for a reliable single-business commerce workflow. It is a capability order, not a list of unrelated screens.

---

# Build Order

| Phase | Build | Must Be True Before Moving On |
|---|---|---|
| 1 | Organization, Branch, Identity, Permissions | Every record and request is tenant-scoped. |
| 2 | Catalog and configuration | Products can be created, activated, archived, and sold under Branch policy. |
| 3 | Sales | Completed Sales are immutable and preserve commercial snapshots. |
| 4 | Payments and receipts | Payment and refund facts are immutable and auditable. |
| 5 | Inventory and purchasing | Only received goods increase stock; all changes create Stock Movements. |
| 6 | Reporting | Reports derive from completed facts without changing them. |
| 7 | Offline sale synchronization | Server validation, idempotency, and conflict outcomes are proven. |

---

# Explicitly Deferred

- Tables, kitchen, reservations, delivery, and recipes
- Loyalty, credit, expenses, and attendance
- Batch, expiry, and prescription workflows
- Plugins, marketplace, and advanced integrations
- Mobile application, until the API workflow and offline contracts are proven

---

# Definition of MVP Completion

An authorized user can create Products, complete and correct a Sale, record payment, receive stock, adjust stock with an audit reason, and view tenant-scoped results.

No phase is complete if another Organization can access its data or if a client can create an unvalidated financial or stock outcome.

---

# Related Documents

- ../product/02-capability-catalog.md
- ../product/04-critical-business-workflows.md
- ../modules/sales.md
- ../modules/payments.md
- ../modules/inventory.md
