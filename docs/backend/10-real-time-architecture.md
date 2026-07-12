# 10. Real-Time Architecture

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines real-time communication for the Commerce Operating Platform.

Real-time delivery improves awareness of completed business changes. It complements, but never replaces, durable persistence and offline synchronization.

---

# Design Goals

- Deliver relevant updates with low latency.
- Preserve tenant, Branch, permission, and capability boundaries.
- Support multiple backend instances.
- Recover safely from disconnection and missed messages.
- Keep business operations independent of client connection state.

---

# Design Principles

## Persistence Before Delivery

PostgreSQL is the source of truth. A real-time message is emitted only after the corresponding business operation has completed successfully.

## Real-Time Is a Hint

Clients treat real-time messages as signals to refresh or reconcile read models. They do not treat a transient connection as a complete event history.

## Event-Driven Publication

Domain Events trigger real-time publication through an adapter or subscriber. Modules do not send messages directly to client connections.

## Authorized Subscriptions

Subscriptions are scoped to authenticated identity, Organization, Branch, permission, and capability. A client can receive only data it is authorized to read.

---

# Architecture Overview

```text
Aggregate Business Operation
↓
PostgreSQL Transaction Completes
↓
Domain Event
↓
Real-Time Publisher
↓
Authorized Organization or Branch Channel
↓
Connected Clients
```

Redis may coordinate delivery across instances. It remains infrastructure and is not a durable event store.

---

# Core Concepts

## Message Scope

Messages are delivered to the narrowest authorized audience.

- Organization-wide operational updates
- Branch-specific sales and fulfillment updates
- User-specific notifications
- Capability-specific updates

## Message Content

Messages contain identifiers, event names, versions, timestamps, and minimal change context. Clients retrieve authoritative detail through permitted read paths.

Messages must not expose secrets, payment data, or data outside the recipient's authorization scope.

## Connection Recovery

Clients may disconnect, reconnect, duplicate messages, or receive messages out of order.

Offline synchronization and standard read APIs reconcile durable state after reconnection. Real-time delivery is never the sole recovery mechanism.

---

# Lifecycle / Flow

```text
Client Connects
↓
Authenticate and Resolve Tenant Scope
↓
Authorize Subscriptions
↓
Receive Relevant Change Signals
↓
Refresh or Reconcile Authoritative State
```

For sensitive changes such as permission revocation, subscriptions must be re-evaluated promptly and delivery must stop when access is removed.

---

# Best Practices

- Publish business facts, not commands.
- Keep messages small and versioned.
- Use stable message names from the ubiquitous language.
- Design clients for duplicate and out-of-order delivery.
- Apply backpressure and rate limits to protect the platform.
- Monitor connection count, delivery failures, and latency.
- Use offline sync for durable reconciliation.

---

# Architecture Rules

- Real-time delivery never replaces PostgreSQL or offline synchronization.
- Business logic never exists in connection handlers or publishers.
- Real-time publishers consume Domain Events or public Application Services only.
- All channels and messages must be tenant-scoped and authorized.
- A disconnected client must not block a business operation.
- Redis is infrastructure and not a durable message history.
- Plugins may publish through approved contracts but cannot bypass authorization or core channel ownership.

---

# Related Documents

- backend/05-event-architecture.md
- backend/07-observability-architecture.md
- backend/09-background-jobs-architecture.md
- architecture/05-api-design.md
- architecture/06-permission-system.md
- architecture/07-offline-sync.md
