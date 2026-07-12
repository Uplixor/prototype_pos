# 11. CQRS Architecture

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines Command Query Responsibility Segregation for the Commerce Operating Platform.

CQRS separates business-changing decisions from optimized reads without creating separate sources of truth.

---

# Design Goals

- Keep business invariants inside Aggregates.
- Provide purpose-specific, fast read models.
- Make consistency expectations explicit.
- Support reporting, mobile, web, and offline synchronization.
- Preserve PostgreSQL as the source of truth.

---

# Design Principles

## Commands Change State

Commands invoke public Application Services and Aggregates. They validate authority and business rules, persist durable state, and publish completed Domain Events.

## Queries Do Not Change State

Queries return authorized read models. They do not invoke Aggregate decisions or produce Domain Events.

## Read Models Are Projections

Read models are purpose-specific projections of authoritative state. They may be rebuilt and may be eventually consistent after a completed command.

---

# Architecture Overview

```text
Command
↓
Application Service and Aggregate
↓
PostgreSQL Transaction
↓
Domain Event
↓
Read Model Projection

Query
↓
Authorized Read Model
```

---

# Core Concepts

## Command Model

The command model owns invariant enforcement, transactional consistency, audit context, and event creation. It is optimized for correctness rather than screen-specific responses.

## Query Model

The query model serves dashboards, lists, search, receipts, mobile views, and reports. It includes Organization, Branch, capability, and authorization-relevant scope.

## Consistency

The command response confirms durable state. Derived read models, reports, search, cache, and real-time updates may follow asynchronously.

Critical follow-up decisions reload authoritative state rather than relying on a projection.

## Projection Ownership

The Bounded Context that owns the business meaning owns its projections and event contract. Other modules consume published outcomes rather than internal tables.

---

# Lifecycle / Flow

```text
Authorized Command
↓
Durable Business Decision
↓
Completed Domain Event
↓
Idempotent Projection Update
↓
Authorized Query or Sync Read
```

---

# Best Practices

- Name commands and queries in ubiquitous language.
- Keep commands focused on one business intent.
- Build read models for consumer needs, not entity mirroring.
- Version projections when their representation changes.
- Monitor projection lag and failed consumers.
- Test duplicate event delivery and rebuild behavior.

---

# Architecture Rules

- PostgreSQL is the source of truth for command outcomes.
- Queries never contain business-changing behavior.
- Commands never rely on cache or projections for invariant decisions.
- Read models must enforce tenant and authorization scope.
- Projection communication uses Domain Events or public Application Services only.
- Plugins consume public read contracts and do not alter core command models.

---

# Related Documents

- architecture/02-application-layer.md
- architecture/04-persistence.md
- backend/05-event-architecture.md
- backend/06-caching-architecture.md
- backend/12-search-architecture.md
