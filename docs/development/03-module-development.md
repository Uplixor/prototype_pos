# 03. Module Development

> Status: Draft
> Owner: Engineering Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This document defines the admission rules for a new module or a material change to an existing module.

---

# A Module Is Justified When

- It owns a distinct business lifecycle and vocabulary.
- It owns one or more Aggregates and invariants.
- Other modules need only its public outcomes, not its internal state.
- It can name its Organization, Branch, permission, audit, and offline rules.

A new screen, report, provider, or configuration option does not automatically justify a new module.

---

# Required Module Decisions

Before creation, document:

- Purpose and Bounded Context ownership.
- Aggregate roots and immutable business facts.
- Allowed state transitions and corrections.
- Tenant, Branch, capability, and permission scope.
- Public Application Services and Domain Events.
- Dependencies on existing public contracts.
- Offline mutation and conflict policy.
- Plugin extension policy.

---

# Module Boundary

```text
module/
├── domain/          # Aggregates, Value Objects, domain policies, events
├── application/     # Public use cases and module contracts
├── infrastructure/  # Persistence and provider adapters
└── presentation/    # Transport-specific adapters
```

The module may not expose its persistence model as its public contract.

---

# Architecture Rules

- Modules communicate only through Domain Events or public Application Services.
- A module never writes another module's records.
- Aggregates own business rules and state transitions.
- Plugins consume approved public contracts only.
