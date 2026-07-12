# 01. Clean Architecture

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the overall software architecture of the Commerce Operating Platform.

The platform adopts **Clean Architecture**, **Domain-Driven Design (DDD)**, **CQRS**, and **Event-Driven Architecture (EDA)** to build a scalable, maintainable, and extensible system.

This document is the highest-level technical architecture reference for the project.

---

# Objectives

The architecture must support:

- Multi-tenancy
- Offline-first operation
- Capability-based modules
- Plugin system
- Mobile-first clients
- Event-driven workflows
- Global deployment
- Long-term maintainability

---

# Architecture Principles

## Business First

Business rules are the center of the application.

Frameworks, databases, APIs, and UI are implementation details.

---

## Dependency Rule

Dependencies always point inward.

```

Presentation
↓

Application
↓

Domain
↓

Infrastructure

```

The Domain Layer depends on nothing.

---

## Framework Independence

Business logic must not depend on:

- NestJS
- PostgreSQL
- Redis
- Stripe
- Cloudflare

Replacing infrastructure should not require changes to business rules.

---

## Testability

Business logic should be executable without:

- Database
- HTTP
- Cache
- Queue
- Browser

---

## Replaceable Infrastructure

Infrastructure components should be replaceable.

Examples

PostgreSQL → MySQL

Redis → KeyDB

S3 → Cloudflare R2

without modifying domain logic.

---

# Architectural Style

The platform combines four architectural patterns.

## 1. Clean Architecture

Defines layer boundaries.

---

## 2. Domain-Driven Design

Defines business boundaries.

---

## 3. CQRS

Separates write operations from read operations.

---

## 4. Event-Driven Architecture

Allows contexts to communicate through Domain Events.

---

# System Layers

```

┌────────────────────────────┐
│       Presentation         │
├────────────────────────────┤
│       Application          │
├────────────────────────────┤
│          Domain            │
├────────────────────────────┤
│      Infrastructure        │
└────────────────────────────┘

```

---

# Presentation Layer

Purpose

Interact with clients.

Contains

- REST Controllers
- WebSocket Gateways
- Authentication Middleware
- Request Validation
- DTO Mapping

Responsibilities

- Receive requests
- Validate input
- Authenticate users
- Return responses

Must NOT contain

- Business rules
- SQL
- Domain logic

---

# Application Layer

Purpose

Execute use cases.

Contains

- Commands
- Queries
- Handlers
- Application Services
- Ports

Responsibilities

- Coordinate workflows
- Start transactions
- Authorization
- Publish events

Must NOT contain

- HTTP
- SQL
- Business rules

---

# Domain Layer

Purpose

Represent the business.

Contains

- Aggregates
- Entities
- Value Objects
- Domain Services
- Domain Events
- Repository Interfaces

Responsibilities

- Business rules
- Validation
- Invariants

Must NOT contain

- NestJS
- Prisma
- TypeORM
- SQL
- HTTP

---

# Infrastructure Layer

Purpose

Implement external concerns.

Contains

- PostgreSQL
- Redis
- File Storage
- Email
- Payment Gateways
- Queue
- Cache
- Repository Implementations

Responsibilities

- Persistence
- Integrations
- External APIs

---

# Dependency Flow

```

Presentation
↓

Application
↓

Domain

Presentation
↓

Infrastructure

Application
↓

Infrastructure

Infrastructure
↓

Database

```

The Domain Layer has no outward dependencies.

---

# Request Lifecycle

```

HTTP Request

↓

Controller

↓

Command

↓

Command Handler

↓

Aggregate

↓

Repository

↓

Commit

↓

Publish Domain Events

↓

Response

```

---

# Query Lifecycle

```

HTTP Request

↓

Controller

↓

Query

↓

Query Handler

↓

Read Model

↓

Response

```

Queries never modify state.

---

# Event Lifecycle

```

Aggregate

↓

Domain Event

↓

Event Bus

↓

Subscribers

↓

Other Contexts

```

---

# Bounded Contexts

The platform consists of:

- Identity
- Catalog
- Inventory
- Sales
- Payments
- CRM
- Fulfillment
- Reporting
- Platform

Each context owns:

- Entities
- Aggregates
- Business Rules
- Events
- APIs

---

# Module Structure

Each bounded context becomes one NestJS module.

```
src/

identity/

catalog/

inventory/

sales/

payments/

crm/

fulfillment/

reporting/

platform/
```

---

# Dependency Rules

Allowed

Presentation

↓

Application

↓

Domain

↓

Infrastructure

Not Allowed

Presentation → Database

Controller → Repository

Controller → Aggregate

Aggregate → Controller

Aggregate → Database

Repository → Controller

---

# Communication

Within a Context

- Aggregate Methods
- Domain Services

Across Contexts

- Domain Events
- Application Services

Never

- Direct database access
- Shared entities

---

# Cross-Cutting Concerns

Handled separately.

Includes

- Logging
- Metrics
- Tracing
- Caching
- Security
- Rate Limiting
- Monitoring

---

# Multi-Tenancy

Every business belongs to an Organization.

Every business entity belongs to exactly one Organization.

No cross-tenant data access.

---

# Offline Support

Offline support is part of the architecture.

The platform must:

- Continue operating offline
- Queue commands
- Synchronize later
- Resolve conflicts

---

# Plugin Support

Capabilities extend the platform.

Plugins never modify Core Domains directly.

Plugins communicate through:

- Events
- Public APIs
- Extension Points

---

# Technology Independence

The architecture should support replacing:

- Database
- Cache
- Payment Provider
- Cloud Provider
- Authentication Provider

without changing Domain code.

---

# Architecture Rules

- Business rules belong in the Domain.
- Commands modify state.
- Queries never modify state.
- Controllers remain thin.
- Repositories persist Aggregates.
- Domain Events communicate between contexts.
- Infrastructure implements interfaces.
- No circular dependencies.
- One bounded context owns each business concept.

---

# Quality Attributes

The architecture prioritizes:

- Maintainability
- Scalability
- Extensibility
- Testability
- Performance
- Reliability
- Modularity
- Developer Experience

---

# Related Documents

- domain/01-bounded-contexts.md
- domain/02-aggregates.md
- domain/03-entities.md
- domain/04._value_objects.md
- domain/05-domain-events.md
- architecture/02-application-layer.md
