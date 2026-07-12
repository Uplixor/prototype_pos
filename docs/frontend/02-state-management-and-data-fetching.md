# 02. State Management and Data Fetching

> Status: Draft
> Owner: Frontend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines how the web frontend manages server data, presentation state, mutations, and change reconciliation.

The goal is responsive user experience without treating browser state as a source of business truth.

---

# Design Goals

- Keep server state consistent with authorized backend read models.
- Make loading, failure, and stale data visible.
- Support responsive interaction without unsafe optimistic behavior.
- Scope all data to tenant and capability context.
- Reconcile real-time and offline changes safely.

---

# Design Principles

## Server State Is External

Server data is fetched from public APIs and identified by Organization, Branch, capability, authorization, query parameters, and representation version where needed.

## Presentation State Is Local

Filters, draft input, modal state, selected items, and layout preferences are transient user experience state. They are not shared business state.

## Mutations Require Reconciliation

A successful command confirms durable backend state. The frontend refreshes or updates only the affected authorized read models.

---

# Architecture Overview

```text
Tenant and Capability Context
↓
Query Identity
↓
Public API Read Model
↓
Screen Presentation State

User Command
↓
Public API
↓
Confirmed Outcome
↓
Refresh or Reconcile Read Models
```

---

# Core Concepts

## Query Identity

Every cached client query includes tenant and access context. Data from one Organization, Branch, user, or capability state must never appear in another context.

## Mutation States

Mutations expose pending, succeeded, failed, and conflict states. Financial, inventory, and synchronization actions require clear durable outcomes before the UI treats them as completed.

## Optimistic Updates

Optimistic updates are limited to reversible, low-risk interactions. They require an explicit rollback path and never pre-confirm payment, inventory, or authorization outcomes.

## Change Signals

Real-time messages invalidate or refresh suitable queries. The frontend does not directly apply untrusted message payloads as business truth.

---

# Lifecycle / Flow

```text
Query Authorized Read Model
↓
Render Fresh, Loading, Empty, or Error State
↓
User Submits Command
↓
Receive Durable Result
↓
Invalidate or Refresh Related Reads
```

---

# Best Practices

- Keep query and mutation ownership within capability modules.
- Use stable, tenant-scoped query identities.
- Cancel or discard stale requests on tenant context changes.
- Preserve drafts separately from fetched data.
- Present retry only when it is safe and meaningful.
- Instrument user-visible data failures.

---

# Architecture Rules

- Client caches are not sources of truth.
- Tenant context changes clear incompatible data and presentation state.
- Business validation and authorization remain server-side.
- Commands use public API contracts only.
- Real-time delivery triggers reconciliation, not uncontrolled state mutation.
- Offline work follows the dedicated mobile and sync architecture.

---

# Related Documents

- frontend/01-frontend-architecture.md
- architecture/05-api-design.md
- architecture/07-offline-sync.md
- backend/06-caching-architecture.md
- backend/10-real-time-architecture.md
