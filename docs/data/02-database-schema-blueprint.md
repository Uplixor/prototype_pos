# 02. Database Schema Blueprint

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This document is the schema blueprint for the MVP.

It defines the persisted records, ownership references, uniqueness rules, and immutable histories that the eventual PostgreSQL and Prisma implementation must preserve.

It does not prescribe table syntax or ORM declarations.

---

# Global Schema Rules

Every tenant-owned record requires:

- A stable primary identifier.
- An immutable Organization identifier.
- Creation time and last update time.
- Creator or actor reference when the record results from a user decision.
- Soft-archive state only where the record is allowed to stop future use.

Organization ownership is never nullable for tenant business data.

Business-facing documents use immutable human-readable numbers in addition to internal UUIDs. Sale, receipt, purchase, and transfer numbers are unique within their Organization; the format is configuration, not a primary key.

Branch-owned records also require an immutable Branch identifier. A Branch must belong to the same Organization as every record it references.

---

# Tenant and Access Records

| Record | Required References | Critical Constraints |
|---|---|---|
| Organization | None | Organization identity is globally unique and is the tenant boundary. |
| Branch | Organization | Branch cannot be reassigned to another Organization. |
| User | None | Identity may be global; business access is not. |
| Organization Membership | User, Organization | One active membership per User and Organization. |
| Role | Organization | Role names are unique within an Organization. |
| Permission Grant | Role or Membership, Permission | Permission scope records Branch limitation when applicable. |
| Capability Enablement | Organization, Capability | One current enablement state per Organization and Capability. |

---

# Catalog Records

| Record | Required References | Critical Constraints |
|---|---|---|
| Category | Organization | Category name is unique within its Organization policy. |
| Product | Organization | Product may be archived but not deleted after transactional reference. |
| Unit | Organization or platform | Product quantities use an explicit base unit. |
| Tax Profile and Tax Rate | Organization | Historical sale tax is stored as a snapshot. |
| Product Branch Availability | Product, Branch | Product and Branch must belong to the same Organization. |
| Variant | Product | Variant identity is unique within its Product. |
| Modifier Group | Organization | May be attached only through explicit Product policy. |
| Modifier Option | Modifier Group | Option cannot be selected when archived. |
| Price Definition | Product or Variant, Organization | Effective pricing must not overlap ambiguously for the same scope. |

Catalog records must never be used to overwrite Sale Item snapshots.

---

# Sales and Payment Records

| Record | Required References | Critical Constraints |
|---|---|---|
| Sale | Organization, Branch, creator | Completed Sales are immutable. |
| Sale Item | Sale, Product identity | Stores frozen name, quantity, unit price, tax, discount, and total snapshots. |
| Sale Item Modifier | Sale Item | Stores frozen modifier description and price effect. |
| Sale Discount Allocation | Sale, Sale Item when allocated | Allocation total cannot exceed Sale discount total. |
| Payment | Sale, Organization, Branch, method | Recorded Payment is immutable and idempotency identity is unique within its tenant scope. |
| Refund | Original Payment, Sale | Refund amount cannot exceed remaining refundable amount. |
| Payment Reconciliation | Payment, provider reference | Provider reference is unique for the relevant provider and tenant. |

A Payment, Refund, and Sale must all belong to the same Organization. A Refund cannot reference a Payment from another Sale.

---

# Inventory and Purchasing Records

| Record | Required References | Critical Constraints |
|---|---|---|
| Supplier | Organization | Supplier identity is tenant-scoped. |
| Purchase | Organization, Branch, Supplier | Purchase creation does not create stock. |
| Purchase Item | Purchase, Product | Quantity and expected cost remain purchase facts. |
| Goods Receipt | Purchase, Branch, receiver | Receipt creates inventory eligibility, not Purchase creation. |
| Stock Movement | Organization, location, Product, reason | Movement is immutable and has one accountable business cause. |
| Stock Transfer | Organization, origin, destination | Origin and destination differ and belong to same Organization. |
| Stock Count | Organization, location, actor | Reconciliation creates movements; count never overwrites history. |
| Batch | Organization, Product, Goods Receipt | Batch is required only when tracking capability is enabled. |

Stock availability is derived from immutable movements. It may be materialized for performance but is never the sole accounting record.

An `inventory_balances` projection may be introduced when read performance requires it. It is rebuilt from Stock Movements and cannot approve or replace inventory decisions.

---

# Supporting Records

| Record | Required References | Critical Constraints |
|---|---|---|
| Customer | Organization | Customer data is never shared across Organizations. |
| Audit Record | Organization, actor when known, affected record | Audit records are append-only. |
| Domain Event Record | Organization, Aggregate | Event identity is unique and payload version is retained. |
| Idempotency Record | Organization, caller, operation identity | Duplicate accepted command returns the original outcome. |
| File Metadata | Organization, owner record | Binary location is not business ownership. |
| Offline Mutation | Organization, device/user, mutation identity | Accepted, rejected, and conflict outcomes are retained. |

---

# Relationship Rules

```text
Organization
├── Branch
├── Membership and Capability Enablement
├── Catalog
├── Customers and Suppliers
├── Sales → Sale Items → Payments → Refunds
└── Purchases → Goods Receipts → Stock Movements
```

No foreign reference may cross Organization boundaries.

Records with completed commercial, financial, inventory, or audit history must preserve references even when related Catalog, Customer, Supplier, or User records are archived.

---

# Schema Admission Rules

A new record requires an owning module, Organization scope, lifecycle, uniqueness policy, immutable-history decision, audit requirement, event impact, and retention policy.

Adding a field to satisfy a screen is insufficient. The field must represent a business fact, policy, or authorized projection owned by a Bounded Context.

---

# Related Documents

- 01-domain-data-model.md
- ../architecture/04-persistence.md
- ../architecture/10-multi-tenancy-architecture.md
- ../modules/sales.md
- ../modules/payments.md
- ../modules/inventory.md
