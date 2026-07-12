# 04. User Personas

> Status: Draft
> Owner: Product Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Executive Summary

The platform is designed around users and their responsibilities rather than job titles or industries.

Instead of creating separate systems for restaurants, retail stores, or pharmacies, the platform provides a common experience where permissions, capabilities, and workflows adapt to each user's role.

This document identifies the primary users of the platform and the problems they need solved.

---

# Objectives

This document answers:

- Who uses the platform?
- What are their responsibilities?
- What information do they need?
- Which devices do they use?
- What problems are they trying to solve?

---

# Persona Principles

Users are modeled independently from industries.

A cashier in a bakery and a cashier in a retail store share many responsibilities.

The platform should maximize reuse while allowing capability-specific workflows.

---

# Primary Personas

## Business Owner

### Description

Owns the business.

Usually responsible for financial decisions, business growth, and overall operations.

Examples

- Restaurant owner
- Cafe owner
- Bakery owner
- Retail owner

---

### Responsibilities

- Monitor sales
- View reports
- Manage branches
- Configure settings
- Manage employees
- Approve purchases
- Review inventory

---

### Goals

- Increase revenue
- Reduce losses
- Understand business performance
- Manage remotely

---

### Pain Points

- Limited visibility
- Poor reporting
- Inventory loss
- Employee accountability

---

### Primary Device

Mobile

Secondary

Laptop

---

## Branch Manager

### Responsibilities

- Supervise staff
- Monitor daily sales
- Handle customer issues
- Review inventory
- Approve refunds

---

### Goals

- Keep operations running smoothly
- Meet sales targets
- Reduce operational mistakes

---

### Primary Device

Tablet

Mobile

---

## Cashier

### Responsibilities

- Process sales
- Accept payments
- Print receipts
- Apply discounts
- Handle returns (if permitted)

---

### Goals

- Fast checkout
- Few mistakes
- Easy-to-use interface

---

### Pain Points

- Slow software
- Complex workflows
- Long customer queues

---

### Primary Device

POS Terminal

Tablet

---

## Inventory Staff

### Responsibilities

- Receive stock
- Count inventory
- Adjust stock
- Transfer inventory
- Record damaged items

---

### Goals

- Accurate inventory
- Fast stock operations

---

### Primary Device

Mobile

Barcode Scanner

---

## Kitchen Staff

Applicable only when the Kitchen capability is enabled.

---

### Responsibilities

- Receive orders
- Prepare food
- Mark items as ready

---

### Primary Device

Kitchen Display

Tablet

---

## Wait Staff

Applicable only for dine-in businesses.

---

### Responsibilities

- Create orders
- Update orders
- Transfer tables
- Split bills

---

### Primary Device

Mobile

Tablet

---

## Delivery Staff

Applicable when Delivery capability is enabled.

---

### Responsibilities

- Receive delivery assignment
- Update delivery status
- Confirm completion

---

### Primary Device

Mobile

---

## Accountant

### Responsibilities

- Review reports
- Export financial data
- Audit transactions

---

### Primary Device

Desktop

Laptop

---

# User Goals

Every user ultimately wants one thing.

Complete work with minimal effort.

The software should never require unnecessary navigation or repeated data entry.

---

# Device Matrix

| Persona | Mobile | Tablet | Desktop |
|----------|:------:|:------:|:-------:|
| Owner | ✅ | Optional | ✅ |
| Manager | ✅ | ✅ | Optional |
| Cashier | Optional | ✅ | ✅ |
| Inventory Staff | ✅ | Optional | ❌ |
| Wait Staff | ✅ | ✅ | ❌ |
| Kitchen | Optional | ✅ | ❌ |
| Delivery | ✅ | ❌ | ❌ |
| Accountant | ❌ | ❌ | ✅ |

---

# Permissions

Permissions are assigned through Roles.

The system should never hardcode:

- Owner
- Cashier
- Waiter

Instead

User

↓

Role

↓

Permission

---

# Research Findings

- Mobile usage dominates operational roles.
- Owners require analytics rather than operational screens.
- Cashiers prioritize speed.
- Inventory users prioritize accuracy.
- Operational users require simplified interfaces.

---

# Recommendations

Design interfaces around personas.

Do not design interfaces around database entities.

Each persona should have:

- A tailored dashboard
- Simplified navigation
- Only the permissions required

---

# Architecture Impact

This document influences:

- RBAC
- Navigation
- Dashboard Design
- API Authorization
- Frontend Layout
- Mobile Experience

---

# Related Documents

- research/02-business-capability-research.md
- research/03-domain-research.md
