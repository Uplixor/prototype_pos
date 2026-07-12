# 06. Domain Services

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines Domain Services.

A Domain Service contains business logic that does not naturally belong to a single Aggregate.

Domain Services coordinate business rules across multiple Aggregates while preserving aggregate boundaries.

---

# Objectives

This document defines:

- When to create a Domain Service
- What belongs inside a Domain Service
- What does not
- Communication rules
- Service boundaries

---

# Design Principles

## Aggregates First

Always ask:

Can this business rule belong inside one Aggregate?

If yes,

Do NOT create a Domain Service.

---

## Multiple Aggregates

If a business rule requires multiple Aggregates,

Create a Domain Service.

---

## Stateless

Domain Services should contain no mutable state.

---

## Business Only

Domain Services contain business logic.

Never infrastructure.

Never database queries.

Never HTTP logic.

---

# Decision Matrix

| Logic | Location |
|---------|----------|
| Product price validation | Product Aggregate |
| Add Sale Item | Sale Aggregate |
| Complete Sale | Sale Aggregate |
| Reserve Inventory | Inventory Aggregate |
| Calculate Tax | Domain Service |
| Allocate Inventory | Domain Service |
| Loyalty Points | Domain Service |
| Price Calculation | Domain Service |
| Receipt PDF | Application Service |
| Send Email | Infrastructure |

---

# Sales Domain Services

## Pricing Service

Purpose

Calculate prices consistently.

Responsibilities

- Product subtotal
- Discounts
- Taxes
- Grand total

Inputs

- Sale
- Product Prices
- Discounts
- Tax Rules

Outputs

- Money

---

## Discount Service

Purpose

Apply discounts.

Responsibilities

- Percentage
- Fixed Amount
- Coupon
- Promotion

Business Rules

Never allow negative totals.

---

## Tax Service

Purpose

Calculate taxes.

Supports

- VAT
- GST
- Sales Tax

Future

Country-specific tax engines.

---

# Inventory Domain Services

## Inventory Allocation Service

Purpose

Reserve inventory.

Responsibilities

- Reserve stock
- Release stock
- Validate quantity

Coordinates

Sale

↓

Inventory

---

## Reorder Service

Purpose

Detect low inventory.

Produces

LowStockDetected

---

# CRM Domain Services

## Loyalty Service

Purpose

Calculate points.

Responsibilities

- Earn points
- Redeem points
- Expiration

---

## Credit Service

Purpose

Customer credit.

Responsibilities

- Validate limit
- Reserve credit
- Reduce balance

---

# Fulfillment Domain Services

## Kitchen Routing Service

Purpose

Determine kitchen destination.

Example

Food

↓

Kitchen

Coffee

↓

Barista

Cake

↓

Bakery

---

## Delivery Assignment Service

Purpose

Assign deliveries.

Future

May use AI.

---

# Cross Domain Services

## Checkout Service

Purpose

Coordinate checkout.

Flow

Sale

↓

Inventory

↓

Payment

↓

Loyalty

↓

Reporting

This service coordinates.

It owns nothing.

---

## Refund Service

Coordinates

Sale

Payment

Inventory

Customer

---

# Domain Service Rules

Domain Services

✔ Stateless

✔ Business logic

✔ Coordinate Aggregates

✔ Publish Domain Events

Domain Services

✘ Own entities

✘ Store state

✘ Call HTTP

✘ Send Email

✘ Generate PDFs

✘ Access UI

---

# Relationship

```
Controller

↓

Application Service

↓

Aggregate

↓

Domain Service

↓

Domain Event

↓

Repository
```

---

# Anti Patterns

Bad

```
SaleService

2500 lines
```

Bad

```
Utils.ts
```

Bad

```
HelperService
```

Bad

```
CommonService
```

Every service must have one business purpose.

---

# Naming Convention

Good

PricingService

TaxService

LoyaltyService

InventoryAllocationService

CheckoutService

Bad

Utils

Manager

Processor

Handler

CommonService

---

# Architecture Impact

Domain Services reduce:

- Duplicate logic
- Fat controllers
- Fat entities

while maintaining rich business models.

---

# Related Documents

- domain/02-aggregates.md
- domain/03-entities.md
- domain/04._value_objects.md
- domain/05-domain-events.md
