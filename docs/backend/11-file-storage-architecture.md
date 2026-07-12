# 11. File Storage Architecture

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines how the Commerce Operating Platform stores, secures, processes, and serves files.

Files include product images, receipts, exports, documents, attachments, and future capability-specific assets.

---

# Design Goals

- Preserve tenant isolation and authorization.
- Store files durably outside application instances.
- Support asynchronous processing and safe delivery.
- Keep business metadata authoritative in PostgreSQL.
- Allow storage providers to change without affecting core domains.
- Support mobile-first and offline-aware workflows.

---

# Design Principles

## Metadata and Content Are Separate

PostgreSQL stores authoritative file metadata, ownership, lifecycle state, and access relationship. Object storage holds the binary content.

## Files Belong to a Business Context

Each file is owned by an Organization and associated with an authorized business resource or capability. Files do not exist as unscoped global resources.

## Storage Is Infrastructure

Object storage, scanning, transformation, and content delivery are infrastructure adapters. The Domain remains independent of a specific provider.

## Asynchronous Processing

Scanning, transformation, thumbnail generation, and export generation run as background jobs. Upload acceptance does not imply that a file is safe or ready for use.

---

# Architecture Overview

```text
Authorized Application Service
↓
Create File Metadata in PostgreSQL
↓
Upload to Object Storage
↓
Background Scan and Processing
↓
Ready for Authorized Delivery
```

The platform stores a file lifecycle state so clients and modules can distinguish pending, ready, rejected, and removed content.

---

# Core Concepts

## File Metadata

Metadata includes a file identifier, Organization scope, owner or resource reference, content type, size, storage location, lifecycle state, checksum, creation time, and retention policy.

Metadata must not rely on object-store listings for correctness.

## File Lifecycle

- Pending: metadata created and content is not ready.
- Processing: scan or transformation is in progress.
- Ready: content passed required checks and may be served.
- Rejected: content failed validation or security checks.
- Removed: content is no longer available under the retention policy.

## Delivery

Clients receive files only through authorized access paths. Delivery checks Organization, resource relationship, permission, and capability access before issuing access to the content.

Public delivery is allowed only for explicitly public business assets and must be deliberate.

## Retention and Deletion

Retention is defined by business, audit, legal, and operational requirements. Deletion requests update the authoritative lifecycle state before asynchronous physical removal.

---

# Lifecycle / Flow

```text
User Requests Upload
↓
Authorize Tenant and Resource Access
↓
Create Pending Metadata
↓
Store Content
↓
Scan and Process Job
↓
Mark Ready or Rejected
↓
Serve Through Authorized Access
```

Failures are retained with an observable lifecycle outcome. A failed file process must not leave content implicitly available.

---

# Best Practices

- Validate type, size, and ownership before accepting content.
- Generate server-controlled object identifiers.
- Scan untrusted content before making it available.
- Keep files immutable after readiness when possible.
- Use checksums for integrity verification.
- Process large files asynchronously.
- Monitor storage failures, processing backlog, and rejected content.

---

# Architecture Rules

- PostgreSQL is the source of truth for file metadata and lifecycle.
- Object storage is infrastructure and not a business metadata source.
- Every file and object location must be tenant-scoped.
- File authorization must be enforced server-side.
- Binary content must never be stored in Redis.
- File processors may communicate with modules only through Domain Events or public Application Services.
- Plugins may add supported file use cases but cannot bypass file ownership, scanning, or authorization.
- Business logic never exists in storage adapters.

---

# Related Documents

- backend/05-event-architecture.md
- backend/08-security-architecture.md
- backend/09-background-jobs-architecture.md
- backend/13-deployment-architecture.md
- architecture/06-permission-system.md
- architecture/08-plugin-system.md
