# Inventory Module

> Status: Draft
> Owner: Inventory Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

Inventory owns the append-only record of stock accountability for Products at Organization operating locations.

---

# Decisions

## Inventory Is Append-Only

Stock is never changed by editing a balance. Every change creates an immutable Stock Movement with quantity, unit, reason, source reference, destination when applicable, actor, and time.

Available stock is a derived projection of movements and policy, not the primary record of truth.

## Purchases Do Not Increase Stock Until Receipt

Creating or approving a Purchase records procurement intent. Only a confirmed goods receipt creates an inbound Stock Movement.

This prevents expected inventory from being sold, counted, or reported as physically available.

## Sales Consume Stock Only After Commercial Completion

Draft and awaiting-payment Sales do not create ordinary stock consumption. Completed Sales produce an authorized inventory contract or event for stock movement.

Reservation is a separate explicit capability; it is never inferred merely because an item is in a cart.

## Stock Belongs to a Location

Stock is scoped to one Organization and Branch or approved storage location. Transfers create paired, traceable movements rather than moving a balance between records.

---

# Movement Rules

| Movement | Required Source | Result |
|---|---|---|
| Receipt | Confirmed Purchase | Increases location stock. |
| Sale consumption | Completed Sale | Decreases stock under availability policy. |
| Adjustment | Authorized reason | Creates accountable correction. |
| Transfer | Authorized origin and destination | Preserves traceable custody. |
| Count reconciliation | Approved stock count | Records variance, never overwrites history. |
| Return | Authorized business reference | Creates a new inbound or outbound movement. |

Negative stock is allowed only when the Organization's explicit availability policy permits it.

---

# Ownership and Contracts

Inventory owns Stock Movement, stock policy, availability projection rules, and optional batch allocation rules.

Catalog owns Product identity. Sales owns commercial completion. Purchasing owns purchase lifecycle. No collaborating module writes inventory state directly.

Inventory publishes StockReceived, StockAdjusted, StockTransferred, StockCounted, StockReserved, and StockReleased after durable movement decisions.

---

# Batch and Expiry Decisions

Batch tracking is optional and capability-controlled. When enabled, a receipt must identify the received batch before it becomes available.

Expiry dates affect allocation and operational warnings; they never silently delete stock or rewrite movement history.

---

# Offline Decisions

Offline stock adjustments and counts are provisional. The server validates current authority, location scope, expected version, and availability policy before recording a movement.

Conflicting counts retain both the submitted count and the reconciliation outcome for audit.

---

# Architecture Rules

- Only Inventory Aggregates and Domain Services create Stock Movements.
- A stock balance is never the only inventory record.
- PostgreSQL is authoritative for movements and reconciliation.
- Cache and reports may show stale availability and cannot approve stock decisions.
- Plugins cannot alter append-only movement history or bypass receipt rules.

---

# Related Documents

- modules/catalog.md
- modules/sales.md
- product/04-critical-business-workflows.md
- architecture/07-offline-sync.md
