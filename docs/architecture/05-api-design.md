# 05. API Design

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the API architecture of the Commerce Operating Platform.

The API is the primary interface between clients and the backend.

It must support:

- Mobile applications
- Web applications
- Future desktop applications
- Third-party integrations
- Plugins

The API follows REST principles while aligning with DDD, CQRS, and Clean Architecture.

---

# Design Goals

The API should be:

- Consistent
- Predictable
- Versioned
- Secure
- Discoverable
- Backward compatible

---

# API Style

Primary

REST

Future

- GraphQL (optional)
- gRPC (internal services)
- WebSocket (real-time)

REST remains the public API.

---

# Base URL

/api/v1

Examples

GET /api/v1/products

POST /api/v1/sales

---

# Versioning

Version in URL.

Good

/api/v1/products

Bad

/products

---

# Resource Naming

Use plural nouns.

Good

/products

/customers

/sales

/payments

Bad

/getProducts

/createSale

/deleteCustomer

---

# HTTP Methods

GET

Read

POST

Create

PUT

Replace

PATCH

Partial Update

DELETE

Archive (logical delete)

---

# Response Format

Success

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Error

```json
{
  "success": false,
  "error": {
    "code": "SALE_NOT_FOUND",
    "message": "Sale not found."
  }
}
```

---

# Standard Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

500 Internal Server Error

---

# Pagination

Cursor-based pagination.

Request

```
GET /products?cursor=abc123&limit=20
```

Response

```json
{
  "data": [],
  "meta": {
    "nextCursor": "...",
    "hasMore": true
  }
}
```

---

# Filtering

```
GET /products

?status=ACTIVE

&category=coffee

&branch=ktm
```

---

# Sorting

```
GET /products

?sort=name

?order=asc
```

---

# Search

```
GET /products

?q=coffee
```

---

# Field Selection (Future)

```
GET /products?fields=id,name,price
```

---

# Resource Relationships

```
GET /sales/{id}

GET /sales/{id}/payments

GET /customers/{id}/sales
```

Never expose database joins.

---

# Commands

State-changing operations use POST/PATCH.

Examples

POST /sales

PATCH /sales/{id}

POST /payments

---

# Queries

Read operations use GET.

Examples

GET /products

GET /reports/daily-sales

GET /dashboard

---

# Idempotency

Support idempotency for critical requests.

Examples

- Payment
- Sale Completion
- Refund

Header

```
Idempotency-Key
```

---

# Authentication

JWT Access Token

Refresh Token

Future

API Keys

OAuth2

---

# Authorization

Permission-based.

Examples

```
product.read

product.update

sale.create

sale.refund
```

Never role-based checks inside controllers.

---

# Validation

Presentation Layer

- DTO validation
- Request format

Domain Layer

- Business rules

---

# Error Codes

Machine-readable.

Examples

```
PRODUCT_NOT_FOUND

INSUFFICIENT_STOCK

PAYMENT_FAILED

INVALID_PERMISSION
```

Never rely on error messages.

---

# File Upload

Separate endpoint.

```
POST /files
```

Return

```
fileId
url
```

---

# Bulk Operations

Supported where appropriate.

Examples

```
POST /products/bulk

POST /inventory/adjustments
```

---

# Long Running Tasks

Return immediately.

```
202 Accepted
```

Track using Job ID.

---

# Real-Time Updates

WebSocket events.

Examples

SaleCompleted

KitchenTicketCreated

StockAdjusted

NotificationReceived

---

# Offline Synchronization

Commands are queued locally.

After reconnect

Client

↓

Sync Endpoint

↓

Conflict Resolution

↓

Updated State

---

# Rate Limiting

Applied per:

- User
- Organization
- API Key

---

# API Documentation

OpenAPI 3.1

Swagger UI

Generated from code.

---

# Naming Rules

Resources

Plural

products

sales

customers

DTO

Singular

CreateProductRequest

ProductResponse

Commands

Verb + Entity

CreateSaleCommand

ArchiveProductCommand

Queries

Verb + Entity

GetProductQuery

SearchProductsQuery

---

# Deprecation

Deprecated endpoints remain supported for one major API version.

Clients receive deprecation headers.

---

# Security

- HTTPS only
- JWT authentication
- Permission checks
- Input validation
- Rate limiting
- Audit logging

---

# Architecture Rules

- Controllers remain thin.
- Controllers never contain business logic.
- Controllers call Commands or Queries.
- Commands modify state.
- Queries never modify state.
- Business rules belong in the Domain.

---

# Related Documents

- architecture/01-clean-architecture.md
- architecture/02-application-layer.md
- architecture/03-module-architecture.md
- architecture/04-persistence.md
- domain/05-domain-events.md