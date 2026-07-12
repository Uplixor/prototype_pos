# 12. Search Architecture

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines search as a read capability of the Commerce Operating Platform.

Search helps users discover authorized catalog, customer, order, and future capability data without becoming a source of truth for business decisions.

---

# Design Goals

- Provide fast, relevant discovery.
- Maintain strict tenant and permission boundaries.
- Support capability-driven indexing.
- Tolerate asynchronous index updates.
- Preserve PostgreSQL as the authoritative data source.
- Allow search infrastructure to evolve independently.

---

# Design Principles

## Search Is a Projection

Search indexes are disposable projections derived from authoritative PostgreSQL state and completed Domain Events.

An index can be rebuilt without changing business correctness.

## Event-Driven Indexing

Completed Domain Events initiate indexing or removal work. Modules do not directly manipulate another module's search index.

## Authorization Before Results

Search requests are tenant-scoped and authorized before querying or returning results. Indexing must include fields needed to enforce safe result scoping.

## Eventual Consistency Is Explicit

Search results can lag behind a completed business operation. Critical transactional decisions always read authoritative state from PostgreSQL.

---

# Architecture Overview

```text
PostgreSQL Business State
↓
Domain Event
↓
Indexing Job
↓
Search Projection
↓
Authorized Search Read Model
```

The initial platform may use PostgreSQL search capabilities. A dedicated search provider can be introduced behind an infrastructure adapter when scale or relevance requirements justify it.

---

# Core Concepts

## Search Documents

A search document represents a purpose-specific read projection, not a Domain Entity or Aggregate.

Documents include a document identifier, Organization scope, resource identity, searchable fields, lifecycle state, version, and authorization-relevant scope.

## Index Ownership

Each Bounded Context owns the meaning and lifecycle of its documents.

Catalog owns product discovery. Sales owns permitted sales discovery. Plugins may contribute their own documents through approved public extension points.

## Query Scope

Every search query resolves:

- Organization
- Branch when applicable
- Identity and permission scope
- Capability availability
- Resource lifecycle filters

Search must not reveal the existence of unauthorized resources.

## Rebuilds

Indexes are rebuilt from authoritative data using controlled, tenant-safe processes. Rebuilds are observable and must not interfere with transactional workloads.

---

# Lifecycle / Flow

```text
Resource Changes
↓
Domain Event Published
↓
Indexing Job Loads Authoritative State
↓
Upsert or Remove Search Projection
↓
Authorized Query Returns Matching Projection
```

Consumers are idempotent. Repeated events and rebuilds must produce equivalent search state.

---

# Best Practices

- Index only fields required for discovery.
- Normalize and version documents deliberately.
- Keep permission-sensitive fields explicit.
- Use asynchronous indexing for non-critical changes.
- Provide a rebuild path for every document family.
- Measure indexing lag, failures, and query latency.
- Revalidate authoritative state for critical actions selected from search.

---

# Architecture Rules

- PostgreSQL is the source of truth; search indexes are projections.
- Search results must be tenant-scoped and authorization-filtered.
- Search indexing occurs through Domain Events or public Application Services only.
- Search documents must not contain secrets or unnecessary sensitive data.
- Search infrastructure must not contain business rules.
- Search availability must not prevent transactional business operations.
- Plugins extend search through public contracts and cannot modify core document ownership.

---

# Related Documents

- backend/04-database-design.md
- backend/05-event-architecture.md
- backend/08-security-architecture.md
- backend/09-background-jobs-architecture.md
- architecture/03-module-architecture.md
- architecture/08-plugin-system.md
