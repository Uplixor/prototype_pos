# 08. Plugin System

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-10
> Updated: 2026-07-10

---

# Purpose

This document defines the plugin architecture of the Commerce Operating Platform.

The platform is built around a modular core that can be extended through plugins without modifying the core application.

Plugins allow businesses to enable only the features they need while providing developers with a safe extension mechanism.

---

# Design Goals

The plugin system should be:

- Modular
- Secure
- Independent
- Event-driven
- Versioned
- Easy to develop
- Easy to install

---

# Plugin Philosophy

The Core Platform should remain small.

Business-specific functionality should be added through plugins.

Examples

- Kitchen Display
- QR Ordering
- Loyalty
- Delivery
- Accounting
- Ecommerce
- Analytics
- SMS Notifications

---

# Core vs Plugin

Core Platform

- Identity
- Catalog
- Inventory
- Sales
- Payments
- CRM
- Reporting

Plugins

- Kitchen
- Reservation
- QR Menu
- Delivery
- Customer Display
- Barcode Printing
- Accounting
- Ecommerce

---

# Plugin Types

Business Plugins

Add business capabilities.

Examples

- Kitchen
- Reservation
- Delivery

---

Integration Plugins

Connect external services.

Examples

- Stripe
- Khalti
- eSewa
- QuickBooks
- Shopify

---

UI Plugins

Extend the user interface.

Examples

- Dashboard Widgets
- Reports
- Navigation Items
- Custom Pages

---

# Plugin Capabilities

Plugins may:

- Register Commands
- Register Queries
- Subscribe to Events
- Add Navigation
- Add Reports
- Add Dashboard Widgets
- Add Settings Pages

Plugins must NOT:

- Modify Core Domain Models
- Access another plugin's database
- Bypass permission checks
- Modify database schema directly

---

# Communication

Plugins communicate using:

- Public APIs
- Domain Events
- Extension Points

Plugins should never communicate through database tables.

---

# Plugin Lifecycle

```
Install

↓

Enable

↓

Configure

↓

Use

↓

Disable

↓

Uninstall
```

---

# Event Integration

Plugins subscribe to business events.

Examples

```
SaleCompleted

PaymentReceived

ProductCreated

StockAdjusted
```

Plugins react to events without changing the core workflow.

---

# Configuration

Each plugin manages its own configuration.

Examples

- API Keys
- Feature Flags
- Business Settings

Plugin configuration should be isolated from core settings.

---

# Permissions

Plugins define their own permissions.

Examples

```
delivery.manage

reservation.create

loyalty.redeem
```

Permissions integrate with the platform's RBAC system.

---

# Versioning

Every plugin should define:

- Name
- Version
- Author
- Dependencies
- Minimum Platform Version

This ensures compatibility across platform updates.

---

# Security

Plugins should:

- Run within platform boundaries
- Respect permission checks
- Access only public APIs
- Never expose sensitive data

---

# Future Marketplace

Future versions may include a plugin marketplace where businesses can discover and install official or third-party plugins.

Examples

- Kitchen Display
- QR Ordering
- Loyalty
- Accounting
- Ecommerce
- AI Assistant

---

# Best Practices

- Keep plugins independent.
- Prefer events over direct communication.
- Minimize dependencies.
- Keep configuration isolated.
- Follow platform coding standards.

---

# Architecture Rules

- Core must not depend on plugins.
- Plugins depend on the core.
- Plugins communicate through events and public APIs.
- Plugins are independently installable.
- Plugins should be removable without affecting core functionality.

---

# Related Documents

- architecture/01-clean-architecture.md
- architecture/03-module-architecture.md
- architecture/05-api-design.md
- architecture/06-permission-system.md
- architecture/07-offline-sync.md
- domain/05-domain-events.md