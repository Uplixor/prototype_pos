# 01. Backend Architecture

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the backend architecture of the Commerce Operating Platform.

The backend is responsible for executing business rules, exposing APIs, managing data, publishing events, and coordinating communication between platform modules.

---

# Design Goals

The backend should be:

- Modular
- Scalable
- Testable
- Maintainable
- Event-driven
- Offline-ready
- Multi-tenant
- Plugin-friendly

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Runtime | Node.js |
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Cache | Redis |
| Queue | BullMQ |
| Storage | S3 / Cloudflare R2 |
| API | REST |
| Documentation | OpenAPI |
| Validation | class-validator + Zod (where appropriate) |

---

# Architecture

The backend follows:

- Domain-Driven Design (DDD)
- Clean Architecture
- CQRS
- Event-Driven Architecture
- Hexagonal Architecture

---

# Layer Structure

```
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

Each layer has a single responsibility.

---

# Module Structure

Each business capability is implemented as an independent module.

```
Identity

Catalog

Inventory

Sales

Payments

CRM

Fulfillment

Reporting

Platform
```

Each module owns:

- Domain
- Application
- Infrastructure
- Presentation

---

# Request Flow

```
Client

↓

Controller

↓

Command / Query

↓

Handler

↓

Aggregate

↓

Repository

↓

Database

↓

Domain Events
```

---

# Module Communication

Modules communicate through:

- Domain Events
- Public Application Services

Modules should never:

- Access another module's database
- Call another module's repository
- Modify another module's aggregates

---

# Persistence

Repositories persist Aggregate Roots.

Infrastructure provides repository implementations.

The Domain never depends on Prisma.

---

# Event Processing

Business actions publish Domain Events.

Examples

- SaleCompleted
- PaymentReceived
- ProductCreated
- StockAdjusted

Events are consumed by interested modules.

---

# Background Jobs

Long-running operations execute asynchronously.

Examples

- Report Generation
- Data Import
- Email Notifications
- Inventory Recalculation
- Backup

---

# Multi-Tenancy

Every request belongs to exactly one Organization.

Every business entity belongs to one Organization.

Cross-tenant access is prohibited.

---

# Offline Support

Offline synchronization is handled through the Sync API.

Commands are queued locally.

Synchronization occurs automatically when connectivity returns.

---

# Security

The backend enforces:

- Authentication
- Authorization
- Input Validation
- Audit Logging
- Rate Limiting

---

# Logging

All requests should include:

- Request ID
- User ID
- Organization ID
- Branch ID

Logs should never contain sensitive information.

---

# Error Handling

Errors should be:

- Consistent
- Machine-readable
- Traceable

Business exceptions should be translated into appropriate HTTP responses.

---

# Testing

The backend should support:

- Unit Tests
- Integration Tests
- End-to-End Tests

Business rules should be testable without a database.

---

# Best Practices

- Keep Controllers thin.
- Keep Application Services small.
- Place business rules in the Domain.
- Publish Domain Events for important business actions.
- Keep modules independent.

---

# Architecture Rules

- One module per bounded context.
- One Aggregate Root per repository.
- Commands change state.
- Queries never change state.
- Infrastructure depends on the Domain, never the opposite.
- No circular module dependencies.

---

# Related Documents

- architecture/01-clean-architecture.md
- architecture/02-application-layer.md
- architecture/03-module-architecture.md
- architecture/04-persistence.md
- architecture/05-api-design.md
- architecture/06-permission-system.md
- architecture/07-offline-sync.md
- architecture/08-plugin-system.md
- architecture/09-project-structure.md