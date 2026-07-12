# 09. Background Jobs Architecture

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines asynchronous background processing for work that should not block a user-facing business operation.

Background jobs support reliable processing for notifications, integrations, reporting projections, maintenance, file processing, and deferred event consumers.

---

# Design Goals

- Keep user-facing operations responsive.
- Process work reliably and observably.
- Preserve tenant isolation and business context.
- Support retries without duplicate business effects.
- Scale workers independently from API instances.
- Recover safely from worker and infrastructure failures.

---

# Design Principles

## Domain Events Initiate Deferred Work

Completed business facts may cause background work through Domain Events. A job never substitutes for Aggregate rule enforcement or the transaction that establishes the business fact.

## Jobs Are Application and Infrastructure Work

Jobs invoke public Application Services or dedicated infrastructure adapters. They do not access another module's internals or implement business rules.

## At-Least-Once Delivery

Jobs may execute more than once. Consumers must be idempotent and tolerate retry, duplication, delay, and out-of-order delivery where ordering is not guaranteed.

## Tenant Context Is Mandatory

Every tenant-related job includes trusted Organization scope and relevant Branch, actor, capability, and correlation context.

---

# Architecture Overview

```text
Business Operation
↓
PostgreSQL Transaction Completes
↓
Domain Event
↓
Job Producer
↓
Redis Queue
↓
Worker
↓
Public Application Service or External Adapter
```

BullMQ and Redis are infrastructure implementation details. PostgreSQL remains the source of truth for business state.

---

# Core Concepts

## Job Categories

- Notification delivery
- External integration delivery and import
- Report and dashboard projection refresh
- Search indexing
- File scanning and processing
- Scheduled maintenance
- Retryable event consumer work

## Job Identity

Every job has a stable identity, type, tenant scope, correlation identifier, creation time, attempt count, and payload version.

Payloads contain only the data necessary to perform the work. Workers reload authoritative business state from PostgreSQL when required.

## Retry and Failure Handling

Transient failures are retried with bounded backoff.

Permanent failures, exhausted retries, and malformed payloads are retained for operator investigation. Failures are never silently discarded.

## Scheduling

Scheduled jobs are used for bounded, operationally safe work. Schedule execution must be safe when overlapping attempts or delayed delivery occur.

---

# Lifecycle / Flow

```text
Job Created
↓
Queued
↓
Worker Claims Job
↓
Validate Identity, Tenant Context, and Payload Version
↓
Execute Idempotent Work
↓
Complete, Retry, or Retain Failure
```

Workers publish resulting Domain Events only after their own successful business operation. A job must not publish completion before the corresponding operation is durable.

---

# Best Practices

- Keep jobs small and single-purpose.
- Use idempotency keys for external side effects.
- Limit concurrency per integration and tenant when needed.
- Prefer Domain Events over direct cross-module job creation.
- Version job payloads deliberately.
- Monitor queue depth, age, retry count, and failures.
- Provide operator procedures for replay and failure resolution.

---

# Architecture Rules

- Jobs never contain Aggregate business rules.
- Jobs communicate with modules through Domain Events or public Application Services only.
- Redis queues are not a source of business truth.
- PostgreSQL must contain the durable state required to safely retry work.
- Every tenant-related job must be tenant-scoped.
- Job processing must be idempotent.
- Worker failures must be observable and recoverable.
- Plugins may register supported asynchronous consumers but cannot modify core job ownership.

---

# Related Documents

- backend/05-event-architecture.md
- backend/07-observability-architecture.md
- backend/10-real-time-architecture.md
- backend/11-file-storage-architecture.md
- backend/12-search-architecture.md
- architecture/03-module-architecture.md
