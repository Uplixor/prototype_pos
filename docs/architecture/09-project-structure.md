# 09. Project Structure

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the repository structure of the Commerce Operating Platform.

The project is organized as a monorepo to encourage code sharing, maintainability, and independent application development.

---

# Design Goals

The project structure should be:

- Modular
- Scalable
- Easy to navigate
- Framework-independent where possible
- Suitable for multiple frontend applications
- Suitable for multiple backend services
- Easy for new developers to understand

---

# Repository Structure

```
commerce-platform/

├── apps/
├── packages/
├── infrastructure/
├── docs/
├── scripts/
├── tools/
├── .github/
└── README.md
```

---

# Applications

The `apps` directory contains runnable applications.

```
apps/

├── api/
├── web/
├── mobile/
├── admin/
└── docs/
```

---

## API

NestJS Backend.

Responsibilities

- REST API
- Authentication
- Business Logic
- Event Processing
- Background Jobs

---

## Web

React + Vite application.

Responsibilities

- POS
- Dashboard
- Management Portal

---

## Mobile

React Native application.

Responsibilities

- Mobile POS
- Inventory
- Delivery
- Management

---

## Admin

Platform administration.

Responsibilities

- Organization Management
- Billing
- Plugin Management
- Support Tools

---

## Docs

Documentation website.

Examples

- Architecture
- API
- Guides
- ADRs

---

# Packages

Shared code lives inside packages.

```
packages/

├── ui/
├── types/
├── sdk/
├── config/
├── eslint-config/
├── tsconfig/
└── utils/
```

---

## UI

Shared React components.

Examples

- Button
- Modal
- Table
- Form
- Input

---

## Types

Shared TypeScript types.

Examples

- DTOs
- Enums
- API Types

---

## SDK

Client SDK for communicating with the API.

Used by:

- Web
- Mobile
- Future Desktop

---

## Config

Shared configuration.

Examples

- Environment
- Constants
- Feature Flags

---

# Infrastructure

Deployment resources.

```
infrastructure/

├── docker/
├── nginx/
├── terraform/
├── kubernetes/
└── monitoring/
```

Future deployments can reuse these resources.

---

# Documentation

```
docs/

research/

product/

domain/

architecture/

adr/

modules/
```

Documentation evolves with the project.

---

# Scripts

Automation scripts.

Examples

- Database Seed
- Data Import
- Backup
- Release

---

# Tools

Developer tools.

Examples

- Code Generators
- CLI
- Migration Helpers

---

# GitHub

```
.github/

workflows/

ISSUE_TEMPLATE/

PULL_REQUEST_TEMPLATE/
```

Contains CI/CD configuration.

---

# Backend Structure

The backend follows the architecture defined in previous documents.

```
apps/api/src/

identity/

catalog/

inventory/

sales/

payments/

crm/

fulfillment/

reporting/

platform/

shared/

main.ts
```

Each module follows the same internal structure.

```
sales/

application/

domain/

infrastructure/

presentation/

sales.module.ts
```

---

# Frontend Structure

```
apps/web/src/

app/

features/

components/

layouts/

pages/

hooks/

services/

stores/

routes/

assets/

styles/
```

Features should be organized by business capability rather than UI type.

---

# Mobile Structure

```
apps/mobile/src/

app/

features/

components/

navigation/

services/

storage/

hooks/
```

Offline support is a first-class concern.

---

# Shared Development Rules

- Shared code belongs in `packages/`.
- Business logic belongs in the backend.
- UI logic belongs in frontend applications.
- Avoid duplication between Web and Mobile.
- Applications communicate only through public APIs.

---

# Naming Conventions

Directories

```
kebab-case
```

Examples

```
feature-flags

inventory-adjustment
```

TypeScript

```
PascalCase
```

Examples

```
CreateSaleCommand

ProductRepository
```

Files

```
kebab-case.ts
```

Examples

```
create-sale.handler.ts

product.repository.ts
```

---

# Future Expansion

Future applications may include:

- Desktop POS
- Customer Portal
- Vendor Portal
- Public API Gateway
- AI Assistant

The repository structure should accommodate these without major changes.

---

# Best Practices

- Keep modules independent.
- Share code through packages.
- Keep documentation close to the code.
- Follow consistent naming conventions.
- Prefer composition over duplication.

---

# Architecture Rules

- One repository for the platform.
- One module per bounded context.
- Shared code belongs in packages.
- Applications communicate through APIs.
- Documentation is version-controlled.

---

# Related Documents

- architecture/01-clean-architecture.md
- architecture/03-module-architecture.md
- architecture/05-api-design.md
- architecture/06-permission-system.md
- architecture/07-offline-sync.md
- architecture/08-plugin-system.md