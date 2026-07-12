# 02. Business Capability Analysis

> Status: Draft
> Owner: Product Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Executive Summary

Every business operates using a set of reusable business capabilities.

Traditional POS vendors model industries:

Restaurant POS

Retail POS

Pharmacy POS

Salon POS

This creates duplicated systems despite sharing nearly identical business operations.

This research identifies those shared capabilities and recommends a capability-first platform architecture.

---

# Research Objectives

This document answers:

- What capabilities exist?
- Which industries require them?
- Which capabilities belong in the Core Platform?
- Which should be optional?
- Which capabilities depend on others?
- How should capabilities influence architecture?

---

# What is a Business Capability?

A business capability is a reusable function that enables a business process.

Examples

- Inventory
- Sales
- Customers
- Reservations
- Kitchen Display
- Barcode
- Loyalty

Capabilities describe **what a business can do**, not **what industry it belongs to**.

---

# Capability Classification

Every capability belongs to one of three categories.

## Core

Required by nearly every business.

Examples

- Products
- Sales
- Inventory
- Customers
- Payments
- Reports
- Users

---

## Capability

Industry or workflow specific.

Examples

- Tables
- Kitchen Display
- Reservations
- Barcode Printing
- Prescription
- Batch Tracking
- Delivery

---

## Configuration

Changes behavior without changing business logic.

Examples

- Currency
- Tax Rules
- Receipt Templates
- Payment Providers
- Business Hours
- Languages

---

# Capability Matrix

| Capability | Restaurant | Cafe | Bakery | Retail | Pharmacy |
|------------|:----------:|:----:|:------:|:------:|:--------:|
| Organization | ✅ | ✅ | ✅ | ✅ | ✅ |
| Branch | ✅ | ✅ | ✅ | ✅ | ✅ |
| User | ✅ | ✅ | ✅ | ✅ | ✅ |
| Roles | ✅ | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ | ✅ |
| Category | ✅ | ✅ | ✅ | ✅ | ✅ |
| Customer | ✅ | ✅ | ✅ | ✅ | ✅ |
| Supplier | ✅ | ✅ | ✅ | ✅ | ✅ |
| Inventory | ✅ | ✅ | ✅ | ✅ | ✅ |
| Purchase | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sale | ✅ | ✅ | ✅ | ✅ | ✅ |
| Payment | ✅ | ✅ | ✅ | ✅ | ✅ |
| Discount | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reports | ✅ | ✅ | ✅ | ✅ | ✅ |
| Barcode | Optional | Optional | Optional | ✅ | ✅ |
| Tables | ✅ | ✅ | Optional | ❌ | ❌ |
| Kitchen Display | ✅ | ✅ | Optional | ❌ | ❌ |
| QR Ordering | ✅ | ✅ | Optional | ❌ | ❌ |
| Reservations | ✅ | Optional | ❌ | ❌ | ❌ |
| Delivery | ✅ | ✅ | ✅ | Optional | Optional |
| Loyalty | ✅ | ✅ | ✅ | ✅ | ✅ |
| Returns | ❌ | ❌ | ❌ | ✅ | ✅ |
| Batch Tracking | ❌ | ❌ | Optional | Optional | ✅ |
| Expiry Tracking | Optional | Optional | ✅ | Optional | ✅ |
| Prescription | ❌ | ❌ | ❌ | ❌ | ✅ |

---

# Core Capability Analysis

## Organization

Purpose

Represents a customer company using the platform.

Examples

- ABC Cafe
- XYZ Bakery
- Himalayan Retail

Recommendation

Core.

---

## Branch

Purpose

Represents a physical operating location.

Examples

- Kathmandu
- Pokhara
- Lalitpur

Recommendation

Core.

Every business should support multiple branches.

---

## User

Purpose

Represents a person using the platform.

Examples

- Owner
- Cashier
- Manager
- Waiter
- Pharmacist

Recommendation

Never create separate entities like Waiter or Cashier.

Everything is a User with Roles.

---

## Product

Purpose

Represents anything sold.

Examples

Restaurant

- Pizza

Cafe

- Coffee

Bakery

- Cake

Retail

- Shampoo

Pharmacy

- Medicine

Recommendation

The platform should never distinguish MenuItem, Medicine, or RetailItem at the core level.

Everything is a Product.

---

## Inventory

Purpose

Tracks available stock.

Industries

Every industry requires inventory.

Differences

Restaurant

Uses ingredients.

Retail

Uses finished goods.

Pharmacy

Uses medicine batches.

Recommendation

One Inventory capability with extensions.

---

## Sale

Purpose

Represents a completed commercial transaction.

Restaurant

Table Order

Retail

Counter Sale

Pharmacy

Prescription Sale

Recommendation

The platform should expose a single Sale domain.

Industry-specific workflows extend the Sale process.

---

# Capability Dependencies

Tables

Depends on

- Sale
- Customer
- Branch

---

Kitchen Display

Depends on

- Product
- Sale
- Table

---

Prescription

Depends on

- Product
- Customer
- Sale

---

Batch Tracking

Depends on

- Product
- Inventory

---

# MVP Capability Set

## Core

- Organization
- Branch
- Users
- Roles
- Products
- Categories
- Customers
- Suppliers
- Inventory
- Purchases
- Sales
- Payments
- Discounts
- Reports

---

## Food & Beverage

- Tables
- Kitchen Display
- QR Ordering
- Delivery
- Split Bill
- Bakery Counter

---

## Future

Retail

- Barcode
- Returns
- Exchange

---

Healthcare

- Prescription
- Batch
- Expiry
- Drug Information

---

# Research Findings

1. Nearly every business shares the same core entities.
2. Industry differences exist primarily in workflows.
3. Most current vendors duplicate software across industries.
4. Capability-driven architecture significantly improves extensibility.
5. Hybrid businesses become first-class citizens.

---

# Recommendations

The platform should consist of:

Core Platform

+

Capability Packs

+

Configuration

Business types should never influence the domain model.

Capabilities should.

---

# Architecture Impact

This document directly influences:

- Domain Model
- Database Schema
- Module Architecture
- API Design
- Permissions
- Event Model

No implementation should bypass these capability definitions.
