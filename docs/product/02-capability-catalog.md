# 02. Capability Catalog

> Status: Draft
> Owner: Product Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This catalog defines the business capabilities the platform may compose for an Organization. It prevents restaurant, retail, bakery, and pharmacy requirements from creating separate core products.

---

# Platform Decisions

## Industry Is Not a Domain Boundary

An Organization is not created as a restaurant, retailer, or pharmacy variant. It receives a permitted set of capabilities and configuration.

The same Catalog, Sales, Payments, Inventory, Identity, and Reporting domains remain authoritative across industries.

## Core Capabilities Cannot Be Replaced

Organization, Identity, Catalog, Sales, Payments, Inventory, CRM, Purchasing, Reporting, and Configuration are core platform capabilities.

Plugins and optional capabilities may consume and extend their public contracts. They cannot replace their Aggregates, redefine their invariants, or access internal state.

## Optional Capabilities Add Workflow, Not Alternative Truth

Tables, Kitchen Display, Delivery, Recipes, Batches, Expiry Tracking, Prescription, Loyalty, Barcode, Expenses, and Attendance add permitted workflow state.

They do not create a second Sale, Payment, Product, Customer, or Stock Movement model.

## Capability Enablement Is Tenant State

An enabled capability belongs to one Organization. Branch availability is an explicit refinement, never an implicit global setting.

Capability state is durable, permission-controlled, auditable, and evaluated server-side.

---

# Capability Decisions

| Capability | Classification | Non-Negotiable Decision | Depends On |
|---|---|---|---|
| Organization and Branch | Core | Every business record belongs to exactly one Organization. | Identity |
| Identity and Access | Core | Permissions are evaluated per Organization and Branch. | Organization |
| Catalog | Core | Product is the universal sellable concept. | Organization |
| Sales | Core | Completed Sales are immutable. | Catalog, Identity |
| Payments | Core | Payments and Refunds are immutable financial facts. | Sales |
| Inventory | Core | Stock changes only through append-only Stock Movements. | Catalog |
| Purchasing | Core | A Purchase does not increase stock until receipt. | Suppliers, Inventory |
| CRM | Core | Customer data is tenant-owned and permission-scoped. | Organization |
| Reporting | Core | Reports do not modify source business facts. | Published facts |
| Tables and Reservations | Optional | Operational capacity never rewrites Sale facts. | Sales |
| Kitchen Display | Optional | Ticket progress never changes financial state. | Sales, Catalog |
| Delivery | Optional | Delivery tracks fulfillment, not payment settlement. | Sales, CRM |
| Batches and Expiry | Optional | Batch data extends Stock Movements; it does not replace them. | Inventory |
| Prescription | Optional | Prescription workflow cannot bypass Sale, Payment, or audit rules. | Catalog, CRM |
| Loyalty and Credit | Optional | Credit changes are auditable financial or customer facts. | CRM, Sales, Payments |

---

# Enablement Rules

1. A capability has a named Bounded Context owner.
2. Its Organization entitlement is recorded before users can access it.
3. Its permissions, Branch scope, offline policy, events, and historical-data policy are explicit.
4. Enabling it does not mutate existing core domain models.
5. Disabling it stops new workflow actions but preserves historical records and audit access.

```text
Entitlement
↓
Authorized Organization Enablement
↓
Capability Configuration
↓
Branch Availability
↓
User Permission Evaluation
```

---

# New Capability Admission Rules

A proposed capability is rejected until it answers all of the following:

- What new business outcome does it own?
- Which existing Aggregate remains authoritative?
- What new state transition and audit history does it require?
- Which Organization and Branch rules constrain it?
- Can the workflow operate offline, and if so, what is the conflict policy?
- Which public events or Application Services does it consume and publish?
- Can a plugin implement it without modifying a core model?

---

# Architecture Rules

- Capability boundaries follow Bounded Context ownership.
- Capability configuration never weakens a core invariant.
- PostgreSQL is authoritative for entitlement and configuration.
- Redis can cache capability state but cannot authorize it alone.
- Modules collaborate only through Domain Events or public Application Services.
- Plugins are optional capability extensions and never core-domain modifiers.

---

# Related Documents

- product/01-ubiquitous-language.md
- product/03-mvp-scope-and-roadmap.md
- domain/01-bounded-contexts.md
- architecture/08-plugin-system.md
- architecture/14-configuration-and-capability-management.md
