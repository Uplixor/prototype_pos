# 05. Event Architecture

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the event architecture of the Commerce Operating Platform.

Events allow modules to communicate without tight coupling and provide the foundation for offline synchronization, plugins, reporting, notifications, and future integrations.

---

# Design Goals

The event system should be:

- Decoupled
- Reliable
- Scalable
- Observable
- Extensible
- Easy to understand

---

# Event Types

The platform uses three event types.

## Domain Events

Represent business facts.

Examples

- SaleCompleted
- PaymentReceived
- ProductCreated
- StockAdjusted

---

## Integration Events

Used to communicate with external systems.

Examples

- PaymentGatewayWebhookReceived
- ShopifyOrderImported
- EmailSent

---

## System Events

Represent platform events.

Examples

- UserLoggedIn
- CacheCleared
- PluginInstalled

---

# Event Principles

Events should:

- Describe something that already happened.
- Use business language.
- Be immutable.
- Have a single purpose.
- Be easy to understand.

---

# Event Naming

Use

```
Entity + Past Tense
```

Examples

```
SaleCreated

SaleCompleted

PaymentReceived

ProductArchived

StockAdjusted
```

Avoid

```
CreateSale

UpdateProduct

ProcessPayment
```

---

# Event Flow

```
Business Action

↓

Aggregate

↓

Domain Event

↓

Event Dispatcher

↓

Subscribers

↓

Other Modules
```

---

# Communication

Modules communicate through events.

Example

```
Sales

↓

SaleCompleted

↓

Inventory

CRM

Reporting

Plugins
```

Sales never updates Inventory directly.

---

# Event Ownership

Each event belongs to one bounded context.

Examples

| Event | Owner |
|--------|-------|
| SaleCompleted | Sales |
| StockAdjusted | Inventory |
| ProductCreated | Catalog |
| PaymentReceived | Payments |

---

# Event Payload

Every event should include:

- Event ID
- Event Name
- Aggregate ID
- Organization ID
- Timestamp
- Version
- Payload

Payload should contain only relevant business information.

---

# Event Ordering

Ordering is guaranteed only within the same Aggregate.

Global ordering should not be assumed.

---

# Event Subscribers

Subscribers should:

- Perform one responsibility.
- Be idempotent.
- Handle failures gracefully.
- Never assume execution order across modules.

---

# Failed Events

If event processing fails:

- Retry automatically.
- Log the failure.
- Preserve the original event.
- Notify operators if retries are exhausted.

Events should never be silently discarded.

---

# Event Versioning

Events may evolve.

Changes should remain backward compatible whenever possible.

Breaking changes require a new event version.

---

# Event Storage

Business events should be stored for:

- Audit
- Offline Sync
- Replay
- Debugging
- Reporting

Not every technical event needs permanent storage.

---

# Event Processing

MVP

- In-process event publishing

Future

- NATS
- Kafka

The architecture should allow replacing the event transport without changing business logic.

---

# Event Consumers

Typical consumers include:

- Inventory
- CRM
- Reporting
- Notifications
- Plugins
- Integrations

---

# Best Practices

- Publish events only after successful transactions.
- Keep payloads small.
- Avoid event chains that are difficult to follow.
- Use business terminology.
- Make consumers independent.

---

# Architecture Rules

- Events communicate between modules.
- Events never replace business rules.
- Modules never depend directly on other modules.
- Publish only completed business facts.
- Subscribers should not modify the publishing aggregate.

---

# Related Documents

- backend/01-backend-architecture.md
- architecture/03-module-architecture.md
- architecture/07-offline-sync.md
- architecture/08-plugin-system.md
- domain/05-domain-events.md