# 14. Testing Strategy

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the testing strategy for the Commerce Operating Platform.

Testing protects business rules, tenant isolation, offline synchronization, extension boundaries, and operational reliability as capabilities evolve.

---

# Design Goals

- Verify business behavior at the correct architectural boundary.
- Protect Aggregate invariants and ubiquitous language.
- Detect integration failures across infrastructure dependencies.
- Validate tenant and authorization isolation.
- Keep feedback fast enough for continuous delivery.
- Make production failures reproducible through focused tests.

---

# Design Principles

## Test Behavior, Not Frameworks

Tests describe business outcomes, public Application Service behavior, and architectural contracts. They do not depend on controller structure, ORM internals, or framework-specific implementation details.

## Test at the Lowest Useful Boundary

Domain rules are tested at the Aggregate boundary. Cross-module use cases are tested through public Application Services and Domain Events. Infrastructure behavior is tested through adapter contracts and integration environments.

## Production-Like Dependencies Where It Matters

PostgreSQL, Redis, queue processing, storage, and supported external-provider boundaries require integration coverage appropriate to their risk.

## Deterministic and Tenant-Safe Data

Tests use isolated, explicit data. No test can assume global tenant state or rely on production data.

---

# Architecture Overview

```text
Domain Tests
↓
Application Service Tests
↓
Integration and Adapter Tests
↓
Contract and End-to-End Workflow Tests
↓
Operational Resilience Tests
```

Each layer provides distinct confidence. Higher-level tests do not replace focused verification of Domain invariants.

---

# Core Concepts

## Domain Tests

Domain tests verify Aggregates, Value Objects, policies, state transitions, and Domain Events.

They cover valid decisions, invalid decisions, invariant enforcement, and event emission using business language.

## Application Service Tests

Application Service tests verify use-case orchestration, authorization boundaries, tenant context, transaction outcomes, and collaboration through public module contracts.

## Integration Tests

Integration tests verify persistence, cache behavior, queue handling, storage adapters, event delivery, and external integration adapters.

They verify that PostgreSQL remains authoritative and that Redis failure does not invalidate business correctness.

## End-to-End Workflow Tests

End-to-end tests cover critical journeys such as sales completion, payment recording, inventory adjustment, permission changes, offline synchronization, and recovery from interrupted work.

## Architecture Tests

Architecture tests protect dependency direction and module communication rules.

They verify that business logic does not move into controllers, repositories, or infrastructure, and that modules communicate only through Domain Events or public Application Services.

---

# Lifecycle / Flow

```text
Capability Change
↓
Define Business Acceptance and Risk
↓
Add Domain and Application Coverage
↓
Validate Infrastructure and Cross-Module Contracts
↓
Run Critical Workflow and Regression Suites
↓
Monitor Production Behavior
```

Production incidents result in a focused regression test when a meaningful automated check can prevent recurrence.

---

# Best Practices

- Name tests in ubiquitous language.
- Prefer focused, deterministic tests over broad, brittle suites.
- Include tenant and permission boundaries in every relevant scenario.
- Test idempotency for jobs, events, and offline mutation handling.
- Test failure and retry paths for critical integrations.
- Use realistic lifecycle states for files, payments, and orders.
- Keep test fixtures explicit and minimal.
- Measure flaky tests and treat them as reliability defects.

---

# Architecture Rules

- Aggregates own the tests for their business rules.
- Controllers, repositories, and infrastructure adapters do not become the primary home for business-rule tests.
- PostgreSQL behavior must be verified for critical persistence workflows.
- Redis-dependent tests must prove graceful behavior when cache infrastructure is unavailable.
- Tests must not share tenant state unless the scenario explicitly verifies isolation.
- Plugin tests must verify public extension contracts and must not depend on core internals.
- Offline-first workflows require synchronization, conflict, and recovery coverage.
- Security-sensitive changes require authorization and audit coverage.

---

# Related Documents

- backend/01-backend-architecture.md
- backend/04-database-design.md
- backend/05-event-architecture.md
- backend/08-security-architecture.md
- backend/09-background-jobs-architecture.md
- architecture/06-permission-system.md
- architecture/07-offline-sync.md
