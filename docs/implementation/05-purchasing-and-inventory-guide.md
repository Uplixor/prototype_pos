# 05. Purchasing and Inventory Guide

> Status: Draft
> Owner: Stock and Experience Workstream
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Why This Exists

Businesses need accountable stock, not a manually edited current-stock number. Purchasing records intent; goods receipt records physical arrival; Stock Movements record every change.

---

# Dependencies and Exclusions

Requires Organization, Branch, permissions, Products, Units, and completed Sales.

Build Suppliers, Purchases, Goods Receipts, Inventory Locations, Stock Movements, Counts, and Transfers. Do not build batches, expiry, recipes, manufacturing, or advanced costing yet.

---

# Database Scope

| Records | Required Rule |
|---|---|
| `suppliers`, `purchases`, `purchase_items` | A Purchase expresses intent and never increases stock. |
| `goods_receipts`, `goods_receipt_items` | Confirmed receipt is the source of inbound stock. |
| `inventory_locations` | A location belongs to one Organization and Branch. |
| `stock_movements` | Append-only; each movement has one accountable cause. |
| `stock_counts`, `stock_count_items` | Count approval creates reconciliation movements; never overwrites history. |
| `stock_transfers` | Origin and destination differ but belong to one Organization. |

---

# Build Steps

1. Implement Supplier lifecycle and authorized purchasing records.
2. Implement Purchase items against tenant-owned Products and Units.
3. Implement partial and complete Goods Receipt.
4. Create one inbound Stock Movement for each confirmed received quantity.
5. Consume stock from a completed Sale through a public event or Application Service.
6. Implement authorized adjustments requiring a reason.
7. Implement stock counts and reconciliation movements.
8. Implement transfers as traceable outbound and inbound movements.
9. Build availability views as projections of Stock Movements.

---

# Invariants

- No code path edits a stock balance as the accounting record.
- Purchase creation, draft Sale creation, and client cart updates do not move stock.
- Stock Movement is immutable after recording.
- Cross-Organization and cross-Branch location references are rejected.
- Negative stock requires explicit Organization policy; it is never accidental.

---

# Acceptance Checks

- Receiving a Purchase creates inbound movements; creating it does not.
- Completing a Sale creates permitted stock consumption exactly once.
- A duplicate event or job does not duplicate a Stock Movement.
- A stock count creates a traceable correction rather than changing history.

---

# Related Documents

- ../modules/inventory.md
- ../data/commerce-platform-mvp.dbml
- ../modules/sales.md
- ../backend/09-background-jobs-architecture.md
