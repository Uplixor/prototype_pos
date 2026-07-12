# 04. Database Design

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the database design principles for the Commerce Operating Platform.

The database should support multi-tenancy, offline synchronization, scalability, auditing, and long-term maintainability while remaining independent of business logic.

---

# Design Goals

The database should be:

- Reliable
- Scalable
- Normalized
- Performant
- Easy to maintain
- Easy to migrate
- Audit-friendly

---

# Database Engine

Primary Database

- PostgreSQL

Reasons

- ACID compliant
- Excellent indexing
- JSON support
- Strong ecosystem
- Mature tooling

---

# ORM

Official ORM

- Prisma

Responsibilities

- Database access
- Migrations
- Type-safe queries

Business rules must never be implemented inside Prisma models.

---

# Design Principles

- Database stores data.
- Domain contains business rules.
- Tables represent persistence, not business behavior.
- Prefer normalization.
- Optimize only when necessary.

---

# Multi-Tenancy

Every business record belongs to an Organization.

Examples

```
organization_id
```

Every query must be tenant scoped.

Cross-tenant access is prohibited.

---

# Branch Support

Business data may belong to a Branch.

Examples

```
branch_id
```

Not every table requires branch ownership.

Example

Products

Organization scoped

Sales

Branch scoped

---

# Primary Keys

Primary keys use UUID.

Example

```
id UUID
```

Business numbers should never be primary keys.

Examples

```
SALE-000001

INV-000245
```

---

# Audit Fields

Every business table should include

```
created_at

updated_at

created_by

updated_by
```

Optional

```
archived_at

archived_by
```

---

# Soft Deletes

Business records should be archived instead of deleted.

Reasons

- Audit
- Reporting
- Recovery
- Historical data

---

# Relationships

Use foreign keys where appropriate.

Examples

Sale

↓

Customer

↓

Organization

Avoid unnecessary relationships.

---

# Transactions

Transactions should be short.

One business operation should normally execute inside one database transaction.

Cross-module consistency should use Domain Events.

---

# Indexing

Create indexes for:

- Primary Keys
- Foreign Keys
- organization_id
- branch_id
- created_at
- updated_at

Add additional indexes based on real query patterns.

---

# Constraints

Use database constraints for:

- Primary Keys
- Foreign Keys
- Unique Values
- Required Fields

Business validation belongs in the Domain Layer.

---

# Naming Conventions

Tables

Plural

```
products

sales

customers
```

Columns

snake_case

```
created_at

organization_id

sale_number
```

Indexes

```
idx_products_name

idx_sales_created_at
```

Foreign Keys

```
fk_sales_customer
```

---

# Migrations

All database changes must use migrations.

Never modify production databases manually.

Migration files should be:

- Small
- Reversible
- Reviewed

---

# Read Models

Reporting may use optimized read models.

Examples

- Dashboard
- Daily Sales
- Product Performance
- Inventory Summary

Read models should never replace transactional tables.

---

# File Storage

Binary files should not be stored inside PostgreSQL.

Store only:

- File ID
- URL
- Metadata

Actual files belong in object storage.

---

# Backup Strategy

The platform should support:

- Daily Backups
- Point-in-Time Recovery
- Disaster Recovery
- Restore Testing

---

# Performance Guidelines

- Avoid SELECT *
- Use pagination
- Prevent N+1 queries
- Use indexes appropriately
- Archive historical data when needed

---

# Best Practices

- Keep tables normalized.
- Keep transactions short.
- Use UUIDs.
- Use migrations.
- Review indexes regularly.
- Monitor slow queries.

---

# Architecture Rules

- PostgreSQL is the primary database.
- Prisma is the only ORM.
- Business logic never belongs in the database.
- Every record belongs to an Organization.
- Business numbers are not primary keys.
- Use soft deletes by default.

---

# Related Documents

- backend/01-backend-architecture.md
- backend/02-tech-stack.md
- backend/03-coding-standards.md
- architecture/04-persistence.md