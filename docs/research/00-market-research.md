# 00. Market Research

> Status: Draft v1
>
> Owner: Product & Architecture Team
>
> Last Updated: 2026-07-10

---

# Executive Summary

The Point of Sale (POS) industry is undergoing a transformation from simple billing software into comprehensive business operating platforms. Modern businesses no longer expect software to only process payments; they expect it to manage inventory, customers, employees, reports, suppliers, digital payments, and multiple business locations from a single system.

Despite rapid market growth, most existing products remain focused on a single industry (restaurants, retail, pharmacy, salon, etc.), resulting in duplicated software, fragmented ecosystems, and inconsistent user experiences.

This project proposes a different approach:

Instead of building software around industries, we will build software around **business capabilities**.

Businesses will enable the capabilities they need, allowing restaurants, cafés, bakeries, hybrid food businesses, retailers, and pharmacies to share one extensible platform.

---

# Research Objectives

This research aims to answer the following questions:

- Is there still room for a new POS platform?
- What problems remain unsolved?
- Why do businesses switch POS providers?
- Which features are common across industries?
- Which features should be modular?
- How should a modern POS platform be architected?

---

# Product Vision

Build a global, mobile-first, offline-first Commerce Operating Platform that enables local businesses to manage operations through configurable business capabilities instead of industry-specific software.

---

# Product Mission

Help local businesses digitize their operations using software that is:

- Simple
- Fast
- Reliable
- Offline-capable
- Affordable
- Scalable

---

# Market Overview

The global POS software market continues to grow due to several long-term trends:

- Cloud software adoption
- Mobile devices replacing desktop terminals
- Digital payments
- Contactless transactions
- Multi-location businesses
- Inventory automation
- Demand for operational analytics

Modern POS platforms increasingly serve as business operating systems rather than payment terminals. :contentReference[oaicite:0]{index=0}

---

# Why Existing Solutions Are Incomplete

Most products are built around industries.

Examples:

Restaurant POS

Retail POS

Salon POS

Pharmacy POS

Hotel POS

This creates duplicated engineering effort because all businesses still need:

- Products
- Sales
- Inventory
- Customers
- Payments
- Reports
- Employees

The difference lies in workflows—not in the core business model.

---

# Market Opportunity

There is an opportunity to build a platform with:

Shared Core

+

Capability Packs

Instead of

Separate Applications

This reduces:

- Development cost
- Maintenance
- Code duplication

while improving scalability.

---

# Business Capability Model

Instead of asking:

"What type of business are you?"

The platform asks:

"What capabilities does your business need?"

Example:

Food & Beverage

- Tables
- Kitchen Display
- QR Ordering
- Delivery
- Reservations
- Split Bill
- Bakery Counter

Retail

- Barcode
- Returns
- Exchange
- Price Labels

Healthcare

- Prescription
- Batch Tracking
- Expiry Tracking

---

# Target Customers

Primary Customers

Small and Medium Businesses

Business Size

- 1–100 employees

Typical Owner

- Founder
- Manager
- Family-owned business

Primary Users

- Cashier
- Waiter
- Manager
- Inventory Staff
- Owner

---

# MVP Industries

Instead of supporting every industry immediately:

Food & Beverage

- Restaurant
- Cafe
- Bakery
- Hybrid Food Businesses

Future

- Retail

Future

- Pharmacy

Future

- Other industries

---

# Common Problems Across Businesses

## Sales

- Slow checkout
- Manual billing
- Difficult refunds
- Multiple payment methods

---

## Inventory

- Manual stock tracking
- Unknown inventory
- Stock theft
- No expiry alerts

---

## Customer Management

- No loyalty
- Poor purchase history
- Credit tracking

---

## Reporting

Business owners struggle to answer:

- How much did I sell today?
- Which products are profitable?
- Which branch performs best?
- Which employee performs best?

---

## Staff

Challenges include:

- Permission control
- Accountability
- Attendance
- Shift management

---

# Industry Trends

Current market direction shows clear movement toward:

## Cloud Software

Businesses increasingly prefer subscriptions over perpetual licenses.

Benefits

- Automatic updates
- Lower maintenance
- Remote access

---

## Mobile First

Phones and tablets are replacing traditional POS terminals.

Operations increasingly happen away from a fixed counter.

---

## Offline First

Businesses expect software to continue operating during internet outages.

Offline capability is becoming a competitive differentiator, particularly for hospitality and small retailers. :contentReference[oaicite:1]{index=1}

---

## Real-Time

Users expect:

- Instant inventory updates
- Live dashboards
- Multi-device synchronization

---

## AI

The next generation of POS software is expanding into:

- Sales forecasting
- Inventory recommendations
- Business insights
- Intelligent reporting

AI is considered a long-term enhancement rather than an MVP capability. :contentReference[oaicite:2]{index=2}

---

# Competitive Landscape

Current market leaders include:

General Commerce

- Shopify
- Square
- Clover
- Lightspeed

Restaurant

- Toast
- TouchBistro

Enterprise

- Oracle
- NCR

Open Source

- ERPNext
- Odoo

Most vendors compete by specializing in one vertical or by combining POS with payments and operational software. :contentReference[oaicite:3]{index=3}

---

# Identified Market Gaps

Current products often suffer from:

- Industry lock-in
- Expensive upgrades
- Complex interfaces
- Limited offline capability
- Difficult customization
- Poor cross-industry support

---

# Product Differentiators

The platform should differentiate through:

- Capability-first architecture
- Mobile-first UX
- Offline-first synchronization
- Real-time updates
- Clean API
- Modular capability packs
- Global-ready architecture
- Fast onboarding

---

# Product Principles

The following principles are considered non-negotiable.

## Capability over Industry

Build capabilities.

Do not build industries.

---

## Mobile First

Every workflow must function naturally on a phone.

---

## Offline First

Business operations must continue without internet.

---

## SaaS First

Cloud-hosted by default.

Enterprise self-hosting may be supported later.

---

## Global by Design

Architecture must remain country-agnostic.

Support for currencies, taxes, languages, and payment providers must be configurable.

---

## API First

Every feature should be accessible through APIs.

---

## Modular

Businesses enable capabilities instead of installing separate products.

---

# Risks

Technical

- Offline synchronization complexity
- Payment integrations
- Regulatory requirements

Business

- Highly competitive market
- Feature creep
- Long sales cycles

Mitigation

- Generic architecture
- Capability packs
- Incremental releases
- Strong documentation

---

# Decisions Approved

| Decision | Status |
|------------|--------|
| React + Vite | ✅ |
| NestJS | ✅ |
| PostgreSQL | ✅ |
| SaaS First | ✅ |
| Offline First | ✅ |
| Mobile First | ✅ |
| Capability Architecture | ✅ |
| Global by Design | ✅ |
| Restaurant/Cafe/Bakery MVP | ✅ |
| Retail Phase 2 | ✅ |
| Pharmacy after Retail | ✅ |

---

# Success Criteria

The MVP succeeds if a food & beverage business can completely replace paper or spreadsheets for:

- Sales
- Inventory
- Customers
- Reporting
- Staff operations

using only this platform.

---

# Next Documents

- 01-market-analysis.md
- 02-competitor-analysis.md
- 03-domain-research.md

---

# References

1. Global POS market growth and trends. :contentReference[oaicite:4]{index=4}
2. POS market leaders and competitive positioning. :contentReference[oaicite:5]{index=5}
3. Industry discussions highlighting offline support, hardware lock-in, and vertical specialization. :contentReference[oaicite:6]{index=6}