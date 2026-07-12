# 13. Deployment Architecture

> Status: Draft
> Owner: Platform Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines how the Commerce Operating Platform is deployed, configured, scaled, and operated across environments.

The deployment architecture supports reliable global operation while keeping application modules independent of hosting providers and runtime frameworks.

---

# Design Goals

- Deploy services independently and repeatably.
- Scale stateless workloads horizontally.
- Protect PostgreSQL as the source of truth.
- Isolate environments and operational credentials.
- Support safe rollout, rollback, and schema evolution.
- Operate reliably across regional and dependency failures.

---

# Design Principles

## Stateless Application Processes

API and worker processes do not retain shared business state locally. Shared durable state belongs in PostgreSQL; shared cache and queue coordination uses Redis infrastructure.

## Immutable, Versioned Releases

Every deployable artifact is versioned and promoted through environments. Runtime configuration is external to the artifact and managed securely.

## Independent Runtime Roles

API services, background workers, schedulers, and real-time gateways can scale and deploy independently while sharing approved Application and Domain contracts.

## Safe Evolution

Database and event changes follow backward-compatible rollout practices. Producers and consumers must coexist during incremental deployment.

---

# Architecture Overview

```text
Clients
↓
Edge and Load Balancing
↓
API and Real-Time Instances
↓
Worker and Scheduler Instances
↓
PostgreSQL + Redis + Object Storage + External Providers
```

Infrastructure dependencies are managed services or equivalent operationally managed components. Their availability and recovery procedures are part of platform operations.

---

# Core Concepts

## Environments

Development, test, staging, and production are isolated. Production credentials, tenant data, and integrations must never be used outside authorized production workflows.

## Configuration and Secrets

Configuration is validated at startup and separated from code. Secrets are supplied through approved secret management and are never placed in source control, logs, cache, or deployment metadata.

## Scaling

Scale API instances by traffic, workers by queue depth and processing latency, and real-time gateways by connection capacity.

PostgreSQL scaling prioritizes correctness, connection management, backups, and query health. Redis scaling does not change its status as infrastructure.

## Rollout and Rollback

Deployments use health checks, controlled rollout, and observable rollback criteria.

Rollback procedures account for database compatibility, queued jobs, Domain Event consumers, and clients running older application versions.

---

# Lifecycle / Flow

```text
Versioned Artifact
↓
Automated Validation
↓
Staged Deployment
↓
Readiness and Health Verification
↓
Controlled Traffic Increase
↓
Observe or Roll Back
```

Production changes are auditable and have an owner, rollback plan, and dependency impact assessment.

---

# Best Practices

- Keep runtime roles independently scalable.
- Use readiness checks before receiving traffic.
- Maintain backward compatibility during staged releases.
- Protect connection pools and database capacity.
- Test restore and rollback procedures regularly.
- Monitor each dependency and deployment version.
- Limit operator privileges using least privilege.

---

# Architecture Rules

- PostgreSQL is the source of truth and requires protected, durable operation.
- Redis is infrastructure for cache and job coordination only.
- No application instance may own unique tenant business state.
- Deployments must preserve tenant isolation and auditability.
- Database evolution must be compatible with rolling application versions.
- Worker and event-consumer deployments must tolerate replay and duplicate delivery.
- Plugins are deployed through approved extension boundaries and cannot alter core domain deployment ownership.
- Infrastructure adapters remain replaceable from the Domain perspective.

---

# Related Documents

- backend/06-caching-architecture.md
- backend/07-observability-architecture.md
- backend/09-background-jobs-architecture.md
- backend/11-file-storage-architecture.md
- backend/15-disaster-recovery.md
- architecture/09-project-structure.md
