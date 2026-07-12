# 03. MVP Scope and Roadmap

> Status: Draft
> Owner: Product Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the delivery sequence for the Commerce Operating Platform.

The roadmap delivers reusable commerce capabilities before industry-specific workflows.

---

# Design Goals

- Validate the platform with a useful commerce core.
- Deliver end-to-end value in each phase.
- Avoid premature industry specialization.
- Preserve offline-first and multi-tenant foundations.
- Make scope decisions explicit.

---

# Design Principles

## Outcome Before Feature Count

A phase is complete when a target user can complete a valuable business workflow safely, not when a list of screens exists.

## Foundation Before Acceleration

Tenant isolation, identity, catalog, sales, payment recording, and offline synchronization precede optional workflow capabilities.

## Capability Composition

Later phases enable industries through capability combinations rather than forks of the product.

---

# Architecture Overview

```text
Platform Foundation
↓
Core Commerce MVP
↓
Operational Capabilities
↓
Industry Capability Packs
↓
Ecosystem and Scale
```

---

# Core Concepts

## Phase 0: Platform Foundation

- Organization and Branch lifecycle
- Identity, roles, permissions, and tenant isolation
- Capability enablement and configuration
- Auditability, observability, backups, and deployment baseline
- Mobile and web offline synchronization foundation

## Phase 1: Core Commerce MVP

- Catalog, categories, variants, and pricing
- Customers and suppliers
- Sales, payments, receipts, refunds, and cash controls
- Inventory movements and purchasing
- Essential reports and dashboards

The target outcome is a small business completing a reliable daily sales and stock cycle.

## Phase 2: Operational Workflows

- Discounts, offers, loyalty, and customer credit
- Barcode operations
- Expenses and staff attendance
- Delivery and fulfillment
- Tables, reservations, and kitchen display

## Phase 3: Industry Capability Packs

- Bakery production and recipes
- Pharmacy batches, expiry, and prescription workflows
- Retail scanning and advanced stock operations
- Additional configurable commerce workflows

## Phase 4: Ecosystem and Scale

- Partner integrations and webhooks
- Plugin marketplace foundations
- Advanced analytics and exports
- Regional deployment and enterprise operations

---

# Lifecycle / Flow

```text
Research Insight
↓
Capability Hypothesis
↓
Workflow and Success Measure
↓
Architecture and Offline Impact Review
↓
Phased Delivery
↓
Adoption and Outcome Review
```

---

# Best Practices

- Define a measurable workflow outcome for every roadmap item.
- Deliver vertical slices across mobile, web, backend, and operations.
- Keep unvalidated capabilities behind controlled enablement.
- Record exclusions alongside committed scope.
- Revisit priorities using adoption, reliability, and research evidence.

---

# Architecture Rules

- MVP scope must not compromise tenant isolation or offline-first operation.
- New scope follows capability ownership and public module boundaries.
- Plugins do not substitute for unbuilt core capabilities.
- PostgreSQL remains the source of truth in every delivery phase.
- Roadmap changes require an architecture impact assessment.

---

# Related Documents

- product/02-capability-catalog.md
- research/02-business-capability-research.md
- research/05-jobs-to-be-done.md
- architecture/07-offline-sync.md
- architecture/08-plugin-system.md
