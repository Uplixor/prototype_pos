# 01. Frontend Architecture

> Status: Draft
> Owner: Frontend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the web frontend architecture for the Commerce Operating Platform.

The React application provides authorized, capability-driven interfaces without duplicating backend business rules.

---

# Design Goals

- Deliver responsive, mobile-first web workflows.
- Compose interfaces from business capabilities.
- Preserve tenant, Branch, permission, and capability boundaries.
- Keep server state authoritative.
- Support real-time awareness and offline-compatible workflows.

---

# Design Principles

## Capability-Oriented Composition

Navigation, screens, and UI modules are organized by capability such as Catalog, Sales, Inventory, and Reporting rather than by technical layer alone.

## Backend Rules Remain Authoritative

The frontend improves guidance and validation but never owns authorization, financial calculations, inventory invariants, or other domain rules.

## Explicit Context

The active Organization, Branch, user permissions, enabled capabilities, locale, and connectivity state are visible application context.

---

# Architecture Overview

```text
Application Shell
↓
Tenant and Capability Context
↓
Capability Route and Screen
↓
Presentation Components
↓
Public API and Real-Time Clients
```

The frontend depends only on documented public API, authentication, real-time, and file-delivery contracts.

---

# Core Concepts

## Application Shell

The shell establishes authenticated identity, Organization selection, Branch scope, enabled capabilities, navigation, feature visibility, and global error handling.

## Capability Modules

Each capability owns its routes, views, user interactions, presentation state, and integration with permitted public APIs.

Capability modules do not import internal state or implementation from another capability.

## Server and Presentation State

Server state represents authorized backend read models. Presentation state represents transient user interaction such as filters, open panels, and unsaved input.

The two state categories remain separate.

## Real-Time and Offline Awareness

Real-time messages indicate change and trigger safe refresh or reconciliation. Connectivity state guides user experience but does not make the frontend authoritative.

---

# Lifecycle / Flow

```text
User Opens Capability
↓
Resolve Tenant and Permission Context
↓
Load Authorized Read Model
↓
Present Action or Query
↓
Submit Public Command or Refresh Query
↓
Reconcile Result and Change Signals
```

---

# Best Practices

- Use ubiquitous language in routes, labels, and user actions.
- Hide unavailable capabilities while relying on server authorization.
- Keep components focused on one user responsibility.
- Show explicit loading, empty, error, and offline states.
- Preserve input safely when requests fail or connectivity changes.
- Test permission and tenant transitions.

---

# Architecture Rules

- The frontend never implements Aggregate business rules.
- Public APIs are the only backend integration boundary.
- Organization and Branch context must accompany every scoped operation.
- UI capability visibility does not replace server-side authorization.
- Real-time messages never replace authoritative reads or offline sync.
- Plugins extend through approved frontend extension contracts only.

---

# Related Documents

- product/02-capability-catalog.md
- architecture/05-api-design.md
- architecture/06-permission-system.md
- architecture/07-offline-sync.md
- backend/10-real-time-architecture.md
