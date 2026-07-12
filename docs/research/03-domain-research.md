# 03. Domain Research

> Status: Draft
> Owner: Product Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Executive Summary

A software platform should not be modeled around screens, APIs, or database tables.

It should be modeled around business domains.

A domain represents a major business responsibility that owns a specific set of data, rules, workflows, and events.

This document identifies the business domains required to build a capability-driven Commerce Operating Platform.

---

# Objectives

This document answers:

- What business domains exist?
- What responsibilities belong to each domain?
- Which domains are Core?
- Which domains are Optional?
- Which domains communicate with each other?
- How should future modules be organized?

---

# What is a Domain?

A domain is a business area with a clear responsibility.

Examples

Commerce

Inventory

Identity

CRM

Sales

Reporting

Each domain owns:

- Business rules
- Data
- Events
- APIs

---

# Domain Principles

Every domain should have:

Single Responsibility

Own Database Models

Own Business Logic

Own Events

Minimal Dependencies

No Circular Dependencies

---

# Domain Classification

The platform consists of three layers.

```
Core Domains

↓

Capability Domains

↓

Integration Domains
```

---

# Core Domains

Core domains are required for every organization.

## Identity

Purpose

Manage users and access.

Responsibilities

- Organization
- Branch
- User
- Role
- Permission
- Authentication

Used By

Every capability.

---

## Commerce

Purpose

Everything sold.

Responsibilities

- Product
- Category
- Pricing
- Taxes
- Variants
- Units

---

## Sales

Purpose

Commercial transactions.

Responsibilities

- Sale
- Sale Items
- Discounts
- Invoice
- Payment
- Refund

---

## Inventory

Purpose

Track stock movement.

Responsibilities

- Stock
- Purchase
- Supplier
- Adjustment
- Transfer

---

## CRM

Purpose

Manage customer relationships.

Responsibilities

- Customer
- Loyalty
- Customer Groups
- Credit

---

## Reporting

Purpose

Business insights.

Responsibilities

- Dashboard
- Reports
- KPIs
- Analytics

---

## Settings

Purpose

Configure organization behavior.

Responsibilities

- Currency
- Tax
- Receipt
- Business Hours
- Preferences

---

# Capability Domains

These extend the platform.

---

## Restaurant Operations

Responsibilities

- Tables
- Kitchen Display
- Reservations
- Split Bill
- QR Ordering

Depends On

Sales

Commerce

CRM

---

## Delivery

Responsibilities

- Delivery Orders
- Drivers
- Delivery Status

Depends On

Sales

CRM

---

## Bakery

Responsibilities

- Cake Orders
- Pickup Schedule
- Production Queue

Depends On

Sales

Commerce

CRM

---

## Retail

Responsibilities

- Barcode
- Returns
- Exchange

Depends On

Sales

Inventory

Commerce

---

## Pharmacy

Responsibilities

- Prescription
- Batch
- Expiry
- Drug Information

Depends On

Retail

Inventory

Commerce

---

# Integration Domains

Not business domains.

External systems.

Examples

Payment Gateway

SMS

Email

Push Notification

Accounting

Shipping

Cloud Storage

---

# Domain Dependencies

```
Identity
      │
      ▼
Commerce
      │
      ▼
Inventory
      │
      ▼
Sales
      │
      ▼
CRM
      │
      ▼
Reporting
```

Capability Domains

```
Restaurant

↓

Sales

↓

Commerce

↓

CRM
```

```
Retail

↓

Inventory

↓

Sales
```

```
Pharmacy

↓

Retail

↓

Inventory

↓

Commerce
```

---

# Research Findings

Most industries share the same core domains.

The differences exist almost entirely in capability domains.

This validates a modular architecture.

---

# Recommendations

Never organize code by industry.

Organize by domain.

Domains own:

- Models
- Services
- Events
- APIs
- Permissions

Capability Domains extend Core Domains.

---

# Architecture Impact

This document directly influences

- NestJS Modules
- Database Schema
- Event Model
- API Design
- Folder Structure
- Permissions

---

# Related Documents

- research/02-business-capability-research.md
- product/01-ubiquitous-language.md
