# ADR-001: Core Capability Model

- **Status:** Accepted
- **Date:** 2026-07-10
- **Decision Makers:** Product Team
- **Related Documents:**
  - research/02-business-capability-research.md
  - domain/01-bounded-contexts.md

---

## Context

The platform aims to support multiple industries including restaurants, cafes, bakeries, retail stores, and pharmacies.

Traditional POS systems model industries separately, resulting in duplicated business logic, inconsistent data models, and increased maintenance costs.

Research indicates that most businesses share the same core business entities while differing primarily in workflows.

---

## Decision

The platform will adopt a three-layer capability model.

```
Core
↓
Capability
↓
Configuration
```

### Core

Core functionality is required by every organization.

Examples:

- Organization
- Branch
- User
- Product
- Customer
- Sale
- Payment
- Inventory

---

### Capability

Capabilities extend the platform with optional business workflows.

Examples:

- Tables
- Kitchen Display
- QR Ordering
- Reservations
- Barcode
- Prescription
- Batch Tracking

---

### Configuration

Configuration customizes behavior without changing the business model.

Examples:

- Currency
- Tax
- Receipt Template
- Payment Providers
- Business Hours

---

## Consequences

### Positive

- Generic domain model
- Easier maintenance
- Less duplicated code
- Supports hybrid businesses
- Easier future expansion
- Cleaner APIs
- Smaller modules

### Negative

- Requires feature flag architecture
- Slightly more complex onboarding
- Capability dependency management becomes important

---

## Alternatives Considered

### Industry-specific modules

Restaurant Module

Retail Module

Pharmacy Module

Rejected because:

- High code duplication
- Difficult maintenance
- Hybrid businesses become difficult

---

### Separate applications

Restaurant App

Retail App

Pharmacy App

Rejected because:

- Multiple codebases
- Duplicate features
- Higher maintenance cost

---

## Architecture Impact

This decision affects:

- Domain Model
- Database Schema
- NestJS Modules
- Permission System
- API Design
- Frontend Navigation

---

## Future Considerations

Future capability packs may include:

- Manufacturing
- Salon
- Hotel
- Clinic
- Service Business

without changing the core platform.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| docs/research/02-business-capability-research.md | Research that led to this decision |
| docs/product/01-ubiquitous-language.md | Product language and concepts |
