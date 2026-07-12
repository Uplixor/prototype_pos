# 02. Offline Data and Conflict Handling

> Status: Draft
> Owner: Mobile Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the mobile responsibilities for offline data, pending work, synchronization, and conflict handling.

It complements the platform synchronization architecture with client-specific operational rules.

---

# Design Goals

- Let users continue supported work offline.
- Preserve clear ownership of authoritative decisions.
- Prevent cross-tenant local data exposure.
- Make conflicts and rejected work understandable.
- Recover safely after interruption or reconnect.

---

# Design Principles

## Explicit Local States

Local records and mutations have visible states: synchronized, pending, processing, confirmed, rejected, or conflicted.

## Server Authority

The server validates permissions, capability availability, Aggregate invariants, and final ordering. The client never silently overwrites authoritative outcomes.

## Conflict Is a Business Outcome

Conflicts are resolved according to capability policy. They are not treated as transport errors or hidden retries.

---

# Architecture Overview

```text
Tenant-Scoped Local Read Model
↓
User Action
↓
Pending Mutation Queue
↓
Synchronization Request
↓
Server Validation and Outcome
↓
Local Reconciliation
```

---

# Core Concepts

## Local Data Scope

The local database is partitioned by Organization and protected by authenticated device context. Branch, user, capability, and permission scope are represented where they affect visibility.

## Pending Mutations

Every mutation records a stable identifier, tenant scope, business intent, local time, dependency relationship, retry state, and server outcome when available.

## Conflict Categories

- Authorization changed while offline
- Capability disabled or configuration changed
- Resource changed by another actor
- Resource is no longer available
- Duplicate mutation or payment attempt
- Aggregate invariant no longer permits the action

## Resolution

The capability defines whether the client refreshes, asks the user to choose, creates a follow-up action, or records a rejected outcome. Financial and inventory conflicts require explicit, auditable resolution.

---

# Lifecycle / Flow

```text
Local Mutation Created
↓
Queue Until Eligible to Sync
↓
Server Accepts, Rejects, or Reports Conflict
↓
Refresh Authoritative Read Models
↓
Mark Local Outcome and Guide User
```

---

# Best Practices

- Keep mutations small and single-purpose.
- Preserve stable identifiers through retries.
- Sync in bounded batches with resumable progress.
- Do not retry permanent authorization or validation failures automatically.
- Surface actionable status in the relevant workflow.
- Test duplicate delivery, clock skew, restart, and reconnect paths.

---

# Architecture Rules

- PostgreSQL is the source of truth for synchronization outcomes.
- Local storage and queues are tenant-scoped infrastructure of the mobile client.
- Conflict policy belongs to the owning capability.
- Mobile clients communicate only through public API and sync contracts.
- Real-time events are hints and cannot confirm a pending mutation.
- Plugins cannot bypass core synchronization and conflict rules.

---

# Related Documents

- mobile/01-mobile-architecture.md
- architecture/07-offline-sync.md
- backend/08-security-architecture.md
- backend/10-real-time-architecture.md
- product/04-critical-business-workflows.md
