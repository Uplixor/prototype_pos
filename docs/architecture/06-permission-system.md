# 06. Permission System

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the authorization model of the Commerce Operating Platform.

The permission system controls what actions users can perform within an Organization and Branch.

It is designed to support multiple industries while remaining simple and extensible.

---

# Design Goals

The permission system should be:

- Flexible
- Secure
- Easy to understand
- Capability-aware
- Multi-tenant
- Branch-aware
- Extensible

---

# Authorization Model

The platform uses **RBAC (Role-Based Access Control)**.

Permissions are assigned to Roles.

Roles are assigned to Users.

```
User

↓

Role

↓

Permissions
```

---

# Core Concepts

Organization

Represents a business using the platform.

---

Branch

Represents a physical location belonging to an Organization.

---

User

A person using the system.

Examples

- Owner
- Manager
- Cashier
- Waiter
- Pharmacist

---

Role

A collection of permissions.

Examples

- Owner
- Manager
- Cashier
- Inventory Staff

---

Permission

Represents a single action.

Examples

```
product.read

product.create

product.update

product.archive

sale.create

sale.complete

sale.refund

inventory.adjust

inventory.transfer
```

---

# Permission Naming

Permissions follow the format:

```
resource.action
```

Examples

```
customer.read

customer.create

customer.update

customer.delete

payment.refund

report.view
```

---

# Role Hierarchy

The platform does not enforce a fixed role hierarchy.

Organizations can create custom roles.

Example

```
Owner

Manager

Cashier

Kitchen

Delivery

Inventory Staff
```

---

# Organization Scope

Every user belongs to one Organization.

Users cannot access another Organization's data.

---

# Branch Scope

A user may have access to:

- All Branches
- Selected Branches
- One Branch

Examples

Manager

```
Kathmandu Branch
```

Cashier

```
Pokhara Branch
```

Owner

```
All Branches
```

---

# Capability Awareness

Permissions only exist if the capability is enabled.

Example

Restaurant

```
reservation.create
```

Retail Store

Reservation capability disabled.

Permission unavailable.

---

# Ownership Rules

Some operations may require ownership checks.

Examples

- Edit own profile
- Cancel own draft
- View assigned deliveries

Ownership rules are handled by the Application Layer.

---

# Authentication

Authentication identifies the user.

Authorization determines what the user can do.

Authentication and authorization are separate concerns.

---

# Permission Evaluation

Every request follows this flow.

```
Authenticate User

↓

Load User

↓

Load Role

↓

Load Permissions

↓

Check Branch Access

↓

Execute Request
```

---

# Default Roles

Recommended default roles.

- Owner
- Administrator
- Manager
- Cashier
- Inventory Staff
- Sales Staff

Organizations may create additional roles.

---

# Super Administrator

Reserved for platform administration.

Can manage:

- Organizations
- Billing
- Platform Settings
- Support Tools

Not available inside tenant applications.

---

# Best Practices

- Keep permissions small and reusable.
- Use permissions instead of hardcoded role checks.
- Always verify Organization access.
- Always verify Branch access.
- Audit sensitive operations.

---

# Future Enhancements

Future versions may support:

- Attribute-Based Access Control (ABAC)
- Temporary Permissions
- Time-Based Permissions
- Approval Workflows
- Dynamic Policies
- Field-Level Permissions

---

# Architecture Rules

- Authorization belongs in the Application Layer.
- Aggregates never know about users or roles.
- Controllers never contain authorization logic.
- Roles group permissions.
- Permissions authorize actions.
- Every request must be Organization scoped.

---

# Related Documents

- architecture/02-application-layer.md
- architecture/03-module-architecture.md
- architecture/05-api-design.md
- domain/01-bounded-contexts.md