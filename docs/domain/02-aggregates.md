# 02. Aggregates

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the Aggregate Roots of the platform.

Aggregates are consistency boundaries.

Business rules must be enforced inside an Aggregate.

External contexts may only interact with the Aggregate Root.

---

# Objectives

This document defines:

- Aggregate Roots
- Child Entities
- Invariants
- Transaction Boundaries
- Domain Events

---

# Aggregate Principles

## One Aggregate Root

Every aggregate has exactly one public entry point.

Example

Sale

↓

Sale Item

↓

Discount

↓

Tax

External modules never update Sale Item directly.

---

## Protect Business Rules

Business rules live inside the Aggregate.

Never inside controllers.

Never inside repositories.

---

## Small Transactions

Transactions should not cross aggregate boundaries.

Communication between aggregates happens through Domain Events.

---

# Organization Aggregate

## Aggregate Root

Organization

## Child Entities

- Branch
- Organization Settings

## Invariants

- Organization name must be unique.
- Organization cannot be deleted if active branches exist.

## Domain Events

- OrganizationCreated
- OrganizationUpdated
- OrganizationArchived

---

# User Aggregate

## Aggregate Root

User

## Child Entities

- User Roles
- User Sessions

## Invariants

- Email must be unique.
- User belongs to one Organization.
- Archived users cannot authenticate.

## Domain Events

- UserCreated
- UserArchived
- UserRoleAssigned

---

# Product Aggregate

## Aggregate Root

Product

## Child Entities

- Variant
- Modifier
- Price
- Tax Mapping

## Invariants

- Product belongs to one Organization.
- Archived products cannot be sold.
- Every Product has one base price.

## Domain Events

- ProductCreated
- ProductUpdated
- ProductArchived
- ProductPriceChanged

---

# Customer Aggregate

## Aggregate Root

Customer

## Child Entities

- Address
- Loyalty Account
- Credit Account

## Invariants

- Customer belongs to one Organization.
- Loyalty points cannot become negative.

## Domain Events

- CustomerCreated
- LoyaltyEarned
- LoyaltyRedeemed

---

# Supplier Aggregate

## Aggregate Root

Supplier

## Child Entities

- Contact
- Address

## Invariants

- Supplier belongs to one Organization.

## Domain Events

- SupplierCreated
- SupplierArchived

---

# Purchase Aggregate

## Aggregate Root

Purchase

## Child Entities

- Purchase Item

## Invariants

- Completed purchases cannot be edited.
- Purchase must have at least one item.

## Domain Events

- PurchaseCreated
- PurchaseCompleted

---

# Inventory Aggregate

## Aggregate Root

Inventory

## Child Entities

- Stock Movement
- Reservation

## Invariants

- Quantity cannot violate configured inventory policy.
- Every adjustment has a reason.
- Every movement is auditable.

## Domain Events

- StockReceived
- StockAdjusted
- StockTransferred
- StockReserved

---

# Sale Aggregate

## Aggregate Root

Sale

## Child Entities

- Sale Item
- Discount
- Tax Summary

## External References

- Customer
- Branch

## Invariants

- Sale must contain at least one item.
- Completed Sale cannot be modified.
- Cancelled Sale cannot receive payment.

## Domain Events

- SaleCreated
- SaleCompleted
- SaleCancelled

---

# Payment Aggregate

## Aggregate Root

Payment

## Child Entities

- Allocation
- Refund

## External References

- Sale

## Invariants

- Payment amount must be greater than zero.
- Refund cannot exceed paid amount.
- Payment belongs to exactly one Organization.

## Domain Events

- PaymentReceived
- PaymentRefunded
- PaymentFailed

---

# Reservation Aggregate

## Aggregate Root

Reservation

## Child Entities

None

## Invariants

- Reservation belongs to one resource.
- Reservation times cannot overlap.

## Domain Events

- ReservationCreated
- ReservationCancelled

---

# Kitchen Ticket Aggregate

## Aggregate Root

Kitchen Ticket

## Child Entities

- Kitchen Item

## Invariants

- Completed tickets cannot be reopened.
- Every ticket belongs to one Sale.

## Domain Events

- KitchenTicketCreated
- KitchenTicketPrepared
- KitchenTicketServed

---

# Delivery Aggregate

## Aggregate Root

Delivery

## Child Entities

- Delivery Assignment

## Invariants

- Delivery belongs to one Sale.
- Completed deliveries cannot be reassigned.

## Domain Events

- DeliveryAssigned
- DeliveryStarted
- DeliveryCompleted

---

# Aggregate Relationships

Organization

├── User

├── Product

├── Customer

├── Supplier

├── Purchase

├── Inventory

├── Sale

├── Payment

├── Reservation

└── Delivery

Aggregates reference each other by ID.

Never by object reference.

---

# Aggregate Communication

Allowed

Sale

↓

PaymentReceived

↓

Reporting

Allowed

PurchaseCompleted

↓

Inventory

Allowed

SaleCompleted

↓

Inventory

↓

Reporting

Not Allowed

Sale directly modifies Inventory database tables.

Sale directly modifies Customer tables.

Sale directly modifies Product tables.

Communication happens through events.

---

# Architecture Rules

- One repository per Aggregate Root.
- Controllers never modify child entities directly.
- Domain Events are published by Aggregate Roots.
- Validation belongs inside the Aggregate.
- Aggregate Roots own transactional consistency.

---

# Related Documents

- domain/01-bounded-contexts.md
- product/01-ubiquitous-language.md