# 07. Observability Architecture

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines how the Commerce Operating Platform observes its behavior, health, and business-critical operations.

Observability enables operators to detect failures, investigate incidents, understand system capacity, and protect tenant operations without exposing sensitive data.

---

# Design Goals

- Detect service and dependency failures early.
- Trace a business operation across module boundaries.
- Measure customer-facing reliability and latency.
- Support tenant-scoped investigation.
- Preserve privacy and security.
- Remain useful during partial infrastructure failure.

---

# Design Principles

## Structured and Correlated

Logs, metrics, and traces use consistent correlation identifiers. A request, command, Domain Event, background job, and sync operation retain trace context where applicable.

## Business Context Without Sensitive Data

Telemetry includes operational context such as Organization ID, Branch ID, module, capability, Aggregate type, event name, and outcome. It never records secrets, credentials, payment data, or unnecessary personal data.

## Infrastructure Is Observable

PostgreSQL, Redis, job processing, external providers, file storage, and real-time delivery are monitored as dependencies. Redis remains infrastructure and is not an authoritative telemetry source.

---

# Architecture Overview

```text
Application Services and Infrastructure Adapters
↓
Structured Logs + Metrics + Traces
↓
Centralized Observability Platform
↓
Dashboards, Alerts, and Incident Investigation
```

The observability integration is an infrastructure concern. Domain models do not depend on logging, metrics, or tracing providers.

---

# Core Concepts

## Logs

Logs record significant operational events and failures.

- Request completion and unhandled failures
- Authentication and authorization denials
- Domain Event publication and consumer failures
- Background job lifecycle and retry exhaustion
- External integration failures
- Cache and database dependency failures

Logs are structured, searchable, and assigned a severity level.

## Metrics

Metrics measure platform behavior over time.

- Request rate, latency, and error rate
- Database connection health and query latency
- Redis availability, hit rate, evictions, and latency
- Queue depth, processing duration, retry count, and dead-letter count
- Real-time connection and delivery health
- Offline synchronization success, conflict, and failure rates

## Traces

Traces connect work across boundaries.

Trace context should link an incoming request to public Application Services, persistence work, Domain Event handlers, jobs, and supported external calls.

## Health Signals

Health checks distinguish between process availability, readiness to serve traffic, and dependency degradation.

A non-critical dependency failure may degrade a capability without making the complete platform unavailable.

---

# Lifecycle / Flow

```text
Business Request
↓
Correlation Context Created
↓
Application Service and Aggregate Operation
↓
Persistence and Domain Event Publication
↓
Log, Metric, and Trace Signals Recorded
↓
Dashboard, Alert, or Investigation
```

Background jobs and real-time messages continue the relevant correlation context. When no incoming request exists, the job or event becomes the root operational context.

---

# Best Practices

- Log outcomes and decisions, not raw request payloads.
- Use stable event, module, and capability names.
- Measure service-level objectives for customer-facing workflows.
- Alert on symptoms that require action, not every transient failure.
- Include tenant scope only where access controls permit it.
- Keep dashboards focused on operational decisions.
- Test alert routing and incident runbooks.

---

# Architecture Rules

- Observability must not alter business behavior.
- Business logic never exists in controllers, repositories, or observability adapters.
- Telemetry must not contain secrets, payment data, access tokens, or full personal data.
- Every cross-boundary operation must propagate correlation context when technically possible.
- All failed background jobs and event consumers must be observable.
- Multi-tenant telemetry access must be restricted to authorized operators.
- Plugins may emit their own telemetry but must not alter core telemetry contracts.

---

# Related Documents

- backend/01-backend-architecture.md
- backend/05-event-architecture.md
- backend/06-caching-architecture.md
- backend/09-background-jobs-architecture.md
- backend/10-real-time-architecture.md
- backend/15-disaster-recovery.md
