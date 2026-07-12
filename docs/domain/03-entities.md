# 03. Entities

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the core business entities of the Commerce Operating Platform.

An Entity has identity, lifecycle, and business rules.

Entities belong to exactly one Aggregate and one Bounded Context.

---

# Entity Principles

## Identity

Every entity has a unique identifier.

```text
Product
Product #123

Sale
Sale #10001

Customer
Customer #845
```

Identity never changes.

---

## Lifecycle

Entities evolve.

```
Created

↓

Active

↓

Archived
```

Entities should rarely be physically deleted.

---

## Ownership

Every entity belongs to one Aggregate Root.

Example

```
Sale
 ├── Sale Item
 ├── Discount
 └── Tax Summary
```

Sale owns all child entities.

---

# Identity Context

## Organization

Purpose

Represents one tenant.

Attributes

- id
- code
- name
- status
- timezone
- currency
- createdAt

---

## Branch

Attributes

- id
- organizationId
- name
- code
- address
- phone

---

## User

Attributes

- id
- organizationId
- name
- email
- phone
- status

---

## Role

Attributes

- id
- name
- description

---

# Catalog Context

## Product

Attributes

- id
- sku
- barcode
- name
- description
- productType
- status

Relationships

- Category
- Unit
- Tax
- Price

---

## Category

Attributes

- id
- name
- parentId

---

## Variant

Attributes

- id
- productId
- name

Examples

Coffee

Small

Medium

Large

---

## Modifier

Examples

Extra Cheese

No Sugar

Extra Ice

---

## Price

Attributes

- id
- productId
- amount
- currency
- effectiveFrom

---

# CRM Context

## Customer

Attributes

- id
- code
- name
- phone
- email

---

## Loyalty Account

Attributes

- customerId
- points

---

# Inventory Context

## Stock Item

Represents inventory for one Product in one Branch.

Attributes

- id
- productId
- branchId
- quantityOnHand
- quantityReserved
- reorderLevel

---

## Stock Movement

Attributes

- id
- stockItemId
- type
- quantity
- referenceId
- occurredAt

Types

- Purchase
- Sale
- Adjustment
- Transfer
- Waste

---

## Purchase

Attributes

- supplierId
- purchaseNumber
- status

---

## Purchase Item

Attributes

- purchaseId
- productId
- quantity
- cost

---

## Supplier

Attributes

- id
- code
- name
- phone

---

# Sales Context

## Sale

Attributes

- id
- saleNumber
- branchId
- customerId
- status
- subtotal
- discount
- tax
- total

---

## Sale Item

Attributes

- saleId
- productId
- quantity
- unitPrice
- discount

---

## Discount

Attributes

- type
- value
- reason

---

## Refund

Attributes

- paymentId
- amount
- reason

---

# Payments Context

## Payment

Attributes

- saleId
- method
- amount
- status

---

## Payment Method

Examples

Cash

Card

eSewa

Khalti

Stripe

PayPal

---

# Operations Context

## Table

Attributes

- id
- branchId
- name
- capacity

---

## Reservation

Attributes

- customerId
- tableId
- startTime
- endTime

---

## Kitchen Ticket

Attributes

- saleId
- status
- priority

---

## Delivery

Attributes

- saleId
- address
- driver
- status

---

# Reporting Context

Reporting contains read models only.

Examples

Daily Sales

Top Products

Revenue

Inventory Value

---

# Platform Context

## Capability

Examples

Kitchen

Reservations

Delivery

Barcode

---

## Feature Flag

Attributes

- key
- enabled

---

## Setting

Examples

Currency

Receipt Template

Business Hours

Timezone

---

# Entity Naming Rules

Entity

Singular

```
Product
Sale
Customer
```

Database

Plural

```
products

sales

customers
```

Repository

Singular

```
ProductRepository

SaleRepository
```

API

Plural

```
GET /products

GET /sales
```

---

# Entity Relationships

```
Organization
│
├── Branch
│
├── User
│
├── Product
│
├── Customer
│
├── Supplier
│
├── Purchase
│
├── Stock Item
│
├── Sale
│
├── Payment
│
└── Capability
```

---

# Design Rules

- Entities contain business identity.
- Business rules belong in Aggregates.
- Entities reference other Aggregates by ID.
- No circular ownership.
- No duplicate business concepts.

---

# Related Documents

- domain/01-bounded-contexts.md
- domain/02-aggregates.md
- product/01-ubiquitous-language.md