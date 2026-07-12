# 04. Persistence Architecture

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the persistence architecture of the Commerce Operating Platform.

Persistence is responsible for storing and retrieving business data while preserving Domain integrity.

The Domain must never depend on a specific database or ORM.

---

# Objectives

The persistence layer must support:

- Multi-tenancy
- Offline synchronization
- CQRS
- Event-driven architecture
- Soft deletes
- Auditing
- Optimistic locking
- High performance
- Future database replacement

---

# Design Principles

## Persistence Ignorance

The Domain does not know:

- PostgreSQL
- Prisma
- TypeORM
- SQL

Persistence is an implementation detail.

---

## Aggregate Persistence

Repositories persist Aggregate Roots only.

Example

```
SaleRepository

saves

Sale
 ├── SaleItem
 ├── Discount
 └── TaxSummary
```

Not

```
SaleItemRepository
```

---

## Repository Pattern

Repositories abstract persistence.

Example

```
ProductRepository

SaleRepository

CustomerRepository

PurchaseRepository

PaymentRepository
```

Infrastructure provides implementations.

---

## Unit of Work

Each Command executes inside one transaction.

```
Command

↓

Load Aggregate

↓

Modify Aggregate

↓

Save Aggregate

↓

Commit

↓

Publish Events
```

---

# Data Ownership

Each bounded context owns its own data.

Example

Catalog owns

- Products
- Categories
- Prices

Sales reads Product information but never updates it.

---

# Database Independence

Supported databases should include:

- PostgreSQL (primary)
- MySQL (future)
- SQL Server (future)

Changing the database must not require Domain changes.

---

# Multi-Tenancy

Every Aggregate belongs to one Organization.

Every table includes:

```
organization_id
```

Queries must always be tenant-scoped.

Cross-tenant access is forbidden.

---

# Auditing

Every Aggregate should include:

```
created_at

created_by

updated_at

updated_by

archived_at

archived_by
```

Deletes should be logical (soft delete) unless legally or operationally required.

---

# Soft Deletes

Entities are archived instead of deleted.

```
status

↓

ACTIVE

ARCHIVED
```

Advantages

- Audit history
- Undo support
- Referential integrity

---

# Optimistic Locking

Every Aggregate includes a version.

```
version

1

2

3

4
```

Concurrent updates fail if versions differ.

---

# Transactions

One Command

↓

One Transaction

Transactions should never span multiple bounded contexts.

Cross-context consistency is achieved using Domain Events.

---

# Read Models

Write Model

↓

Domain

↓

Events

↓

Read Model

Read Models are optimized for queries.

Examples

- Dashboard
- Daily Sales
- Inventory Summary
- Top Products

---

# CQRS Persistence

Commands

↓

Aggregate Repositories

Queries

↓

Read Models

Commands never query reporting tables.

Queries never update Aggregate tables.

---

# Event Storage

Every published Domain Event should be persisted.

Benefits

- Audit
- Replay
- Offline sync
- Integration
- Debugging

---

# ID Strategy

Every Aggregate uses UUID.

Examples

```
organization_id

sale_id

product_id

customer_id
```

Human-readable numbers remain separate.

Examples

```
SALE-2026-000001

INV-2026-000015
```

---

# Number Generation

Business numbers are not primary keys.

Examples

- Sale Number
- Invoice Number
- Purchase Number

Each Organization controls its numbering rules.

---

# Database Constraints

The database should enforce:

- Foreign keys
- Unique constraints
- Check constraints
- Indexes

Business rules remain in the Domain.

---

# Indexing Strategy

Indexes should exist for:

- organization_id
- branch_id
- created_at
- updated_at
- status
- business_number

Additional indexes are based on query patterns.

---

# File Storage

Binary files are never stored in the database.

Examples

- Images
- PDFs
- Attachments

Store only references.

---

# Caching

Caching belongs to Infrastructure.

Examples

- Product catalog
- Settings
- Permissions

Cache invalidation occurs through Domain Events.

---

# Search

Search is independent from persistence.

Future implementations may use:

- PostgreSQL Full Text Search
- OpenSearch
- Elasticsearch

The Domain remains unchanged.

---

# Backup & Recovery

The persistence layer must support:

- Point-in-time recovery
- Automated backups
- Disaster recovery
- Data export

---

# Performance Guidelines

- Avoid N+1 queries.
- Use pagination for large datasets.
- Use projections for reporting.
- Load Aggregates only when required.
- Prefer event-driven updates for analytics.

---

# Architecture Rules

- One repository per Aggregate Root.
- Infrastructure implements repository interfaces.
- Commands modify Aggregates.
- Queries use read models.
- Persistence never contains business rules.
- Domain never depends on persistence technology.

---

# Related Documents

- architecture/01-clean-architecture.md
- architecture/02-application-layer.md
- architecture/03-module-architecture.md
- domain/02-aggregates.md
- domain/05-domain-events.md