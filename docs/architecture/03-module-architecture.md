# 03. Module Architecture

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the module architecture of the Commerce Operating Platform.

The platform is organized using:

- Domain-Driven Design (DDD)
- Clean Architecture
- CQRS
- Event-Driven Architecture
- Ports & Adapters (Hexagonal Architecture)

Every bounded context becomes an independent application module.

---

# Objectives

The architecture must:

- Support independent development
- Minimize coupling
- Maximize cohesion
- Allow future plugins
- Support offline synchronization
- Scale to additional business capabilities

---

# Architecture Overview

```

Application

├── Identity

├── Catalog

├── Inventory

├── Sales

├── Payments

├── CRM

├── Fulfillment

├── Reporting

└── Platform

```

Each module owns:

- Business Rules
- Aggregates
- Entities
- Events
- Repositories
- APIs

---

# Module Principles

## One Module = One Bounded Context

Never create modules like:

```
Users

Products

Orders

```

Instead

```
Identity

Catalog

Sales

Inventory

```

---

## Modules Own Their Data

Example

Catalog owns

- Product
- Category
- Variant
- Price

Sales cannot modify Product.

---

## Modules Communicate Through

- Commands
- Queries
- Domain Events
- Public Application Services

Never through shared database tables.

---

# Standard Module Structure

```
catalog/

├── application/
│
│   ├── commands/
│   ├── queries/
│   ├── handlers/
│   ├── dto/
│   ├── mappers/
│   └── services/
│
├── domain/
│
│   ├── aggregates/
│   ├── entities/
│   ├── value-objects/
│   ├── events/
│   ├── repositories/
│   ├── services/
│   ├── specifications/
│   └── exceptions/
│
├── infrastructure/
│
│   ├── persistence/
│   ├── repositories/
│   ├── adapters/
│   └── subscribers/
│
├── presentation/
│
│   ├── rest/
│   ├── websocket/
│   └── graphql/
│
└── catalog.module.ts
```

---

# Identity Module

Owns

- Organization
- Branch
- User
- Role
- Permission
- Session

Publishes

- UserCreated
- OrganizationCreated

Consumes

- None

---

# Catalog Module

Owns

- Product
- Category
- Variant
- Modifier
- Price

Publishes

- ProductCreated
- PriceChanged

Consumes

- CapabilityEnabled

---

# Inventory Module

Owns

- Stock Item
- Purchase
- Supplier
- Stock Movement

Publishes

- StockAdjusted
- PurchaseCompleted

Consumes

- SaleCompleted

---

# Sales Module

Owns

- Sale
- Sale Item
- Invoice
- Discount
- Refund

Publishes

- SaleCreated
- SaleCompleted

Consumes

- PaymentReceived

---

# Payments Module

Owns

- Payment
- Settlement
- Transaction

Publishes

- PaymentReceived
- PaymentRefunded

Consumes

- SaleCreated

---

# CRM Module

Owns

- Customer
- Loyalty
- Membership

Publishes

- CustomerCreated
- LoyaltyEarned

Consumes

- SaleCompleted

---

# Fulfillment Module

Owns

- Table
- Reservation
- Kitchen Ticket
- Delivery

Publishes

- KitchenTicketCreated
- DeliveryAssigned

Consumes

- SaleCreated

---

# Reporting Module

Owns

- Dashboards
- Read Models
- Reports

Publishes

None

Consumes

Almost every business event.

---

# Platform Module

Owns

- Feature Flags
- Capabilities
- Settings
- Audit Logs

Publishes

- CapabilityEnabled
- SettingUpdated

Consumes

System events.

---

# Shared Kernel

Avoid whenever possible.

Allowed

- Base Entity
- Domain Event Interface
- Result Type
- Value Object Base
- UUID
- Clock
- Domain Exception

Not Allowed

- Product
- Customer
- Sale
- Inventory

---

# Ports

Ports define interfaces.

Examples

```
ProductRepository

EmailService

PaymentGateway

FileStorage

Cache

SearchEngine
```

Ports belong inside the Domain.

---

# Adapters

Adapters implement Ports.

Examples

```
PostgresProductRepository

StripePaymentGateway

S3FileStorage

RedisCache

ElasticSearchEngine
```

Adapters belong inside Infrastructure.

---

# Dependency Rules

Allowed

```
Presentation

↓

Application

↓

Domain

↓

Port

↓

Adapter
```

Forbidden

```
Controller

↓

TypeORM Entity
```

---

# Event Flow

```
Sale Aggregate

↓

SaleCompleted

↓

Event Bus

↓

Inventory

↓

CRM

↓

Reporting

↓

Plugins
```

---

# Module Independence

Every module should be:

- Independently testable
- Independently deployable (future)
- Independently maintainable

---

# Plugin Support

Plugins may:

- Subscribe to Events
- Register Commands
- Register Queries
- Register UI Extensions

Plugins may not:

- Modify Core Aggregates
- Access another module's database
- Bypass business rules

---

# Architecture Rules

- One bounded context per module.
- One Aggregate Root per repository.
- No direct database access across modules.
- Modules communicate through events or application services.
- Infrastructure depends on Domain, never the opposite.
- Shared Kernel remains minimal.

---

# Future Expansion

Future modules may include:

- Manufacturing
- Accounting
- Human Resources
- Marketing
- Ecommerce
- Subscription Billing
- AI Assistant

without modifying existing modules.

---

# Related Documents

- architecture/01-clean-architecture.md
- architecture/02-application-layer.md
- domain/01-bounded-contexts.md
- domain/02-aggregates.md
- domain/05-domain-events.md