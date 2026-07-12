# 01. Bounded Contexts

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the bounded contexts of the Commerce Operating Platform.

A bounded context is a business boundary that owns its own language, business rules, data, events, and APIs.

Every backend module, API, database schema, and event belongs to exactly one bounded context.

---

# Objectives

This document defines:

- Business boundaries
- Context ownership
- Context responsibilities
- Context dependencies
- Communication rules
- Module boundaries

---

# Design Principles

## Business First

Contexts are organized around business capabilities, not UI pages or database tables.

---

## High Cohesion

Each context owns closely related business concepts.

---

## Loose Coupling

Contexts communicate through APIs and Domain Events.

They never directly modify another context's internal state.

---

## Single Ownership

Every entity belongs to exactly one bounded context.

Ownership is never shared.

---

# Context Overview

| Context | Purpose |
|----------|----------|
| Identity | Organizations, users, authentication, permissions |
| Catalog | Products and pricing |
| Inventory | Stock management |
| Sales | Commercial transactions |
| Payments | Money movement |
| CRM | Customers and loyalty |
| Operations | Business workflows |
| Reporting | Analytics and dashboards |
| Platform | Platform configuration |

---

# Identity Context

## Purpose

Manage access to the platform.

## Owns

- Organization
- Branch
- User
- Role
- Permission
- Session

## Responsibilities

- Authentication
- Authorization
- User management
- Branch management
- Organization management

## Public Services

- Authenticate User
- Create User
- Assign Role
- Validate Permission

## Publishes Events

- OrganizationCreated
- BranchCreated
- UserCreated
- UserArchived
- RoleAssigned

---

# Catalog Context

## Purpose

Manage everything that can be sold.

## Owns

- Product
- Category
- Variant
- Modifier
- Price
- Tax
- Unit

## Responsibilities

- Product lifecycle
- Pricing
- Product availability
- Product classification

## Publishes Events

- ProductCreated
- ProductUpdated
- ProductArchived
- PriceChanged

---

# Inventory Context

## Purpose

Manage stock.

## Owns

- Inventory
- Stock
- Purchase
- Supplier
- Transfer
- Adjustment
- Warehouse

## Responsibilities

- Receive inventory
- Reserve inventory
- Adjust inventory
- Transfer inventory
- Count inventory

## Publishes Events

- StockReceived
- StockAdjusted
- StockTransferred
- StockReserved

---

# Sales Context

## Purpose

Manage commercial transactions.

## Owns

- Sale
- Sale Item
- Discount
- Invoice
- Refund

## Responsibilities

- Create sales
- Complete sales
- Cancel sales
- Generate invoices
- Apply discounts

## Publishes Events

- SaleCreated
- SaleCompleted
- SaleCancelled
- RefundIssued

---

# Payments Context

## Purpose

Manage money.

## Owns

- Payment
- Payment Method
- Transaction
- Settlement

## Responsibilities

- Accept payment
- Split payment
- Refund payment
- Settlement

## Publishes Events

- PaymentReceived
- PaymentFailed
- PaymentRefunded

---

# CRM Context

## Purpose

Manage customer relationships.

## Owns

- Customer
- Loyalty
- Membership
- Customer Group
- Credit Account

## Responsibilities

- Customer management
- Loyalty
- Membership
- Customer credit

## Publishes Events

- CustomerCreated
- LoyaltyEarned
- LoyaltyRedeemed

---

# Operations Context

## Purpose

Business-specific operational workflows.

## Owns

- Table
- Reservation
- Kitchen Ticket
- Delivery
- Queue

## Responsibilities

- Restaurant workflow
- Kitchen workflow
- Delivery workflow
- Reservation workflow

## Publishes Events

- TableAssigned
- KitchenTicketCreated
- OrderReady
- DeliveryAssigned

---

# Reporting Context

## Purpose

Provide analytics.

## Owns

- Dashboard
- KPI
- Report

Reporting owns no transactional business data.

It consumes events from other contexts.

## Responsibilities

- Dashboard generation
- Analytics
- Business reports

---

# Platform Context

## Purpose

Platform-wide configuration.

## Owns

- Capability
- Feature Flag
- Settings
- Localization
- Audit Log

## Responsibilities

- Feature management
- Localization
- Configuration
- Audit

---

# Context Dependencies

```text
                Platform

                    │

                    ▼

                Identity

                    │

                    ▼

                 Catalog

               ↙          ↘

        Inventory         CRM

               ↘          ↙

                 Sales

          ┌────────┴────────┐

          ▼                 ▼

     Payments         Operations

          └────────┬────────┘

                   ▼

               Reporting
```

---

# Communication Rules

## Allowed

- Domain Events
- Public Application Services
- Read APIs
- Asynchronous messaging

## Not Allowed

- Shared database tables
- Direct repository access
- Circular dependencies
- Cross-context business logic

---

# Ownership Rules

Each business concept has one owner.

| Business Concept | Context |
|------------------|---------|
| Organization | Identity |
| Branch | Identity |
| User | Identity |
| Product | Catalog |
| Category | Catalog |
| Sale | Sales |
| Invoice | Sales |
| Payment | Payments |
| Inventory | Inventory |
| Customer | CRM |
| Table | Operations |
| Report | Reporting |
| Feature Flag | Platform |

---

# Future Contexts

Potential future bounded contexts include:

- Manufacturing
- Purchasing
- Accounting
- Human Resources
- Marketing
- Ecommerce
- Subscription Billing

---

# Architecture Decisions

- One NestJS module per bounded context.
- Every aggregate belongs to one bounded context.
- Contexts communicate using Domain Events and application services.
- Reporting is read-only and event-driven.
- Contexts must remain independently evolvable.

---

# Related Documents

- research/02-business-capability-research.md
- research/03-domain-research.md
- product/01-ubiquitous-language.md
- domain/02-aggregates.md
