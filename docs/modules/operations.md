# Operations Module

> Status: Draft
> Owner: Operations Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

Operations owns optional Branch workflows that prepare, route, and fulfill commerce work without changing Sales or Payments facts.

---

# Decisions

## Operational State Is Not Financial State

Kitchen progress, table occupancy, reservation attendance, delivery status, and staff attendance describe operational work. They never alter a Sale total, Payment record, or stock movement directly.

Financial or inventory consequences require the owning module's public Application Service.

## Branches Own Operational Resources

Tables, kitchen stations, delivery areas, printers, and attendance policies are Branch-scoped. They cannot be shared or scheduled across Organizations.

## Operations Starts From Explicit Business Facts

Kitchen and fulfillment work begins only from a Sale state explicitly permitted by the configured workflow. A screen action or real-time message does not create operational work by itself.

## Cancellation Preserves Work History

Cancelled reservations, tickets, and deliveries remain auditable. The system records who cancelled the work, why, and which dependent Sale fact caused the change.

---

# Capability Rules

| Capability | Core Decision |
|---|---|
| Tables | A table is a Branch resource; merging does not merge historical Sales. |
| Reservations | Reservation holds a time-bound operational slot, not a payment or stock guarantee. |
| Kitchen Tickets | A ticket represents production work and cannot edit Sale item prices or quantities. |
| Delivery | Delivery tracks custody and fulfillment progress, not payment settlement. |
| Attendance | Attendance records operational time; Identity remains the user authority. |

---

# Ownership and Contracts

Operations owns operational lifecycles and work-assignment policy.

It consumes authorized Sale, Customer, Catalog, and Branch facts through public contracts. It publishes ReservationConfirmed, TicketCreated, TicketCompleted, FulfillmentStarted, DeliveryCompleted, and related operational facts.

Sales retains ownership of commercial completion. Payments retains payment outcomes. Inventory retains stock movement.

---

# Offline and Real-Time Decisions

Real-time delivery informs connected staff of changed operational work. Offline synchronization remains the recovery path for missed updates.

An offline user may claim or update operational work only where the capability defines a conflict policy. The server resolves concurrent assignment and terminal-state conflicts.

---

# Architecture Rules

- Operations cannot write Sales, Payments, Catalog, or Inventory internals.
- Operational resources and events are Organization and Branch-scoped.
- Workflow rules belong to Operations Aggregates and Domain Services.
- Plugins extend an approved operational capability; they do not alter core financial outcomes.
- PostgreSQL is authoritative for operational work state.

---

# Related Documents

- modules/sales.md
- product/02-capability-catalog.md
- backend/10-real-time-architecture.md
- architecture/07-offline-sync.md
