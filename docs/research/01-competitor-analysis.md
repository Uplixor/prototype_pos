# 01. Competitor Analysis

> Status: Draft
>
> Owner: Product Team
>
> Created: 2026-07-10

---

# Executive Summary

The Point of Sale (POS) market is highly competitive, but it remains fragmented. Most vendors specialize in one vertical (restaurant, retail, pharmacy, hospitality) or one ecosystem (payments, ecommerce, accounting).

No single solution provides a capability-driven platform that allows hybrid businesses to configure operations without switching products.

This document evaluates leading competitors to identify:

- Industry best practices
- Common architectural patterns
- Product strengths
- Customer complaints
- Market gaps
- Opportunities for differentiation

---

# Research Objectives

This document answers:

- Who are the market leaders?
- Why are they successful?
- Why do businesses leave them?
- Which features are standard?
- Which features differentiate products?
- What should our platform learn from them?

---

# Evaluation Criteria

Each competitor is evaluated using the following criteria.

## Product

- Ease of use
- Feature completeness
- Mobile experience
- Offline support
- Reporting
- Inventory
- Customer management

---

## Technical

- Cloud architecture
- API availability
- Integrations
- Multi-location
- Scalability

---

## Business

- Pricing
- Target market
- Geographic reach
- Ecosystem
- Customer support

---

# Competitor Categories

Instead of comparing dozens of products individually, competitors are grouped into categories.

## Commerce Platforms

Examples

- Shopify POS
- Square

Strengths

- Strong ecosystem
- Excellent integrations
- Modern UI
- Large developer communities

Weaknesses

- Expensive at scale
- Industry-specific workflows often require paid apps

Research Finding

Platform ecosystems create long-term customer retention.

Recommendation

Design our system around capabilities and future extensibility.

---

## Restaurant Specialists

Examples

- Toast
- TouchBistro

Strengths

- Excellent restaurant workflows
- Kitchen Display
- Tables
- Split bills
- Menu management

Weaknesses

- Difficult to adapt for non-restaurant businesses.

Research Finding

Restaurant workflows should become capability packs—not assumptions throughout the platform.

---

## Retail Specialists

Examples

- Lightspeed Retail
- Vend
- Loyverse

Strengths

- Inventory
- Barcode
- Multi-location
- Purchase management

Weaknesses

- Restaurant workflows are often missing.

Research Finding

Retail differs mostly in workflow rather than core business entities.

---

## ERP Platforms

Examples

- Odoo
- ERPNext

Strengths

- Extremely flexible
- Large module ecosystem
- Broad business coverage

Weaknesses

- Complex onboarding
- Steep learning curve
- Heavy interfaces

Research Finding

Power often comes at the cost of usability.

Recommendation

Prioritize simplicity over feature count.

---

# Industry Observations

Across competitors several patterns appear consistently.

## Shared Core

Every successful product contains:

- Products
- Customers
- Sales
- Inventory
- Payments
- Reports
- Users

Observation

The core domain rarely changes between industries.

---

## Workflow Differences

Industries differ primarily in workflows.

Restaurant

- Tables
- Kitchen
- QR Ordering

Retail

- Barcode
- Returns

Pharmacy

- Prescription
- Batch
- Expiry

Observation

Industries should be implemented as configurable capability packs.

---

## Mobile

All modern products increasingly support tablets.

Observation

Desktop-first products continue losing market share.

Recommendation

Remain mobile-first.

---

## Offline

Offline support is inconsistent across competitors.

Observation

Reliable offline synchronization represents a strong competitive opportunity.

---

# Common Customer Complaints

Across review platforms and communities, recurring complaints include:

- Expensive subscriptions
- Slow customer support
- Complicated setup
- Poor reporting
- Hardware lock-in
- Limited customization
- Weak offline capability
- Feature overload

Recommendation

Optimize for:

- Simplicity
- Speed
- Flexibility

---

# Market Gap

No competitor fully embraces capability-driven architecture.

Current market approach

Restaurant POS

Retail POS

Pharmacy POS

Proposed approach

Commerce Platform

↓

Capabilities

↓

Business Configuration

This supports hybrid businesses without requiring multiple products.

---

# Strategic Opportunities

The platform should differentiate through:

- Capability-first architecture
- Mobile-first UX
- Offline-first synchronization
- Clean APIs
- Modern developer experience
- Configurable workflows
- Hybrid business support

---

# Architecture Impact

The following decisions become validated.

| Finding | Decision |
|----------|----------|
| Core entities remain consistent | Generic domain model |
| Workflows differ | Capability packs |
| Mobile usage grows | Mobile-first |
| Offline remains weak | Offline-first |
| APIs are increasingly important | API-first |
| Hybrid businesses exist | Capability presets |

---

# Final Recommendations

Build:

- Platform

Do not build:

- Restaurant software
- Retail software
- Pharmacy software

Instead:

Build one Commerce Platform that can become any of them through configuration.

---

# Next Document

02-business-capability-research.md

This document identifies every business capability and determines:

- Which industries need it
- Common behaviors
- Industry differences
- Final architecture recommendation

It will directly drive the domain model and database design.