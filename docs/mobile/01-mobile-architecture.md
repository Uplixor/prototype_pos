# 01. Mobile Architecture

> Status: Draft
> Owner: Mobile Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the React Native architecture for the mobile Commerce Operating Platform.

The mobile application is offline-first and capability-driven while the server remains authoritative for business decisions.

---

# Design Goals

- Support reliable use during intermittent connectivity.
- Protect tenant data on shared and managed devices.
- Compose mobile workflows from platform capabilities.
- Provide responsive POS and operational workflows.
- Reconcile safely with authoritative server state.

---

# Design Principles

## Local Data Supports Work, Not Authority

The device stores the minimum tenant-scoped data required for offline use. Local data enables work and display; PostgreSQL remains the source of truth after synchronization.

## Capability Modules

Mobile screens and local projections are grouped by capability. They consume public API and synchronization contracts rather than backend internals.

## Secure Device Context

Identity, Organization, Branch, permissions, capabilities, and device session are resolved before protected local data is accessed.

---

# Architecture Overview

```text
Mobile Application Shell
↓
Secure Identity and Tenant Context
↓
Capability Modules and Local Read Models
↓
Pending Mutation Queue
↓
Synchronization Client
↓
Public Backend Contracts
```

---

# Core Concepts

## Application Shell

The shell owns startup, authentication, Organization and Branch context, connectivity, local database lifecycle, capability navigation, and recovery status.

## Local Read Models

Local read models are scoped to the authenticated Organization and only contain data permitted for offline use. They are versioned and replaceable through synchronization.

## Pending Work

User actions collected offline are represented as explicit pending mutations with identity, tenant scope, ordering, timestamp, and retry state.

## Device Capabilities

Scanning, printing, camera, storage, and network access are accessed through adapter boundaries. Device-specific behavior does not alter core commerce rules.

---

# Lifecycle / Flow

```text
Authenticate and Authorize Device Session
↓
Load Tenant-Scoped Local Data
↓
Perform Permitted Capability Work
↓
Queue Pending Mutation When Offline
↓
Synchronize and Reconcile When Connected
```

---

# Best Practices

- Minimize locally stored sensitive data.
- Encrypt protected local storage using approved device controls.
- Make pending, synced, rejected, and conflict states visible.
- Preserve user input through app restarts and connectivity loss.
- Test low-bandwidth, offline, background, and device-restart scenarios.
- Clear tenant data safely on sign-out or access removal.

---

# Architecture Rules

- Mobile clients never own Aggregate business rules.
- All durable decisions are validated through public backend contracts.
- Local data, files, and queues must be tenant-scoped.
- Offline-first is mandatory for supported mobile workflows.
- Real-time updates complement but never replace synchronization.
- Plugins use approved mobile extension boundaries only.

---

# Related Documents

- architecture/07-offline-sync.md
- architecture/06-permission-system.md
- backend/08-security-architecture.md
- backend/10-real-time-architecture.md
- product/02-capability-catalog.md
