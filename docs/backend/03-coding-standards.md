# 03. Coding Standards

> Status: Draft
> Owner: Backend Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the coding standards for the Commerce Operating Platform backend.

Consistent coding standards improve readability, maintainability, and reduce onboarding time for new developers.

---

# Design Goals

The codebase should be:

- Consistent
- Readable
- Maintainable
- Testable
- Predictable
- Easy to review

---

# General Principles

- Prefer readability over cleverness.
- Keep code simple.
- Avoid duplication.
- Write self-explanatory code.
- Optimize only when necessary.

---

# Language

- TypeScript only.
- Enable strict mode.
- Avoid `any`.
- Prefer explicit types.

Good

```ts
const product: Product = ...
```

Bad

```ts
const product: any = ...
```

---

# Naming Conventions

## Classes

PascalCase

```
CreateSaleHandler

ProductRepository

InventoryService
```

---

## Interfaces

Do not prefix with `I`.

Good

```
ProductRepository
```

Bad

```
IProductRepository
```

---

## Variables

camelCase

```
productName

saleTotal

customerId
```

---

## Constants

UPPER_SNAKE_CASE

```
MAX_PAGE_SIZE

DEFAULT_CURRENCY
```

---

## Files

kebab-case

```
create-sale.handler.ts

product.repository.ts

inventory.service.ts
```

---

## Directories

kebab-case

```
sales/

inventory/

background-jobs/
```

---

# Folder Organization

Group by feature.

Good

```
sales/

application/

domain/

presentation/

infrastructure/
```

Bad

```
controllers/

services/

repositories/

entities/
```

---

# Functions

Functions should:

- Do one thing.
- Be small.
- Have descriptive names.

Good

```
completeSale()
```

Bad

```
process()
```

---

# Classes

Classes should have a single responsibility.

Avoid large classes with unrelated methods.

---

# Methods

Prefer short methods.

If a method becomes difficult to understand, extract smaller methods.

---

# Comments

Write comments only when necessary.

Good comments explain **why**, not **what**.

Good

```ts
// Prevent duplicate payment processing.
```

Bad

```ts
// Increment i.
i++;
```

---

# Error Handling

Throw domain-specific exceptions.

Good

```
InsufficientStockException
```

Bad

```
throw new Error("Error")
```

---

# Logging

Log meaningful events.

Include

- Request ID
- User ID
- Organization ID

Never log

- Passwords
- Tokens
- Sensitive data

---

# Dependency Injection

Use NestJS Dependency Injection.

Avoid manually creating dependencies.

---

# Configuration

Configuration belongs in environment variables.

Never hardcode:

- API Keys
- Passwords
- URLs
- Secrets

---

# Validation

Use DTO validation for request validation.

Business validation belongs inside the Domain.

---

# Async Code

Prefer async/await.

Good

```ts
await saleRepository.save(sale);
```

Avoid nested promise chains.

---

# Imports

Group imports.

1. External packages
2. Internal packages
3. Relative imports

Example

```ts
import { Injectable } from '@nestjs/common';

import { Sale } from '@/sales/domain';

import { CreateSaleDto } from './dto';
```

---

# Magic Values

Avoid magic numbers and strings.

Good

```ts
const MAX_RETRY_COUNT = 3;
```

Bad

```ts
retry(3);
```

---

# Testing

New business logic should include unit tests.

Bug fixes should include regression tests.

---

# Code Reviews

Every Pull Request should verify:

- Naming
- Architecture
- Business rules
- Tests
- Performance
- Security

---

# Best Practices

- Keep Controllers thin.
- Keep Handlers focused.
- Keep Aggregates rich.
- Keep methods small.
- Prefer composition over inheritance.
- Remove dead code.

---

# Architecture Rules

- Business logic belongs in the Domain.
- Controllers never access Prisma directly.
- Repositories persist Aggregates.
- Commands change state.
- Queries never change state.
- Avoid circular dependencies.

---

# Related Documents

- backend/01-backend-architecture.md
- backend/02-tech-stack.md
- architecture/01-clean-architecture.md