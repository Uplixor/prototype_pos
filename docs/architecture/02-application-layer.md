# 02. Application Layer

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

The Application Layer orchestrates business operations.

It coordinates Aggregates, Repositories, Domain Services, and Infrastructure.

It contains application workflows but **no business rules**.

---

# Responsibilities

The Application Layer is responsible for:

- Executing use cases
- Managing transactions
- Loading aggregates
- Saving aggregates
- Publishing domain events
- Authorization checks
- Calling infrastructure services

It is NOT responsible for:

- Business rules
- HTTP
- Database implementation
- UI logic

---

# Layer Architecture

```

Presentation

↓

Application

↓

Domain

↓

Infrastructure

```

---

# Application Components

## Commands

Represent requests that change state.

Examples

- CreateSale
- CompleteSale
- CreateProduct
- ReceivePurchase
- CreateCustomer
- AssignRole

---

## Queries

Read-only operations.

Examples

- GetSale
- GetProducts
- SearchCustomers
- DailySalesReport
- LowStockProducts

Queries never modify state.

---

## Command Handlers

Each Command has exactly one Handler.

Example

```

CreateSaleCommand

↓

CreateSaleHandler

```

Responsibilities

- Validate permissions
- Load aggregates
- Call aggregate methods
- Save changes
- Publish events

---

## Query Handlers

Responsible for retrieving data.

Example

```

GetDashboardQuery

↓

GetDashboardHandler

```

Query Handlers should use optimized read models.

---

# Application Services

Application Services coordinate multiple use cases.

Examples

- CheckoutApplicationService
- AuthenticationApplicationService
- InventoryImportApplicationService

Rules

- Thin
- Stateless
- No business rules

---

# Transaction Boundary

One command = one transaction.

Example

```

CreateSale

↓

Load Sale Aggregate

↓

Validate

↓

Save

↓

Commit

↓

Publish Events

```

Events are published **after** a successful commit.

---

# Authorization

Authorization belongs here.

Example

```

User

↓

Permission Check

↓

Execute Command

```

Aggregates should not know about users or roles.

---

# Validation

Validation belongs in different layers.

Input Validation

Presentation Layer

Business Validation

Domain Layer

Authorization

Application Layer

---

# Repository Usage

Application Layer depends on interfaces.

Never concrete implementations.

Example

```

ProductRepository

SaleRepository

CustomerRepository

```

Infrastructure provides implementations.

---

# Event Publishing

Application Layer publishes Domain Events to the Event Bus.

```

Sale Aggregate

↓

SaleCompleted

↓

Application Layer

↓

Event Bus

↓

Consumers

```

---

# Error Handling

Application Layer converts domain exceptions into application errors.

Example

```

InsufficientStockException

↓

409 Conflict

```

---

# Folder Structure

```

application/

commands/

queries/

handlers/

services/

dto/

ports/

```

---

# Rules

Application Layer

✔ Coordinates workflows

✔ Starts transactions

✔ Calls repositories

✔ Publishes events

✔ Performs authorization

Application Layer

✘ Contains business rules

✘ Knows SQL

✘ Knows HTTP

✘ Contains UI logic

---

# Related Documents

- domain/02-aggregates.md
- domain/05-domain-events.md
- domain/06-domain-services.md
