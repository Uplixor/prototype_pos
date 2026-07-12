# 06. Visual Design and Responsive Prototype Specification

> Status: Draft
> Owner: Product and Design Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This document defines the visual direction and responsive behavior for the MVP prototype.

The product should feel trustworthy, efficient, and familiar to a business operator during a busy sales or stock workflow. Visual polish must improve comprehension of business state, not decorate unrelated screens.

---

# Visual Direction

Use a clean, modern commerce-operations interface:

- Light neutral application background with high-contrast content surfaces.
- Deep indigo or blue as the primary action colour for navigation, selected state, and primary confirmation.
- Emerald only for confirmed positive business outcomes: recorded payment, completed sale, received stock.
- Amber only for attention states: pending payment, low stock, unsubmitted count, reconnecting.
- Red only for destructive or corrective actions: cancellation, rejection, failed payment, archive, refund confirmation.
- Slate or neutral text hierarchy for standard information.

Do not use success red or warning amber as generic decoration. Status colours must mean the same thing throughout the prototype.

---

# Colour Decisions

| Meaning | Prototype Treatment | Examples |
|---|---|---|
| Primary action | Indigo or blue button and active navigation state | Create Sale, Record Payment, Save Product |
| Confirmed fact | Emerald badge and confirmation surface | Payment recorded, Sale completed, Goods received |
| Attention needed | Amber badge or inline notice | Low stock, payment pending, offline queue pending |
| Destructive or failed | Red confirmation or status surface | Refund, archive, payment failed, rejected mutation |
| Immutable history | Neutral locked or timeline treatment | Completed Sale, Payment, Stock Movement |

The final token values belong in the Figma design system. Do not hard-code exact colour values in product requirements before brand work is approved.

---

# Image and Illustration Strategy

Images should make business data easier to scan:

- Show Product thumbnails in Catalog, POS search results, Product detail, and receipt preview when an image exists.
- Use category illustrations or neutral product placeholders when no Product image exists.
- Use small contextual illustrations for empty states: no Products, no Sales today, no Purchases, no stock movements.
- Use compact charts and data visualizations on the Dashboard and Reports instead of decorative photography.
- Use icons for actions and status, paired with labels where the business action is not universally obvious.

Avoid full-screen stock photography, restaurant-only hero images, or imagery that implies the product supports only one industry.

Product images are optional data. A missing image must never make a Product difficult to identify or sell.

---

# Core Component Requirements

- Persistent Organization and Branch context in the application header.
- Status badges for Sale, Payment, Purchase, Stock Count, and connectivity state.
- Data tables with filters, date range, Branch scope, empty state, loading state, and no-permission state.
- Confirmation dialogs for completion, cancellation, archive, refund, receipt confirmation, and stock adjustment.
- Timeline or linked-record treatment for immutable history and corrections.
- Dense but readable POS controls with large touch targets for quantity and payment actions.
- Accessible colour contrast; status must not rely on colour alone.

---

# Responsive Behavior

Responsive design changes layout, not permissions, business rules, or available feature meaning.

| Prototype Viewport | Required Layout |
|---|---|
| Desktop: 1440 × 1024 | Persistent left navigation. POS shows Product browse and current Sale side by side. Data tables show full columns. |
| Tablet: 768 × 1024 | Collapsible navigation. POS keeps two panes when space permits; tables use horizontal detail access instead of unreadable columns. |
| Mobile: 390 × 844 | Bottom navigation for primary actions. One focused task per screen. POS switches between Product browse and cart/payment views. Forms and filters stack vertically. |

The prototype must include these three viewport frames for each critical workflow.

---

# Mobile-Specific Decisions

## POS

- Product browse is the initial view.
- Current Sale is always reachable through a persistent cart button with item count and total.
- Cart opens as a full-screen task view, not a narrow unreadable side panel.
- Payment and completion use a focused confirmation flow with clear back and cancel behavior.
- Barcode input and product search remain immediately available.

## Management Screens

- Long data tables become card lists with essential status, amount or quantity, date, and Branch.
- Secondary details open on a dedicated detail screen or bottom sheet.
- Create and edit forms use grouped, vertically stacked fields.
- Destructive actions require explicit confirmation and are not placed beside primary actions.

## Offline

- Show connectivity state persistently but unobtrusively.
- Show queued action count and per-action pending, confirmed, rejected, or conflict state.
- Never show a locally queued Sale or Payment as irrevocably completed before the server outcome.

---

# Prototype Test Flows

Test each flow at desktop and mobile viewport:

1. Cashier signs in, selects Branch, finds a Product with image, creates a Sale, records a payment, and views the receipt.
2. Manager finds a completed Sale and sees immutable item snapshots and linked refund history.
3. Inventory Staff receives a Purchase and sees the resulting Stock Movement.
4. Inventory Staff submits a stock adjustment with required reason.
5. Cashier works offline, sees a queued action, then sees an accepted or rejected synchronization outcome.
6. User without refund permission cannot discover or invoke the refund action.

---

# Figma Delivery Requirements

- Create a shared component library for buttons, inputs, badges, cards, tables, navigation, dialogs, Product tiles, and status banners.
- Use responsive variants or auto-layout for desktop, tablet, and mobile frames.
- Include realistic fictional data for a cafe or retail Organization without changing core terminology.
- Include at least six Product images or generated neutral Product thumbnails to prove the image pattern.
- Create prototype links for the POS, refund, goods receipt, and offline-pending flows.
- Label all screens with role, viewport, and relevant state.

---

# Architecture Rules

- UI presentation never makes a mutable action out of an immutable business fact.
- Product images and visual assets are tenant-scoped optional files, not required Catalog identity.
- Responsive layouts preserve the same Organization, Branch, permission, and capability boundaries.
- Offline visual states reflect server-authoritative outcomes when they arrive.

---

# Related Documents

- 05-mvp-product-design-brief.md
- ../architecture/00-platform-system-flow.md
- ../architecture/07-offline-sync.md
- ../architecture/15-permission-catalog.md
- ../modules/catalog.md
