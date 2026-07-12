# 15. Disaster Recovery

> Status: Draft
> Owner: Platform Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines disaster recovery principles for the Commerce Operating Platform.

Disaster recovery protects tenant business data, restores critical capabilities, and provides a controlled response to infrastructure, data, provider, and regional failures.

---

# Design Goals

- Preserve PostgreSQL data as the authoritative business record.
- Restore critical commerce operations predictably.
- Limit data loss and recovery time according to agreed objectives.
- Recover without breaking tenant isolation or auditability.
- Provide tested, observable, and owned recovery procedures.
- Support graceful degradation when non-authoritative infrastructure fails.

---

# Design Principles

## PostgreSQL Is the Recovery Priority

PostgreSQL contains the authoritative business state, audit records, and durable operational metadata. Backup, replication, restore verification, and access protection prioritize PostgreSQL.

Redis is infrastructure. Cache data may be rebuilt and job coordination may be recovered from durable state and controlled replay procedures.

## Recovery Objectives Are Capability-Aware

Recovery time and recovery point objectives are defined for critical business capabilities, not only for servers.

Sales, payments, inventory integrity, tenant access, and offline synchronization require explicit recovery priorities.

## Controlled Recovery

Recovery actions are performed through documented runbooks with clear ownership, authorization, audit trails, and verification steps.

## Restore Before Replay

Authoritative data is restored and verified before replaying jobs, rebuilding projections, restoring search, or resuming external side effects.

---

# Architecture Overview

```text
Incident Detected
↓
Assess Scope and Activate Runbook
↓
Restore and Verify PostgreSQL
↓
Restore Required Infrastructure
↓
Rebuild Cache and Search Projections
↓
Resume Jobs, Events, and External Integrations
↓
Validate Tenant Capabilities
```

Recovery order protects durable business state before derived data and asynchronous processing.

---

# Core Concepts

## Backup and Restore

Backups are encrypted, access-controlled, retained according to policy, and regularly restored into an isolated verification environment.

Successful backup creation is not sufficient evidence of recoverability. Restore exercises verify data integrity, access, application compatibility, and recovery duration.

## Failure Classes

- Application instance failure
- Redis cache or queue failure
- PostgreSQL degradation or data loss
- Object storage or file-processing failure
- Search infrastructure failure
- External provider outage
- Region or hosting-provider outage
- Security incident requiring containment

Each class has documented capability impact, owner, communication path, and recovery procedure.

## Derived Data Recovery

Cache entries, search documents, dashboard projections, and other derived read models are rebuilt from PostgreSQL and completed Domain Events where applicable.

Jobs and event consumers resume only after duplicate-delivery and external-side-effect risks are assessed.

## Offline Recovery

Offline clients retain pending work and reconcile against restored authoritative state. Recovery procedures must preserve conflict resolution and avoid treating client caches as server truth.

---

# Lifecycle / Flow

```text
Detect and Triage Incident
↓
Contain Further Damage
↓
Restore Authoritative Data
↓
Verify Tenant Isolation and Critical Invariants
↓
Rebuild Derived Infrastructure
↓
Resume Controlled Processing
↓
Post-Incident Review and Improvement
```

The platform remains in a degraded or restricted mode until verification confirms that critical business capabilities are safe to resume.

---

# Best Practices

- Define and review recovery objectives with product and operations owners.
- Test backup restoration on a regular schedule.
- Keep runbooks versioned, accessible, and exercised.
- Monitor backup health, replication lag, and restore readiness.
- Practice dependency and regional failure scenarios.
- Protect recovery credentials with least privilege.
- Communicate tenant impact using accurate, verified information.
- Record post-incident actions and turn repeatable findings into architecture or test improvements.

---

# Architecture Rules

- PostgreSQL recovery takes precedence over cache, search, and queue recovery.
- Redis is never treated as the only copy of business state.
- Derived data must be rebuildable from authoritative sources.
- Recovery actions must preserve Organization and Branch isolation.
- Event and job replay must be idempotent and controlled.
- No recovery procedure may bypass authorization or audit requirements.
- Plugins must not introduce unrecoverable state outside approved platform recovery boundaries.
- Disaster recovery exercises must validate offline-first reconciliation for critical workflows.

---

# Related Documents

- backend/04-database-design.md
- backend/05-event-architecture.md
- backend/06-caching-architecture.md
- backend/07-observability-architecture.md
- backend/09-background-jobs-architecture.md
- backend/11-file-storage-architecture.md
- backend/13-deployment-architecture.md
- backend/14-testing-strategy.md
