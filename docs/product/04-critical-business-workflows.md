# 04. Critical Business Workflows

> Status: Draft
> Owner: Product Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document identifies the business workflows that define a viable Commerce Operating Platform.

Each workflow is expressed in ubiquitous language and spans only public capability contracts.

---

# Design Goals

- Define the outcomes the platform must protect.
- Establish product acceptance boundaries.
- Make cross-capability dependencies visible.
- Identify offline, security, and audit requirements.

---

# Design Principles

## Completed Facts Are Durable

A completed workflow creates authoritative PostgreSQL state and Domain Events before notifications, reports, search, or real-time updates occur.

## Workflows Are Tenant-Scoped

Every action resolves Organization, Branch when applicable, actor, permission, and capability access.

## Offline Work Is Reconciled

Offline clients may collect permitted pending work, but the server remains authoritative during synchronization and conflict resolution.

---

# Architecture Overview

```text
Authorized User Action
↓
Public Application Service
↓
Aggregate Business Decision
↓
PostgreSQL Transaction
↓
Domain Events and Derived Work
```

---

# Core Concepts

## Complete Sale

1. User opens a Sale for an authorized Branch.
2. Catalog and pricing are resolved under enabled capabilities.
3. The Sale Aggregate validates items, totals, and permitted discounts.
4. Payment is recorded through the Payments capability.
5. Sale completion creates durable records and completed business events.
6. Inventory, reporting, receipts, and permitted real-time views react asynchronously.

## Record Payment and Refund

1. An authorized user records a payment against an eligible Sale.
2. Payment state is persisted and auditable.
3. A refund validates the original payment, authorization, and available amount.
4. Downstream reporting and customer balance projections update through events.

## Adjust Inventory

1. An authorized user records a reasoned stock adjustment.
2. The Inventory Aggregate validates the movement and available policy.
3. A durable Stock Movement is recorded.
4. Inventory projections and reports update asynchronously.

## Receive Purchase

1. A purchase is created for an authorized supplier and Branch.
2. Received quantities are validated against the purchase lifecycle.
3. Inventory movements are recorded when stock is received.
4. Batch and expiry data is captured when the capability is enabled.

## Synchronize Offline Work

1. The client authenticates and resolves current tenant access.
2. Pending mutations are submitted with identity and ordering context.
3. The server validates authorization and Aggregate invariants.
4. Accepted changes become authoritative; conflicts return a resolvable outcome.
5. The client refreshes durable state and clears only confirmed work.

---

# Best Practices

- Define workflow acceptance in business language.
- Test successful, denied, duplicate, interrupted, and offline paths.
- Keep each workflow's Aggregate ownership explicit.
- Publish only completed business facts.
- Preserve audit context for financial and inventory changes.

---

# Architecture Rules

- Controllers and clients never own workflow business rules.
- Aggregates own invariant enforcement.
- Modules collaborate only through Domain Events or public Application Services.
- PostgreSQL is authoritative for every workflow outcome.
- Offline and real-time mechanisms never replace durable reconciliation.
- Plugins may extend a workflow only through approved public contracts.

---

# Related Documents

- product/01-ubiquitous-language.md
- product/02-capability-catalog.md
- architecture/07-offline-sync.md
- domain/02-aggregates.md
- domain/05-domain-events.md
