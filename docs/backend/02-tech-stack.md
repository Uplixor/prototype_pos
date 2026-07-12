# 02. Tech Stack

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the official backend technology stack for the Commerce Operating Platform.

The selected technologies should provide a strong foundation for scalability, maintainability, developer productivity, and long-term support.

---

# Design Goals

The technology stack should be:

- Stable
- Well documented
- Type-safe
- Cloud-native
- Scalable
- Open source where practical
- Suitable for rapid startup development

---

# Core Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | NestJS |
| Package Manager | pnpm |

---

# API

| Category | Technology |
|----------|------------|
| API Style | REST |
| Documentation | OpenAPI (Swagger) |
| Validation | class-validator |
| Serialization | class-transformer |

Future

- GraphQL
- gRPC

---

# Database

| Category | Technology |
|----------|------------|
| Database | PostgreSQL |
| ORM | Prisma |
| Migrations | Prisma Migrate |

Reasons

- Mature ecosystem
- Excellent TypeScript support
- Strong PostgreSQL integration
- Simple migration workflow

---

# Cache

| Category | Technology |
|----------|------------|
| Cache | Redis |

Used for

- Caching
- Session storage
- Rate limiting
- Distributed locks

---

# Background Jobs

| Category | Technology |
|----------|------------|
| Queue | BullMQ |
| Broker | Redis |

Examples

- Email
- Report generation
- Import jobs
- Export jobs
- Notifications

---

# Object Storage

Development

- MinIO

Production

- Amazon S3
- Cloudflare R2

Used for

- Product Images
- Attachments
- Reports
- Backups

---

# Authentication

- JWT
- Refresh Tokens

Future

- OAuth2
- SSO

---

# Search

Initial

- PostgreSQL Full Text Search

Future

- OpenSearch
- Elasticsearch

---

# Event System

Internal communication

- NestJS Event Emitter (MVP)

Future

- NATS
- Kafka

The event architecture should remain implementation-independent.

---

# Logging

Library

- Pino

Requirements

- Structured logging
- Request IDs
- Correlation IDs

---

# Monitoring

Recommended

- Prometheus
- Grafana

Error Tracking

- Sentry

---

# Testing

| Type | Tool |
|------|------|
| Unit | Jest |
| Integration | Jest |
| E2E | Supertest |

---

# Code Quality

- ESLint
- Prettier
- Husky
- lint-staged

---

# CI/CD

Recommended

- GitHub Actions

Pipeline

- Install
- Lint
- Test
- Build
- Docker Image
- Deploy

---

# Containerization

Development

- Docker Compose

Production

- Docker
- Kubernetes (Future)

---

# Configuration

Environment variables

Examples

- Database
- Redis
- Storage
- JWT
- API Keys

Secrets should never be committed.

---

# Versioning

- Semantic Versioning
- Conventional Commits

---

# Dependency Management

Dependencies should be:

- Actively maintained
- Well documented
- Widely adopted
- Security reviewed

Avoid unnecessary packages.

---

# Future Technologies

Potential additions

- NATS
- Kafka
- OpenSearch
- Temporal
- ClickHouse
- Snowflake

These should only be introduced when justified by business needs.

---

# Best Practices

- Prefer mature technologies.
- Keep the stack small.
- Avoid premature optimization.
- Replace technologies only when necessary.
- Evaluate new dependencies carefully.

---

# Architecture Rules

- NestJS is the standard backend framework.
- PostgreSQL is the primary database.
- Prisma is the only ORM.
- Redis powers caching and queues.
- REST is the public API.
- All services use TypeScript.

---

# Related Documents

- backend/01-backend-architecture.md
- architecture/01-clean-architecture.md
- architecture/04-persistence.md