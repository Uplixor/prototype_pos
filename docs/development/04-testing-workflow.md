# 04. Testing Workflow

> Status: Draft
> Owner: Engineering Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

Tests must prove platform decisions, not merely execution paths.

---

# Required Coverage

Every business change tests:

- The Aggregate invariant that accepts or rejects the decision.
- Organization and Branch isolation.
- Permission and capability denial.
- Audit and immutable-history behavior.
- Event, job, webhook, or offline duplicate delivery when applicable.
- Redis, provider, or network degradation when the workflow depends on it.

---

# Workflow Tests

Critical workflows require end-to-end evidence for:

- Completed sales remaining immutable.
- Payments and refunds producing new financial facts.
- Goods receipt, not purchase creation, increasing stock.
- Stock adjustments creating accountable movements.
- Offline mutations receiving an explicit server outcome.

---

# Architecture Rules

- Tests use at least two Organizations for tenant-scoped behavior.
- Tests do not treat cached or projected data as transaction truth.
- Test fixtures preserve business history rather than mutating completed facts.
- A production incident adds a regression test when automation can prevent recurrence.
