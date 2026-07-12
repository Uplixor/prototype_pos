# Sales Module

> Status: Draft
> Owner: Sales Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

Sales owns the commercial agreement between an Organization and its customer: what was sold, at what price, under which tax and discount terms, and when that agreement became final.

---

# Decisions

## A Completed Sale Is Immutable

Completion freezes the Sale Item description, Variant, Modifier selection, unit price, tax treatment, discount allocation, customer reference, Branch, and actor context.

Catalog, tax, and discount changes made later never alter a completed Sale. Corrections occur through explicit cancellation, refund, return, or adjustment workflows.

## A Sale Does Not Own Payment Settlement

Sales determines the amount due and whether a Sale is eligible for completion. Payments owns whether money was received, failed, reversed, or refunded.

A Sale cannot assume payment success from a client action, provider redirect, or queued job. It reacts only to an authorized Payments outcome.

## Sale Completion Is the Commercial Boundary

Only a completed Sale is a source for revenue reporting, fulfillment, kitchen work, loyalty accrual, and ordinary inventory consumption.

Draft and awaiting-payment Sales are operationally useful but do not create those downstream facts.

## One Sale Belongs to One Organization and One Branch

The Branch is frozen when a Sale is created. A Sale cannot be moved to another Branch because pricing, tax, stock, cash accountability, and operational ownership may differ.

---

# State Transitions

| State | Permitted Decision | Invariant |
|---|---|---|
| Open | Add, remove, or amend items | Only authorized active Products may be added. |
| Awaiting Payment | Request or record payment | Totals are recalculated from Sale facts before payment. |
| Completed | Create permitted follow-up facts | Commercial snapshot is immutable. |
| Cancelled | Retain audit history | Cancellation never deletes the Sale. |
| Refunded | Record corrective financial outcome | Refund cannot exceed recorded refundable amount. |

State transitions require an authorized actor and create an audit record.

---

# Ownership and Contracts

## Sales Owns

- Sale lifecycle and line-item composition
- Commercial totals and discount allocation
- Snapshotting of sell-time facts
- Completion and cancellation eligibility

## Sales Consumes

- Catalog eligibility, pricing, and tax configuration through public contracts
- Customer identity through CRM public contracts
- Payment outcomes through Payments events or public Application Services
- Capability and permission decisions through Platform contracts

## Sales Publishes

- SaleCreated
- SaleUpdated
- SaleCompleted
- SaleCancelled
- RefundRequested

Sales never writes Inventory, Payment, CRM, Reporting, or Operations state directly.

---

# Offline Decisions

An offline client may create a pending Sale command only when its local capability policy permits it.

The server validates every submitted command against current permissions, catalog state, pricing policy, discount policy, and Sale invariants. Local completion indicators are provisional until the server confirms the Sale.

Duplicate synchronization must not create a second Sale or a second payment request.

---

# Architecture Rules

- Business rules for a Sale exist only in the Sale Aggregate and Sales Domain Services.
- A completed Sale is never edited in place.
- Financial corrections create new auditable facts.
- Sales uses only public Application Services or Domain Events to collaborate with other modules.
- PostgreSQL is the authoritative record of Sale state and commercial snapshots.
- Plugins cannot change completion, immutability, or payment-eligibility rules.

---

# Related Documents

- modules/payments.md
- modules/catalog.md
- modules/inventory.md
- product/04-critical-business-workflows.md
- architecture/07-offline-sync.md
