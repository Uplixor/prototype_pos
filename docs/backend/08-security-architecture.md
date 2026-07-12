# 08. Security Architecture

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the security architecture of the Commerce Operating Platform.

Security protects tenant data, business operations, identities, integrations, and platform infrastructure while preserving the platform's modular and offline-first design.

---

# Design Goals

- Enforce tenant isolation.
- Apply least-privilege access.
- Protect data in transit and at rest.
- Make security-sensitive operations auditable.
- Support secure offline and mobile operation.
- Limit the impact of compromised credentials or integrations.

---

# Design Principles

## Defense in Depth

Authentication, authorization, validation, tenant scoping, auditability, transport security, and infrastructure controls work together. No individual control is assumed sufficient.

## Deny by Default

Access is denied unless an authenticated identity has the required permission, tenant scope, Branch scope, and capability access.

## Authorization Is a Business Boundary

Authorization is enforced at public Application Service boundaries and on sensitive read models. Aggregates enforce business rules after access is granted.

## Secure by Design

Security requirements are part of capability design. They are not deferred to controllers, client applications, or infrastructure configuration alone.

---

# Architecture Overview

```text
Identity
↓
Authentication
↓
Tenant, Branch, Capability, and Permission Resolution
↓
Public Application Service
↓
Aggregate Business Rules and PostgreSQL
```

Every request and asynchronous operation carries an authenticated or service identity and an explicit tenant context.

---

# Core Concepts

## Authentication

Authentication establishes an identity for users, devices, services, and supported integrations.

Credentials, tokens, and signing material are handled only by security infrastructure. They are never stored in application logs, cache keys, Domain Events, or client-visible error messages.

## Authorization

Authorization evaluates:

- Organization membership
- Branch access
- Role and permission grants
- Capability availability
- Resource ownership where applicable
- Service or plugin scope for non-user operations

Permissions are tenant-scoped. A permission in one Organization grants no access to another Organization.

## Tenant Isolation

Organization scope is mandatory for persisted data, cached representations, queries, jobs, events, files, and search documents.

The platform must validate tenant scope independently of client-supplied identifiers.

## Data Protection

Sensitive data is protected in transit and at rest using platform-approved controls.

Data classification determines retention, access controls, logging rules, and operational handling. Payment information and secrets receive stricter handling than ordinary operational data.

## Auditability

Security-sensitive actions are recorded as durable audit information.

Examples include role changes, permission changes, access revocation, capability changes, credential rotation, and privileged data access.

---

# Lifecycle / Flow

```text
Request or Asynchronous Work
↓
Establish Identity
↓
Resolve Trusted Tenant Context
↓
Authorize Action and Capability
↓
Execute Public Application Service
↓
Record Security-Relevant Outcome
```

Offline clients must re-establish identity and permissions during synchronization. Local data is treated as tenant-scoped and protected according to device security requirements.

---

# Best Practices

- Enforce authorization server-side for every protected operation.
- Use short-lived, revocable credentials where appropriate.
- Validate all untrusted input at boundaries.
- Rotate secrets and integration credentials.
- Use least-privilege service identities.
- Keep security errors non-enumerating and safe for clients.
- Review permissions when capabilities or plugins are introduced.
- Include security events in incident response procedures.

---

# Architecture Rules

- Multi-tenancy is mandatory for every backend boundary.
- PostgreSQL remains the source of truth for authorization state and audit records.
- Redis must not be the sole source of authorization or session correctness.
- Business logic never exists in controllers, repositories, or security adapters.
- Modules expose protected operations through public Application Services only.
- Domain Events and jobs must preserve trusted tenant and actor context.
- Plugins extend through approved public contracts and cannot bypass core authorization.
- Secrets, credentials, and payment data must never be placed in logs, cache entries, or Domain Events.
- Security controls must fail closed when authorization cannot be evaluated.

---

# Related Documents

- architecture/05-api-design.md
- architecture/06-permission-system.md
- architecture/07-offline-sync.md
- architecture/08-plugin-system.md
- backend/06-caching-architecture.md
- backend/07-observability-architecture.md
- backend/15-disaster-recovery.md
