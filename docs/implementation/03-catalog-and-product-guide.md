# 03. Catalog and Product Setup Guide

> Status: Draft
> Owner: Commerce Core Workstream
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Why This Exists

A Sale needs a controlled definition of what may be sold, in which unit, at which price, and at which Branch. Catalog prevents every POS screen from inventing its own item and price rules.

---

# Dependencies and Exclusions

Requires Authentication and Tenant Foundation.

Build Products, Categories, Units, Variants, prices, tax profiles, and Branch availability. Do not build Sales, stock balances, purchase receipts, or optional modifiers in this guide.

---

# Database Scope

| Owns | Required Rules |
|---|---|
| `categories` | Names are unique within an Organization. |
| `units`, `product_units` | Every Product has an explicit base unit and valid conversion policy. |
| `products`, `product_variants` | Product is universal; archive rather than delete after reference. |
| `product_prices` | Pricing intervals cannot overlap for the same effective scope. |
| `tax_profiles`, `tax_rates` | Tax changes apply to future sales; historical tax is snapshotted later. |
| `product_branch_availability` | Product and Branch must share an Organization. |

---

# Build Steps

1. Implement Organization-scoped Category and Unit records.
2. Implement Product lifecycle: draft, active, archived.
3. Require a base unit and product type for every Product.
4. Implement Variant identity and archive lifecycle.
5. Implement effective Price Definitions and conflict validation.
6. Implement Tax Profiles and time-bounded rates.
7. Implement explicit Branch availability.
8. Build authorized Catalog management and sellable-product read views.
9. Publish ProductCreated, ProductUpdated, ProductArchived, and PriceChanged only after durable changes.

---

# Invariants

- Product identity is Organization-scoped.
- Archived Products are resolvable for history but unavailable for new sales.
- A price or tax change never rewrites completed Sale snapshots.
- A Product is not inventory; `track_inventory` only controls future inventory policy.
- A Branch cannot expose a Product from another Organization.

---

# Acceptance Checks

- An authorized user can create and activate a Product with unit, price, and Branch availability.
- Expired or overlapping prices are rejected.
- Archiving prevents new use without deleting the record.
- Another Organization cannot read, price, or activate the Product.

---

# Related Documents

- ../modules/catalog.md
- ../data/commerce-platform-mvp.dbml
- ../modules/sales.md
- ../architecture/14-configuration-and-capability-management.md
