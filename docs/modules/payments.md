# Payments Module

> Status: Draft
> Owner: Payments Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

Payments owns the immutable financial transactions that settle, reverse, or refund a Sale.

---

# Decisions

## Payments Are Immutable

A recorded Payment is never edited or deleted. A correction creates a new Payment, reversal, or Refund transaction linked to the original financial fact.

This preserves settlement history, cashier accountability, provider reconciliation, and financial reporting.

## A Payment Belongs to One Sale

Every payment and refund references one Organization, one Branch, one Sale, one currency, and one payment method.

Cross-Sale payment allocation is not permitted in the core model. Split tender is represented by multiple immutable Payments against the same Sale.

## Provider Confirmation Is Not Platform Truth by Itself

Provider callbacks, QR scans, and terminal notifications are external evidence. Payments validates identity, tenant scope, amount, idempotency, and eligible Sale state before recording a platform outcome.

## Refunds Are New Financial Facts

A refund references the original recorded Payment and cannot exceed its remaining refundable amount. A refund does not erase the sale, payment, or original settlement history.

---

# State Transitions

| State | Meaning | Allowed Outcome |
|---|---|---|
| Initiated | A payment attempt was authorized to start. | Record, fail, or expire. |
| Pending | External confirmation is expected. | Record, fail, or reconcile. |
| Recorded | The platform accepts the payment as received. | Refund through a new transaction. |
| Failed | The attempt did not settle. | Retain for audit; a new attempt may be created. |
| Refunded | A linked refund was recorded. | Original Payment remains immutable. |

---

# Ownership and Contracts

## Payments Owns

- Payment and refund lifecycle
- Financial idempotency and duplicate protection
- Payment-method configuration application
- Provider reconciliation state

## Payments Consumes

- Sale amount and payment eligibility through Sales public contracts
- Authorized payment configuration through Platform contracts
- Provider evidence through integration adapters

## Payments Publishes

- PaymentInitiated
- PaymentReceived
- PaymentFailed
- RefundIssued
- PaymentReconciled

Sales decides the commercial outcome; Payments decides the financial outcome. Neither module writes the other's state.

---

# Offline Decisions

Cash payments may be queued offline only if the Organization permits offline cash recording for the active Branch.

Provider-backed payments require the provider's confirmed outcome and cannot be locally treated as settled. The server rejects duplicate, expired, unauthorized, or over-refunded mutations.

---

# Architecture Rules

- Payment and Refund rules belong only to Payments Aggregates and Domain Services.
- Payment data, credentials, and provider secrets never appear in cache, Domain Events, or logs.
- PostgreSQL is the financial system of record for platform payment facts.
- Redis, job queues, and provider callbacks are not financial truth.
- Payment changes are auditable with actor, Branch, method, and correlation context.
- Plugins cannot bypass refund authority, idempotency, or reconciliation.

---

# Related Documents

- modules/sales.md
- architecture/12-integration-architecture.md
- backend/08-security-architecture.md
- product/04-critical-business-workflows.md
