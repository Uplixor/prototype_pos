# Catalog Module

> Status: Draft
> Owner: Catalog Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

Catalog owns the definition and sellability of Products across every supported industry.

---

# Decisions

## Product Is the Only Sellable Core Concept

Coffee, a medicine, a retail item, a service, and a gift card are Products. Industry labels are configuration and presentation choices; they never create parallel menu-item or medicine-item core models.

## Products Are Not Stock

Catalog owns what may be sold. Inventory owns physical accountability. A Product can be active without stock, and stock can exist only against an authorized Product identity.

## Product Changes Do Not Rewrite Sales

Price, tax, name, category, Variant, and Modifier changes apply to future Sales only. A completed Sale stores its own commercial snapshot.

## Archive Instead of Delete

A Product with historical Sales, Purchases, movements, or reports is archived. It remains resolvable for history but cannot be selected for new work.

---

# Product Rules

| Decision | Constraint |
|---|---|
| Activate Product | It must have a valid sellability and pricing configuration for its scope. |
| Change price | It affects future commercial snapshots only. |
| Archive Product | It preserves references and prevents new selection. |
| Change Variant | It does not rewrite completed Sale Items. |
| Apply Modifier | It must be allowed by the selected Product or Variant policy. |

Every Product, Category, Variant, Modifier, and pricing definition belongs to exactly one Organization.

---

# Ownership and Contracts

Catalog owns Product lifecycle, Category classification, Variant structure, Modifier eligibility, and sell-time product facts.

Sales consumes approved sell-time facts. Inventory consumes Product identity and stock-relevant configuration. Search and cache consume published Catalog projections only.

Catalog publishes ProductCreated, ProductUpdated, ProductArchived, PriceChanged, VariantChanged, and CategoryChanged after durable state changes.

---

# Branch Decisions

An Organization may control which active Products are sellable at a Branch. Branch availability never changes Product ownership and never exposes an Organization's catalog to another tenant.

---

# Offline Decisions

Clients may display synchronized catalog projections offline. The server validates Product activity, Branch availability, price policy, and capability state when an offline Sale command is synchronized.

---

# Architecture Rules

- Product rules exist only in Catalog Aggregates and Domain Services.
- Catalog never owns Inventory balances or Sale totals.
- PostgreSQL is authoritative for catalog state.
- Cache and search are rebuildable catalog projections.
- Plugins cannot change Product identity, archive semantics, or completed-Sale snapshot rules.

---

# Related Documents

- modules/sales.md
- modules/inventory.md
- product/01-ubiquitous-language.md
- architecture/14-configuration-and-capability-management.md
