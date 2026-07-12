# MVP Feature Build Guides

> Status: Draft
> Owner: Engineering Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

These guides convert platform decisions into buildable feature sets.

Do not begin a guide until all of its prerequisites are accepted. Do not mark it complete until its data rules, permission rules, audit behavior, and acceptance checks are proven.

---

# Guide Order

| Guide | Build Only After |
|---|---|
| [01. Project Bootstrap](01-project-bootstrap-guide.md) | Nothing |
| [02. Authentication and Tenant Foundation](02-authentication-and-tenant-guide.md) | Project Bootstrap |
| [03. Catalog and Product Setup](03-catalog-and-product-guide.md) | Authentication and Tenant Foundation |
| [04. Sales and Payments](04-sales-and-payments-guide.md) | Catalog and Product Setup |
| [05. Purchasing and Inventory](05-purchasing-and-inventory-guide.md) | Sales and Payments |
| [06. Reporting and Offline Sync](06-reporting-and-offline-guide.md) | Purchasing and Inventory |

---

# Schema Reference

[MVP DBML](../data/commerce-platform-mvp.dbml) is the reviewed business data model.

Each guide names only the tables it owns or consumes. Prisma and PostgreSQL migrations are created from the reviewed DBML and the guide's acceptance rules, never the reverse.

---

# Required Sections

Every future implementation guide must include:

- Why the feature exists for the business.
- Dependencies and explicit exclusions.
- Owned and consumed database records.
- Business invariants and permission boundaries.
- Ordered build steps.
- Events, audit, and offline implications.
- Acceptance checks and migration decisions.

---

# Architecture Rules

- A guide may not redefine an Aggregate owned by another module.
- Schema changes must update the DBML before a Prisma migration is approved.
- Completion means durable business behavior is proven, not merely that UI screens exist.
- Optional capabilities receive their own guide after the MVP core is stable.
