# 04. Sales and Payments Guide

> Status: Draft
> Owner: Commerce Core Workstream
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Why This Exists

Sales records the commercial agreement; Payments records the immutable financial facts that settle or correct it. A POS is not viable until both are reliable.

---

# Dependencies and Exclusions

Requires authenticated tenant context, Branch, active Products, units, price definitions, and tax profiles.

Build Sales, Sale Items, Payments, Refunds, document numbers, and receipt output. Do not build provider integrations, loyalty, delivery, or stock movements in this guide.

---

# Database Scope

| Records | Required Rule |
|---|---|
| `sales`, `sale_items` | Completed Sales are immutable and retain product, price, discount, and tax snapshots. |
| `payments` | Payment idempotency is unique per Organization. |
| `refunds` | A refund is a new immutable fact and cannot exceed the Payment's refundable amount. |
| `audit_records`, `domain_events` | Completion, cancellation, payment, and refund outcomes are durable. |

`sale_number` and `receipt_number` are business-facing Organization-unique numbers. UUIDs remain internal identity.

---

# Build Steps

1. Implement Open Sale creation for an authorized Organization and Branch.
2. Add or remove active, Branch-available Products using current sell-time price and tax data.
3. Store item snapshots before a Sale can complete.
4. Validate totals, authorized discounts, and currency at the Sale Aggregate.
5. Implement payment initiation and recording using stable idempotency keys.
6. Complete the Sale only through the permitted commercial and payment policy.
7. Implement cancellation without deleting history.
8. Implement refund as a linked immutable transaction.
9. Publish completed events for Inventory, Reporting, and Operations.
10. Build Sale and receipt views that display durable outcome, not client assumptions.

---

# Invariants

- A Sale, Payment, Refund, Product, Customer, and Branch must share an Organization.
- A completed Sale Item cannot be recalculated from current Catalog data.
- A duplicate payment command returns the original outcome; it does not create another Payment.
- A provider callback cannot record payment without validating the eligible Sale and tenant context.
- A refund never deletes the original Payment or Sale.

---

# Acceptance Checks

- Complete a Sale with frozen item, tax, and price snapshots.
- Reject cross-tenant, inactive Product, duplicate-payment, and over-refund actions.
- Confirm events are emitted only after committed financial facts.
- Confirm failure of Redis or real-time delivery does not corrupt Sale or Payment state.

---

# Related Documents

- ../modules/sales.md
- ../modules/payments.md
- ../data/commerce-platform-mvp.dbml
- ../architecture/07-offline-sync.md
