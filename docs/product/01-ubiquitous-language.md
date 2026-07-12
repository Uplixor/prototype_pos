# 01. Ubiquitous Language

> Status: Draft
> Owner: Product Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the official business vocabulary of the platform.

Every engineer, designer, product manager, API, database table, event, and document must use these terms consistently.

There should never be multiple names for the same business concept.

---

# Principles

## One Concept = One Name

Incorrect

Menu Item

Food Item

Medicine

Retail Item

Correct

Product

---

## Business Language First

Database names follow business language.

API names follow business language.

UI labels may change depending on the capability.

---

## Avoid Industry Terms

Avoid

Restaurant Order

Medicine

Waiter

Cashier

Owner

Prefer

Sale

Product

User

Role

---

# Organization

Represents a business using the platform.

Examples

- Himalayan Cafe
- ABC Bakery
- XYZ Retail
- City Pharmacy

Plural

Organizations

---

# Branch

A physical operating location belonging to an Organization.

Examples

Kathmandu

Pokhara

Lalitpur

---

# User

A person using the system.

Examples

Owner

Cashier

Waiter

Manager

Pharmacist

Inventory Staff

The system never distinguishes these by entity.

Only by Role.

---

# Role

Defines responsibilities.

Examples

Owner

Manager

Cashier

Kitchen

Delivery

Accountant

---

# Permission

A single action a User may perform.

Examples

sale.create

sale.refund

inventory.adjust

product.update

---

# Product

Anything the business can sell.

Examples

Pizza

Coffee

Cake

Shampoo

Rice

Medicine

Gift Card

Service

Everything sold is a Product.

---

# Category

Groups Products.

Examples

Coffee

Dessert

Medicine

Electronics

---

# Variant

A purchasable version of a Product.

Examples

Coffee

Small

Medium

Large

---

# Modifier

Optional customization.

Examples

Extra Cheese

No Sugar

Extra Ice

Gift Wrap

---

# Sale

Represents a commercial transaction.

Examples

Restaurant bill

Retail checkout

Bakery purchase

Pharmacy purchase

Never use

Order

Bill

Receipt

Invoice

unless referring to different business concepts.

---

# Sale Item

One Product inside a Sale.

---

# Payment

Money received for a Sale.

A Sale may contain multiple Payments.

---

# Refund

Money returned to a customer.

A Refund is never a negative Sale.

---

# Inventory

Current stock available.

---

# Stock Movement

Any change to inventory.

Examples

Purchase

Sale

Transfer

Adjustment

Waste

---

# Purchase

Inventory acquired from a Supplier.

---

# Supplier

Organization supplying Products.

---

# Customer

Person or organization purchasing Products.

---

# Invoice

Formal financial document generated from a Sale.

Invoice ≠ Sale

---

# Receipt

Proof of Payment.

Receipt ≠ Invoice.

---

# Reservation

Customer reserves a resource.

Examples

Table

Meeting Room

Future Appointment

---

# Table

A dining resource.

Not a sale.

Not a customer.

A resource.

---

# Kitchen Ticket

Instruction sent to the kitchen.

Not a Sale.

Not an Invoice.

---

# Capability

Optional business functionality.

Examples

Kitchen Display

Delivery

Reservations

QR Ordering

Barcode

Prescription

---

# Feature Flag

Enables or disables functionality.

---

# Event

Something important happened.

Examples

Sale Created

Payment Received

Stock Adjusted

Customer Created

---

# Dashboard

Summary of business information.

Never owns business logic.

---

# Report

Read-only business information generated from one or more domains.

---

# Rules

Never use these names.

| Avoid | Use |
|--------|-----|
| Menu Item | Product |
| Food Item | Product |
| Medicine | Product |
| Waiter | User |
| Cashier | User |
| Owner | User |
| Shop | Organization |
| Outlet | Branch |
| Order | Sale |
| Bill | Sale / Invoice |
| Stock In | Stock Movement |
| Stock Out | Stock Movement |

---

# Naming Convention

Entity

Singular

Product

Database

Plural

products

API

Plural

/products

Events

Past Tense

SaleCreated

PaymentReceived

StockAdjusted

Permissions

resource.action

sale.create

sale.update

inventory.adjust

product.archive

---

# Related Documents

- research/02-business-capability-research.md
- research/03-domain-research.md
- domain/01-bounded-contexts.md
