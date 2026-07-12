# 12. Integration Architecture

> Status: Draft
> Owner: Platform Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines how the Commerce Operating Platform integrates with payment providers, commerce channels, messaging providers, accounting systems, and future partners.

Integrations extend platform capability without coupling core domains to external provider models.

---

# Design Goals

- Keep external providers outside core domains.
- Protect tenant data and credentials.
- Support reliable asynchronous delivery and inbound processing.
- Make failures, retries, and reconciliation observable.
- Allow providers to be replaced.

---

# Design Principles

## Ports and Adapters

Core capabilities express provider-neutral needs through ports. Infrastructure adapters translate those needs to external APIs, webhooks, and files.

## Completed Facts Cross Boundaries

Outbound integration work starts from completed Domain Events or approved public Application Services. External side effects do not precede durable business state.

## Provider Data Is Untrusted

Inbound data is authenticated, validated, tenant-resolved, deduplicated, and translated before reaching Application Services.

---

# Architecture Overview

```text
Core Domain Event or Public Application Service
↓
Integration Application Service
↓
Background Job and Provider Adapter
↓
External Provider

Inbound Provider Event
↓
Validation and Tenant Resolution
↓
Public Application Service
```

---

# Core Concepts

## Integration Ownership

Each integration has a business owner, supported capabilities, tenant configuration, credential owner, event contracts, failure policy, and reconciliation procedure.

## Webhooks

Inbound webhooks authenticate origin, validate payloads, record receipt safely, and perform business changes asynchronously when appropriate.

Webhook delivery may be duplicated or delayed. Processing is idempotent.

## Outbound Delivery

Outbound delivery uses retryable jobs, bounded backoff, observability, and idempotency keys where supported.

External success is reconciled with durable platform state; it is never inferred only from queue completion.

## Credentials

Credentials are tenant-scoped, encrypted, access-controlled, and rotated through approved security workflows. They never appear in Domain Events, logs, or cache entries.

---

# Lifecycle / Flow

```text
Completed Business Fact
↓
Integration Event Consumer
↓
Idempotent Delivery Job
↓
Provider Response
↓
Record Outcome and Reconcile
```

---

# Best Practices

- Use provider-neutral language at core boundaries.
- Version integration contracts deliberately.
- Rate-limit and isolate provider failures.
- Provide replay and reconciliation procedures.
- Monitor delivery age, errors, and provider availability.
- Test duplicate, delayed, rejected, and unavailable-provider paths.

---

# Architecture Rules

- External providers never modify core domain internals directly.
- Integration work communicates through Domain Events or public Application Services only.
- Every integration is tenant-scoped and authorized.
- PostgreSQL stores authoritative integration state and reconciliation records.
- Business logic never exists in provider adapters.
- Plugins use the same public integration boundaries as first-party extensions.

---

# Related Documents

- architecture/03-module-architecture.md
- architecture/08-plugin-system.md
- backend/05-event-architecture.md
- backend/08-security-architecture.md
- backend/09-background-jobs-architecture.md
