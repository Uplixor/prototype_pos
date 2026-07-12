# 02. Development Workflow

> Status: Draft
> Owner: Engineering Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This workflow prevents feature delivery from silently changing platform invariants, tenant boundaries, or domain ownership.

---

# Before Implementation

Every feature starts by identifying:

- The capability and Bounded Context owner.
- The Aggregate that accepts or rejects the decision.
- Organization and Branch scope.
- Required permission and capability enablement.
- Offline behavior and conflict outcome.
- Audit records and completed Domain Events.
- Public contracts consumed by other modules or plugins.

If these cannot be identified, the change is not ready for implementation.

---

# Change Sequence

```text
Product workflow decision
↓
Module ownership and invariants
↓
Data ownership and migration impact
↓
Application contract and event impact
↓
Client workflow and offline impact
↓
Tests, review, and release plan
```

---

# Pull Request Rules

- One PR should preserve one coherent business decision.
- Cross-module changes declare every event and public Application Service contract changed.
- New persisted state declares its Organization ownership, audit need, retention, and migration plan.
- New capability state declares enablement, permission, Branch, plugin, and offline rules.
- A PR never introduces direct access to another module's internals.

---

# Review Questions

- Can another Organization see or affect this record?
- Which Aggregate prevents invalid state?
- Does a correction create a new fact or edit history?
- Can duplicate event, job, webhook, or offline delivery cause duplicate effects?
- What happens when Redis, a provider, or connectivity fails?

---

# Architecture Rules

- Documentation changes accompany architectural decisions.
- Accepted ADRs are changed only through a new ADR.
- Business logic does not move into controllers, repositories, jobs, or client applications.
