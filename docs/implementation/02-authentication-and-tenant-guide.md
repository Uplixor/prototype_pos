# 02. Authentication and Tenant Foundation Guide

> Status: Draft
> Owner: Foundation Workstream
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Why This Exists

Every later commerce action must know who acted, for which Organization, at which Branch, with which permission. This is the platform's first non-negotiable business boundary.

---

# Dependencies and Exclusions

Requires Project Bootstrap.

Build Organization, Branch, User, Membership, Role, Permission, and Capability Enablement. Do not build Product, Sale, Payment, or Inventory records yet.

---

# Database Scope

| Owns | Required Rules |
|---|---|
| `organizations` | One immutable tenant owner for every future business record. |
| `branches` | Cannot be reassigned to another Organization. |
| `users` | Identity is global; business access is not. |
| `organization_memberships` | One active membership per User and Organization. |
| `roles`, `permissions`, `role_permissions` | Permission definitions are stable; grants are explicit. |
| `membership_roles` | Branch limitation is explicit; null means all Organization Branches. |
| `organization_capabilities` | Enablement is durable and server-evaluated. |

Every foreign reference introduced later must be checked to belong to the active Organization context.

---

# Build Steps

1. Implement Organization and Branch creation under platform-authorized flow.
2. Implement User identity and Organization Membership lifecycle.
3. Implement roles, permissions, and Membership role grants.
4. Resolve trusted Organization and Branch context after authentication.
5. Enforce permission and capability checks at public Application Service boundaries.
6. Record audit outcomes for role, permission, Branch, and capability changes.
7. Build web Organization and Branch selection only from authorized Memberships.
8. Add two-tenant tests for every protected query and command.

---

# Invariants

- A client-supplied Organization ID is never trusted without Membership validation.
- A Branch must belong to the active Organization.
- Capability visibility in the web app never replaces server authorization.
- Revoked Membership immediately prevents new business actions.
- Redis may cache permission projections but PostgreSQL is authoritative.

---

# Events and Acceptance

Record durable outcomes for OrganizationCreated, BranchCreated, MembershipGranted, MembershipRevoked, RoleChanged, and CapabilityChanged.

This guide is complete when an authorized user can enter one Organization and Branch, while attempts to read or mutate another Organization are denied and audited.

---

# Related Documents

- ../architecture/06-permission-system.md
- ../architecture/10-multi-tenancy-architecture.md
- ../modules/sales.md
- ../data/commerce-platform-mvp.dbml
