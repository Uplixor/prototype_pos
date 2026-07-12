# 05. Release Workflow

> Status: Draft
> Owner: Engineering Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This document defines release decisions that protect tenant data, immutable commerce history, and asynchronous consumers.

---

# Release Admission

A release with persisted-state changes declares:

- Backward compatibility with running clients and workers.
- Database migration and rollback implications.
- Event and job payload compatibility.
- Projection, cache, search, and file-processing impact.
- Tenant and permission impact.
- Monitoring and recovery signals.

---

# Migration Rules

- Migrations preserve completed Sales, Payments, Refunds, Stock Movements, and audit history.
- A migration never derives financial history from current Catalog configuration.
- New required fields have a safe compatibility path for existing records.
- Derived projections are rebuilt only after authoritative PostgreSQL data is verified.

---

# Rollback Rules

- Rollback is planned before release approval.
- Event consumers and jobs tolerate older and newer compatible payloads during rollout.
- External side effects are reconciled, not blindly replayed.
- Redis recovery never replaces PostgreSQL restoration.

---

# Architecture Rules

- A release cannot bypass authorization, audit, or tenant isolation checks.
- Irreversible data changes require an ADR and tested restore procedure.
- Production rollout is observable by capability and dependency.
