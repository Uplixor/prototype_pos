# 05. Domain Events

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the Domain Events of the Commerce Operating Platform.

A Domain Event represents something important that has already happened within the business.

Events allow bounded contexts to communicate without tight coupling.

---

# Objectives

This document defines:

- Event naming
- Event ownership
- Event publishing
- Event consumption
- Event flow
- Event lifecycle

---

# What is a Domain Event?

A Domain Event is a record of something that has happened.

Examples

- Sale Created
- Payment Received
- Product Archived
- Stock Adjusted

Events are facts.

Events never represent requests.

---

# Principles

## Past Tense

Events are always named in the past tense.

Good

- SaleCreated
- PaymentReceived
- StockAdjusted

Bad

- CreateSale
- ReceivePayment
- AdjustStock

---

## Immutable

Events are never modified.

---

## One Business Fact

One event represents one completed business action.

---

## Business Language

Events use ubiquitous language.

Never

RestaurantOrderCreated

Always

SaleCreated

---

# Event Structure

Every event contains:

```json
{
  "eventId": "",
  "eventName": "",
  "occurredAt": "",
  "organizationId": "",
  "branchId": "",
  "aggregateId": "",
  "aggregateType": "",
  "version": 1,
  "payload": {}
}
```

---

# Identity Events

Published By

Identity Context

Events

- OrganizationCreated
- OrganizationUpdated
- OrganizationArchived

- BranchCreated
- BranchArchived

- UserCreated
- UserUpdated
- UserArchived

- RoleAssigned
- RoleRemoved

---

# Catalog Events

Published By

Catalog Context

Events

- ProductCreated
- ProductUpdated
- ProductArchived

- CategoryCreated

- PriceChanged

- VariantAdded

- ModifierAdded

---

# Inventory Events

Published By

Inventory Context

Events

- PurchaseCreated

- PurchaseCompleted

- StockReceived

- StockAdjusted

- StockTransferred

- StockReserved

- StockReleased

- InventoryCountCompleted

---

# Sales Events

Published By

Sales Context

Events

- SaleCreated

- SaleUpdated

- SaleCompleted

- SaleCancelled

- DiscountApplied

- RefundIssued

---

# Payment Events

Published By

Payments Context

Events

- PaymentInitiated

- PaymentReceived

- PaymentFailed

- PaymentRefunded

- SettlementCompleted

---

# CRM Events

Published By

CRM Context

Events

- CustomerCreated

- CustomerUpdated

- LoyaltyEarned

- LoyaltyRedeemed

- CreditLimitUpdated

---

# Fulfillment Events

Published By

Fulfillment Context

Events

- ReservationCreated

- TableAssigned

- KitchenTicketCreated

- KitchenTicketPrepared

- KitchenTicketServed

- DeliveryAssigned

- DeliveryStarted

- DeliveryCompleted

---

# Platform Events

Published By

Platform Context

Events

- CapabilityEnabled

- CapabilityDisabled

- FeatureFlagChanged

- SettingsUpdated

---

# Event Flow Example

Customer buys coffee

```
SaleCreated

↓

PaymentReceived

↓

SaleCompleted

↓

StockReserved

↓

StockAdjusted

↓

LoyaltyEarned

↓

ReportUpdated

↓

NotificationSent
```

Notice

Sales never updates CRM.

CRM reacts to Sales.

---

# Event Ownership

Only the Aggregate Root publishes events.

Example

Sale Aggregate

Publishes

- SaleCreated
- SaleCompleted

SaleItem

Never publishes events.

---

# Event Consumers

One event may have multiple consumers.

Example

SaleCompleted

Consumers

Inventory

CRM

Reporting

Notifications

Plugins

Audit

Future Integrations

---

# Event Versioning

Events are versioned.

```
SaleCompleted v1

SaleCompleted v2
```

Never break existing consumers.

---

# Event Storage

Events are stored for:

- Audit
- Offline Sync
- Reporting
- Replay
- Debugging

---

# Event Ordering

Ordering matters only within the same Aggregate.

Example

SaleCreated

↓

PaymentReceived

↓

SaleCompleted

Global ordering is not required.

---

# Event Naming Convention

Aggregate + Past Tense

Examples

SaleCreated

PaymentReceived

ProductArchived

CustomerCreated

StockAdjusted

---

# Event Categories

Business

- SaleCompleted

Inventory

- StockAdjusted

Platform

- FeatureFlagChanged

Security

- UserLoggedIn

Integration

- PaymentGatewayWebhookReceived

---

# Event Rules

Events

✔ describe the past

✔ are immutable

✔ belong to one Aggregate

✔ belong to one Context

✔ may have multiple consumers

Events

✘ never modify another Aggregate directly

✘ never contain business logic

✘ never trigger database updates directly

---

# Architecture Impact

Domain Events power

- Offline Sync
- Event Bus
- Notifications
- Reporting
- Plugin System
- WebSockets
- Audit Logs
- Future Event Sourcing

---

# Related Documents

- domain/01-bounded-contexts.md
- domain/02-aggregates.md
- domain/03-entities.md
- domain/04._value_objects.md
