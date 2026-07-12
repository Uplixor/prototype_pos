# 14. Configuration and Capability Management

> Status: Draft
> Owner: Platform Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines how Organizations configure platform behavior and enable approved capabilities.

Configuration adapts reusable commerce capabilities without changing core domain rules.

---

# Design Goals

- Support safe Organization and Branch variation.
- Make configuration ownership and precedence explicit.
- Control capability rollout and access.
- Preserve auditability and tenant isolation.
- Avoid industry-specific forks of core modules.

---

# Design Principles

## Configuration Does Not Redefine the Domain

Configuration selects supported policies, templates, providers, and workflow options. It does not alter Aggregate invariants or create hidden behavior.

## Capability State Is Explicit

An enabled capability has an owner, entitlement, configuration, authorization policy, and lifecycle state.

## Scoped Precedence

Configuration follows explicit precedence: platform default, Organization setting, Branch override when supported, then authorized user preference for presentation-only concerns.

---

# Architecture Overview

```text
Platform Default
↓
Organization Configuration
↓
Branch Override When Supported
↓
Authorized Capability Behavior
```

Configuration is loaded through public Application Services or approved read models. Caching may optimize reads but PostgreSQL remains authoritative.

---

# Core Concepts

## Configuration Categories

- Commerce: currency, tax, pricing, receipt, and order settings
- Operations: business hours, tables, printers, and fulfillment options
- Integration: approved provider connection and lifecycle settings
- Capability: enablement, rollout state, and supported options
- Presentation: language, locale, and display preferences

## Capability Lifecycle

- Proposed: evaluated but unavailable.
- Enabled: available to an Organization under its policy.
- Suspended: new use is restricted while history remains available.
- Disabled: unavailable for new use.
- Retired: removed through a documented migration and retention process.

## Change Governance

Sensitive configuration changes require authorized actors, validation, audit records, and completed Domain Events for dependent projections.

---

# Lifecycle / Flow

```text
Authorized Change Request
↓
Validate Tenant, Capability, and Policy
↓
Persist Configuration in PostgreSQL
↓
Publish Completed Change Event
↓
Refresh Authorized Read Models
```

---

# Best Practices

- Keep settings small, typed by business meaning, and documented.
- Define whether each setting is Organization, Branch, or user scoped.
- Use migration plans for incompatible configuration changes.
- Audit entitlement, capability, provider, and financial-setting changes.
- Test disabled and partially configured capability states.

---

# Architecture Rules

- PostgreSQL is the source of truth for configuration and entitlement.
- Configuration must be tenant-scoped and authorization-controlled.
- Aggregates retain ownership of business rules regardless of configuration.
- Modules use Domain Events or public Application Services for configuration changes.
- Redis may cache configuration but cannot be authoritative.
- Plugins may add approved configuration only within their extension boundary.

---

# Related Documents

- product/02-capability-catalog.md
- architecture/06-permission-system.md
- architecture/08-plugin-system.md
- backend/06-caching-architecture.md
- backend/08-security-architecture.md
