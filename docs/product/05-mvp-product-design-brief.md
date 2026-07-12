# 05. MVP Product Requirements and Design Brief

> Status: Draft
> Owner: Product Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This document is the single product brief for creating the MVP Figma prototype.

The prototype represents one Organization operating one or more Branches. It must show a real commerce workflow, not a collection of generic dashboards.

---

# Product Promise

An authorized business team can configure what it sells, receive stock, complete sales, record payments, correct permitted mistakes, and see trusted Branch-level results.

The same product supports cafes, bakeries, retail stores, and pharmacies through terminology and capability configuration. The MVP prototype uses neutral commerce language: Product, Sale, Payment, Supplier, Purchase, Goods Receipt, and Stock Movement.

---

# MVP Boundary

Design these capabilities:

- Organization and Branch selection
- Users, roles, and permissions
- Product Catalog, units, prices, taxes, and Branch availability
- POS Sales, payments, receipts, and refunds
- Suppliers, Purchases, and Goods Receipts
- Inventory availability, adjustments, counts, and transfers
- Sales, payment, and stock reports

Do not design restaurant-only tables, kitchen tickets, reservations, delivery, loyalty, recipes, batches, prescriptions, plugins, billing, or a customer portal.

---

# Primary Users

| User | Main Goal | Must Not Be Able To Do By Default |
|---|---|---|
| Owner | Configure the business and review all Branch operations. | Access another Organization. |
| Manager | Run Branch operations, approve permitted corrections, and view reports. | Change platform-wide billing or tenant data. |
| Cashier | Find Products, create Sales, record Payments, and reprint receipts. | Change catalog tax and price policy, adjust stock, or issue refunds. |
| Inventory Staff | Receive goods, count stock, transfer stock, and make reasoned adjustments. | Complete Sales or record Payments. |

The prototype should demonstrate role-aware navigation: unavailable capabilities and actions are hidden, while server authorization remains the real enforcement point.

---

# Application Shell

The authenticated application has:

- Organization name and active Branch selector in the top bar.
- Role-aware left navigation.
- Global search only for authorized Product, Sale, Customer, and Supplier discovery.
- Connectivity indicator: online, reconnecting, or offline with pending work count.
- User profile menu with sign-out.
- Clear branch context on every operational screen.

Use a practical, information-dense business application layout. The POS route is optimized for fast transaction entry; management routes prioritize tables, filters, and audit context.

---

# Navigation

```text
Dashboard
POS
Catalog
  Products
  Categories
  Units
  Prices and Taxes
Inventory
  Stock Availability
  Purchases
  Goods Receipts
  Stock Adjustments
  Stock Counts
  Transfers
Reports
  Sales
  Payments
  Inventory
Settings
  Organization
  Branches
  Users and Roles
```

Navigation is capability- and permission-aware. A Cashier sees POS, permitted Sales history, and receipt actions; Inventory Staff sees Inventory and permitted Catalog reads.

---

# Required Screens

## Sign In and Organization Entry

- Sign-in screen.
- Organization selection when a user has multiple Memberships.
- Branch selection when a user has more than one authorized Branch.
- Denied-access state when membership is suspended or revoked.

Never expose another Organization's name, data, or navigation through this flow.

## Dashboard

- Active Branch context.
- Today’s completed sales, recorded payments, low-stock attention, and recent stock movements.
- Each metric shows scope and freshness.
- Clicking a metric leads to an authorized report or list, never an editable accounting total.

## POS Sale Workspace

- Product search, category filters, barcode-ready input, and available Product list.
- Current Sale panel with items, quantities, unit price, tax, discount, subtotal, and total.
- Add, remove, and change quantity only while the Sale is Open.
- Customer selection is optional for MVP.
- Payment panel supports configured methods and shows pending, recorded, or failed outcome.
- Completion screen shows immutable Sale number, receipt number, amounts, payment records, and print/reprint action.

The UI must not imply a Sale is completed until the authoritative outcome is returned.

## Sales History and Refund

- Filter by Branch, date, status, Sale number, and payment method.
- Sale detail displays frozen item, price, tax, and discount snapshots.
- Refund action is visible only to users with `payment.refund` and only for refundable recorded Payments.
- Refund flow requires amount, reason, confirmation, and resulting linked refund record.

Never show an edit action for a completed Sale or recorded Payment.

## Catalog

- Product list with Product type, status, category, unit, Branch availability, and current price.
- Product create/edit form with name, category, product type, base unit, inventory tracking, pricing, tax profile, and Branch availability.
- Archive action, not destructive delete, for Products with history.
- Price and tax screens show effective dates and warn that changes apply only to future Sales.

## Purchases and Goods Receipts

- Supplier list and Supplier detail.
- Purchase draft with Product, ordered quantity, expected cost, and status.
- Goods Receipt screen with received quantity and receiving Branch.
- Receipt confirmation clearly states that it creates inbound Stock Movements.

Creating a Purchase must not change available stock in the prototype.

## Inventory

- Stock availability by Branch, location, Product, and unit.
- Stock movement history with reason, source reference, actor, time, and quantity delta.
- Adjustment form requires a reason.
- Stock count form captures counted quantity; approval produces a reconciliation outcome.
- Transfer flow requires origin and destination locations and shows traceable status.

Never provide a direct editable `current stock` field.

## Reports

- Sales report from completed Sales.
- Payment report from recorded Payments and Refunds.
- Inventory report from Stock Movements and availability projection.
- Required filters: Branch, date range, and permitted scope.
- Export action only for `report.export` users; show export status and retention notice.

---

# Critical Product States

Design all of these states for every relevant screen:

- Loading
- Empty
- No permission
- No enabled capability
- Validation error
- Server error
- Offline
- Pending synchronization
- Conflict or rejected offline action
- Archived record

For sensitive actions, show the business reason for denial: Product is archived, Sale is completed, Payment is already refunded, Branch access is missing, or capability is disabled.

---

# Design Decisions

- Use neutral terms. Do not call a Sale an Order everywhere; a restaurant capability may later present a Sale as an Order.
- Display Organization and Branch context persistently to prevent operating in the wrong location.
- Treat money, stock, and status changes as high-confidence confirmation moments.
- Make immutable history visually clear with status, actor, time, source reference, and linked corrective records.
- Make the fast POS flow keyboard and barcode friendly.
- Use responsive layouts; the web MVP is desktop-first for management and POS, while preserving mobile-ready interaction patterns.

---

# Prototype Acceptance Checklist

- A Cashier can complete a Sale and record a Payment without seeing Inventory administration.
- An Inventory Staff user can receive a Purchase and see the resulting Stock Movement without creating a Sale.
- A Manager can locate a completed Sale and see that it is immutable.
- An authorized user can issue a Refund as a new linked fact.
- Every screen clearly displays active Organization and Branch.
- The prototype includes offline, denied, pending, and error states for the POS workflow.
- No screen assumes industry-specific restaurant concepts are core.

---

# Input for a Design Tool

Use this document together with:

- [Platform System Flow](../architecture/00-platform-system-flow.md)
- [MVP Permission Catalog](../architecture/15-permission-catalog.md)
- [MVP DB Diagram](../data/commerce-platform-mvp.dbml)
- [Tiya Cafe Case Study](../case_study/tiya_dashboard_case_study.md) as reference research only

The design tool should create a cohesive desktop web prototype for the defined MVP screens and user flows. It must not add unapproved capabilities or treat the case study as the platform specification.

---

# Related Documents

- 01-ubiquitous-language.md
- 02-capability-catalog.md
- 04-critical-business-workflows.md
- ../features/01-mvp-feature-plan.md
- ../implementation/README.md
