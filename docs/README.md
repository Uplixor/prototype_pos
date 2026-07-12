# Documentation Map

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This directory records the decisions and constraints that define the Commerce Operating Platform.

Use this map to find the document that owns a decision before changing a capability, workflow, module boundary, or platform rule.

---

# Where To Start

Read these documents first when joining the project:

1. [Platform System Flow](architecture/00-platform-system-flow.md) shows what the product does and how its completed facts move through the platform.
2. [Product vocabulary](product/01-ubiquitous-language.md) defines the terms used in code, events, and product decisions.
3. [Capability catalog](product/02-capability-catalog.md) defines what the platform can enable without creating industry-specific forks.
4. [Bounded contexts](domain/01-bounded-contexts.md) defines ownership of business concepts.
5. [Clean architecture](architecture/01-clean-architecture.md) and [module architecture](architecture/03-module-architecture.md) define dependency and communication boundaries.
6. [Critical business workflows](product/04-critical-business-workflows.md) defines the end-to-end outcomes the platform must preserve.

---

# Reading Rules

- Product and Domain documents define business meaning and invariants.
- Module documents define ownership and rules for a specific capability.
- Architecture documents define platform-wide constraints and cross-module contracts.
- Backend documents define operational decisions for backend capabilities.
- ADRs record decisions that future contributors must not silently reverse.
- Research documents provide evidence and context; they do not override accepted architectural decisions.

When documents conflict, use this order:

1. Accepted ADR
2. Product vocabulary and Domain ownership
3. Module decision
4. Cross-cutting architecture decision
5. Backend, frontend, or mobile implementation boundary
6. Research material

---

# Product Documents

| Document | Use it to decide |
|---|---|
| [01. Ubiquitous Language](product/01-ubiquitous-language.md) | The canonical name and meaning of a business term. |
| [02. Capability Catalog](product/02-capability-catalog.md) | Whether a requirement is core, optional, configurable, or suitable for a plugin. |
| [03. MVP Scope and Roadmap](product/03-mvp-scope-and-roadmap.md) | Delivery phase, exclusions, and capability sequencing. |
| [04. Critical Business Workflows](product/04-critical-business-workflows.md) | The business outcome, ownership, and cross-module impact of critical workflows. |
| [05. MVP Product Requirements and Design Brief](product/05-mvp-product-design-brief.md) | The screens, roles, states, navigation, and flows to prototype for the MVP. |
| [06. Visual Design and Responsive Prototype Specification](product/06-visual-design-and-responsive-spec.md) | The visual language, image strategy, responsive layouts, and prototype test requirements. |

---

# Domain Documents

| Document | Use it to decide |
|---|---|
| [01. Bounded Contexts](domain/01-bounded-contexts.md) | Which domain owns a business concept and which context may depend on it. |
| [02. Aggregates](domain/02-aggregates.md) | Which Aggregate enforces a business invariant and owns a state transition. |
| [03. Entities](domain/03-entities.md) | Which business objects have durable identity and lifecycle. |
| [04. Value Objects](domain/04._value_objects.md) | Which business values are immutable and validated as a whole. |
| [05. Domain Events](domain/05-domain-events.md) | Which completed business facts can cross module boundaries. |
| [06. Domain Services](domain/06-domain-services.md) | Where business policy belongs when no Aggregate can own it alone. |

---

# Module Documents

| Document | Use it to decide |
|---|---|
| [Catalog](modules/catalog.md) | Product lifecycle, sellability, variants, and historical catalog integrity. |
| [Sales](modules/sales.md) | Sale lifecycle, completion, commercial snapshots, and correction rules. |
| [Payments](modules/payments.md) | Payment, refund, provider reconciliation, and financial immutability rules. |
| [Inventory](modules/inventory.md) | Stock Movement, receipt, availability, count, transfer, batch, and expiry rules. |
| [Operations](modules/operations.md) | Tables, reservations, kitchen, fulfillment, delivery, and Branch operational state. |
| [Reporting](modules/reporting.md) | Report ownership, financial facts, projection freshness, and export audit requirements. |

---

# Architecture Documents

| Document | Use it to decide |
|---|---|
| [00. Platform System Flow](architecture/00-platform-system-flow.md) | What the product looks like, how its MVP flows work, and how core facts move across modules. |
| [01. Clean Architecture](architecture/01-clean-architecture.md) | Allowed dependency direction and layer responsibilities. |
| [02. Application Layer](architecture/02-application-layer.md) | Public use-case ownership, transaction boundaries, and orchestration constraints. |
| [03. Module Architecture](architecture/03-module-architecture.md) | Module isolation, ports, adapters, and allowed collaboration paths. |
| [04. Persistence](architecture/04-persistence.md) | Data ownership, transaction, audit, locking, and persistence boundaries. |
| [05. API Design](architecture/05-api-design.md) | Public API consistency, lifecycle, and consumer constraints. |
| [06. Permission System](architecture/06-permission-system.md) | Role, permission, Organization, Branch, and capability access decisions. |
| [07. Offline Sync](architecture/07-offline-sync.md) | Offline command, synchronization, conflict, and reconciliation rules. |
| [08. Plugin System](architecture/08-plugin-system.md) | Plugin extension boundaries and core-domain protection. |
| [09. Project Structure](architecture/09-project-structure.md) | Repository ownership and placement of new code or documentation. |
| [10. Multi-Tenancy](architecture/10-multi-tenancy-architecture.md) | Organization and Branch data isolation across every platform boundary. |
| [11. CQRS](architecture/11-cqrs-architecture.md) | Command ownership, read-model projections, and consistency expectations. |
| [12. Integration](architecture/12-integration-architecture.md) | Provider adapter, webhook, retry, credential, and reconciliation constraints. |
| [13. Resilience](architecture/13-resilience-architecture.md) | Failure isolation, degradation, retry, and recovery decisions. |
| [14. Configuration and Capability Management](architecture/14-configuration-and-capability-management.md) | Entitlement, capability enablement, configuration precedence, and lifecycle. |
| [15. MVP Permission Catalog](architecture/15-permission-catalog.md) | The permission codes and default role grants that the MVP must enforce. |

---

# Backend Documents

| Document | Use it to decide |
|---|---|
| [01. Backend Architecture](backend/01-backend-architecture.md) | Backend module boundaries and platform responsibilities. |
| [02. Tech Stack](backend/02-tech-stack.md) | Approved technologies and their intended platform role. |
| [03. Coding Standards](backend/03-coding-standards.md) | Backend code consistency and contribution expectations. |
| [04. Database Design](backend/04-database-design.md) | PostgreSQL ownership, audit, transaction, and schema constraints. |
| [05. Event Architecture](backend/05-event-architecture.md) | Event ownership, payload, delivery, and consumer constraints. |
| [06. Caching Architecture](backend/06-caching-architecture.md) | Eligible cache data, invalidation, and Redis failure behavior. |
| [07. Observability Architecture](backend/07-observability-architecture.md) | Logs, metrics, traces, operational context, and alerts. |
| [08. Security Architecture](backend/08-security-architecture.md) | Authentication, authorization, tenant protection, and audit rules. |
| [09. Background Jobs Architecture](backend/09-background-jobs-architecture.md) | Job ownership, retry, idempotency, and failure handling. |
| [10. Real-Time Architecture](backend/10-real-time-architecture.md) | Authorized change delivery and reconnect behavior. |
| [11. File Storage Architecture](backend/11-file-storage-architecture.md) | File lifecycle, ownership, delivery, scanning, and retention. |
| [12. Search Architecture](backend/12-search-architecture.md) | Search projection ownership, indexing, and authorization. |
| [13. Deployment Architecture](backend/13-deployment-architecture.md) | Runtime roles, rollout, configuration, and deployment safety. |
| [14. Testing Strategy](backend/14-testing-strategy.md) | Required test boundaries for business and operational risk. |
| [15. Disaster Recovery](backend/15-disaster-recovery.md) | Recovery priority, restore order, and derived-data rebuilding. |

---

# Client Documents

| Document | Use it to decide |
|---|---|
| [Frontend Architecture](frontend/01-frontend-architecture.md) | Web capability composition, tenant context, and backend boundary. |
| [Frontend State Management](frontend/02-state-management-and-data-fetching.md) | Server state, local presentation state, mutation, and refresh rules. |
| [Mobile Architecture](mobile/01-mobile-architecture.md) | Mobile capability boundaries, device context, local data, and sync responsibilities. |
| [Offline Data and Conflict Handling](mobile/02-offline-data-and-conflict-handling.md) | Pending mutation, conflict, and reconciliation behavior on devices. |

---

# Development Documents

| Document | Use it to decide |
|---|---|
| [01. Local Development](development/01-local-development.md) | Local service, seed-data, environment, and isolation requirements. |
| [02. Development Workflow](development/02-development-workflow.md) | Required decisions and review checks before implementing a change. |
| [03. Module Development](development/03-module-development.md) | Whether a new module is justified and how its boundary is defined. |
| [04. Testing Workflow](development/04-testing-workflow.md) | The invariant, tenant, offline, and failure coverage required for a change. |
| [05. Release Workflow](development/05-release-workflow.md) | Migration, compatibility, rollback, and recovery requirements. |

| [MVP Feature Build Guides](implementation/README.md) | Step-by-step scope, schema, invariants, build order, and acceptance checks for each MVP feature set. |

---

# Build Planning and Data Model

| Document | Use it to decide |
|---|---|
| [MVP Feature Plan](features/01-mvp-feature-plan.md) | Which capability is built first and what must be proven before advancing. |
| [Domain Data Model](data/01-domain-data-model.md) | The records, ownership, immutability, and references required before schema design. |
| [Database Schema Blueprint](data/02-database-schema-blueprint.md) | The MVP record relationships, required references, uniqueness, and schema constraints. |
| [MVP DB Diagram](data/commerce-platform-mvp.dbml) | Importable dbdiagram.io model for the MVP tenant, catalog, sales, payment, purchasing, and inventory flow. |

---

# Delivery Documents

| Document | Use it to decide |
|---|---|
| [01. Project Bootstrap](delivery/01-project-bootstrap.md) | The foundations required before any product feature begins. |
| [02. MVP Delivery Sequence](delivery/02-mvp-delivery-sequence.md) | Which feature phase is built first and the gate for moving to the next phase. |
| [03. Team Workstream Ownership](delivery/03-team-workstream-ownership.md) | How three developers work in parallel without splitting domain ownership. |

---

# Decision Records and Research

| Area | Use it to decide |
|---|---|
| [ADRs](adr/) | Why an accepted platform decision was made and what alternatives were rejected. |
| [Market Research](research/00-market-research.md) | The market problem and platform opportunity. |
| [Competitor Analysis](research/01-competitor-analysis.md) | Product differentiation and constraints observed in alternatives. |
| [Business Capability Research](research/02-business-capability-research.md) | Evidence for the capability-first platform model. |
| [Domain Research](research/03-domain-research.md) | Domain classification and cross-industry business patterns. |
| [User Personas](research/04-user-personas.md) | User roles, operating context, and needs. |
| [Jobs To Be Done](research/05-jobs-to-be-done.md) | User outcomes that capabilities and workflows must support. |
| [Changelog](CHANGELOG.md) | Material documentation and platform decision changes over time. |

---

# Case Studies

| Document | Use it to decide |
|---|---|
| [Cafe POS and Dashboard Case Study](case_study/tiya_dashboard_case_study.md) | Reference workflows, screens, and operational capabilities observed in an existing cafe POS product. It is research input, not a source of platform rules. |
| [Case Study Screenshots](case_study/screenshots/) | Visual evidence supporting the case study's workflow and capability observations. |

Case studies may inform product discovery and capability prioritization. They must not introduce restaurant-specific concepts into core domains without a documented capability decision.

---

# Contribution Rules

- Update the owning document when changing an established platform decision.
- Create an ADR before changing a decision with cross-module, data-lifecycle, security, or tenant-isolation impact.
- Add a module document before introducing a new core business capability.
- Add or update product vocabulary before naming a new business concept.
- Add offline, permission, audit, event, and plugin implications to every new capability decision.
- Do not use a document to redefine a decision owned by another Bounded Context.
