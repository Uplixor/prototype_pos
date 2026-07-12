# 06. Caching Architecture

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the caching architecture of the Commerce Operating Platform.

Caching improves read performance, reduces PostgreSQL load, and supports responsive mobile and web experiences. It is an optimization layer and never replaces the source of truth.

---

# Design Goals

The caching architecture should be:

- Fast
- Reliable
- Tenant-isolated
- Consistent with completed business operations
- Observable
- Replaceable
- Safe during infrastructure failures

---

# Design Principles

## PostgreSQL First

PostgreSQL is the source of truth for all business data.

A cache entry may be lost, expired, or invalidated without affecting business correctness.

## Cache as Infrastructure

Redis is infrastructure. The Domain and Application layers remain independent of cache technology.

Business rules, Aggregate decisions, and transactional writes must never depend on cached values.

## Cache-Aside Reads

The platform uses cache-aside for eligible read models and reference data.

The Application layer reads a valid cached representation when available. On a miss, it reads PostgreSQL and refreshes the cache.

## Event-Driven Invalidation

Successful business operations publish Domain Events. Cache consumers invalidate affected cached representations after those events are published.

Modules do not clear another module's cache directly.

## Tenant Isolation

Every cache entry is scoped to an Organization and, when relevant, a Branch, user, capability, locale, or other access context.

Cross-tenant cache sharing is prohibited.

## Offline-First Consistency

Server-side caching must not weaken offline synchronization guarantees.

Sync decisions, conflict resolution, pending mutations, and event history are not served from cache as authoritative state.

---

# Architecture Overview

```text
Client
↓
Public Application Service
↓
Eligible Read Model
↓
Redis Cache
↓ cache miss
PostgreSQL
```

Redis is shared infrastructure for backend instances. In-memory process caches must not hold shared business data or tenant state.

---

# Core Concepts

## Cacheable Data

Cache data that is read frequently, changes predictably, and can safely tolerate a bounded period before refresh.

Typical candidates include:

- Product catalog views
- Categories, units, tax rates, currencies, and countries
- Organization and Branch settings
- Enabled capabilities and non-sensitive feature configuration
- Roles, permissions, and Branch access projections
- Dashboard and reporting read models
- Receipt and display configuration

## Non-Cacheable Data

Do not cache by default:

- Active sales and open orders
- Payment authorization and payment state
- Inventory transactions and available stock during critical operations
- Domain Events and audit logs
- Sync queues, conflict state, and mutation status
- Secrets, credentials, access tokens, or payment data

These data types require stronger consistency, explicit authorization, or durable retrieval.

## Cache Keys

Cache keys are predictable, versioned, and tenant-scoped.

Examples:

```text
organization:{organizationId}:settings
organization:{organizationId}:branch:{branchId}:catalog
organization:{organizationId}:user:{userId}:permissions
organization:{organizationId}:dashboard:v1
```

Keys must not expose sensitive business data. Key versions allow incompatible read-model changes to be introduced without ambiguity.

## Expiration

Every entry has an explicit expiration policy.

Expiration reduces the impact of missed invalidation and prevents obsolete data from remaining indefinitely. The expiry duration reflects business freshness requirements, not convenience.

Frequently changing or permission-sensitive representations use shorter lifetimes. Stable reference data may use longer lifetimes with event-driven invalidation.

---

# Lifecycle / Flow

## Read Flow

```text
Request
↓
Authorize and resolve tenant scope
↓
Lookup cached read model
↓
Cache hit → return representation
Cache miss → read PostgreSQL → store eligible representation → return representation
```

Authorization is evaluated before returning a cached representation. A cache hit never bypasses tenant, capability, or permission boundaries.

## Invalidation Flow

```text
Business Operation
↓
Aggregate enforces business rules
↓
PostgreSQL transaction completes
↓
Domain Event is published
↓
Owning cache consumer invalidates affected entries
↓
Next eligible read reloads from PostgreSQL
```

Examples of invalidation relationships:

| Domain Event | Affected Cached Data |
|---|---|
| ProductUpdated | Product and catalog views |
| PriceChanged | Product and pricing views |
| PermissionUpdated | User authorization projections |
| SettingsUpdated | Organization or Branch settings |
| CapabilityEnabled | Capability and configuration views |

Invalidation must be idempotent. Repeated event delivery must be safe.

## Failure Flow

If Redis is unavailable:

- Read directly from PostgreSQL.
- Skip cache reads and writes for the affected operation.
- Continue business processing when PostgreSQL and required dependencies are available.
- Record the infrastructure failure for operators.
- Resume normal cache behavior after Redis recovers.

A cache failure must not cause a valid business operation to fail.

---

# Best Practices

- Cache read models, not Aggregates.
- Keep cached payloads small and purpose-specific.
- Use public Application Services to create cacheable representations.
- Invalidate based on completed Domain Events.
- Define ownership for every cached data family.
- Avoid broad cache clears except during controlled operational recovery.
- Measure freshness requirements before choosing expiration periods.
- Protect against cache stampedes for high-demand read models.
- Do not use cache contents as an audit source or reconciliation source.
- Treat cache metrics and invalidation failures as operational signals.

---

# Architecture Rules

- PostgreSQL is the source of truth.
- Redis is infrastructure and a distributed cache only.
- Business logic never exists in cache consumers or infrastructure adapters.
- Aggregates never read cached state to make business decisions.
- Cache entries must include Organization scope.
- Branch, user, permission, capability, locale, and currency context must be included when they affect the representation.
- Modules communicate cache invalidation through Domain Events or public Application Services only.
- Cache invalidation occurs only after the relevant business operation succeeds.
- Cached data must not bypass authorization.
- Offline sync, audit, payment, and active transactional state must not depend on cache correctness.
- Plugins may consume public cacheable read models but must not modify core cache ownership or invalidation rules.
- The platform must remain operational when Redis is unavailable.

---

# Related Documents

- backend/01-backend-architecture.md
- backend/04-database-design.md
- backend/05-event-architecture.md
- architecture/02-application-layer.md
- architecture/04-persistence.md
- architecture/06-permission-system.md
- architecture/07-offline-sync.md
