# 15. MVP Permission Catalog

> Status: Draft
> Owner: Architecture Team
> Created: 2026-07-11
> Updated: 2026-07-11

---

# Purpose

This document defines the permission codes and default role grants for the MVP.

Roles are Organization-defined collections of permissions. Code must authorize permissions, never role names.

---

# Permission Rules

- A permission grants an action, not unrestricted access to an entire table or screen.
- Every granted action is still constrained by Organization, Branch, capability, ownership, and Aggregate state.
- A disabled capability makes its permissions unavailable for new actions.
- Platform administration permissions are outside tenant roles.
- A permission may be granted to all Branches or selected Branches through Membership Role scope.

---

# Foundation Permissions

| Permission | Allows | Restriction |
|---|---|---|
| `organization.read` | View Organization profile and configuration. | Current Organization only. |
| `organization.update` | Change permitted Organization settings. | Does not manage platform billing or global policy. |
| `branch.read` | View authorized Branches. | Membership Branch scope applies. |
| `branch.manage` | Create, update, archive Branches. | Organization-wide management only. |
| `user.read` | View Organization memberships. | Does not reveal another Organization. |
| `user.invite` | Invite a user to the Organization. | Requires authorized role assignment. |
| `user.revoke` | Revoke a Membership. | Cannot revoke the final required owner under policy. |
| `role.read` | View roles and grants. | Organization only. |
| `role.manage` | Create roles and assign permission grants. | Cannot grant unavailable platform permissions. |
| `capability.read` | View enabled capabilities. | Organization only. |
| `capability.manage` | Enable, suspend, or configure entitled capabilities. | Requires plan and policy validation. |
| `audit.read` | View permitted audit history. | Sensitive audit fields remain restricted. |

---

# Catalog Permissions

| Permission | Allows |
|---|---|
| `catalog.read` | View Products, Categories, Units, prices, tax profiles, and sellability. |
| `catalog.create` | Create Products, Categories, Units, and supported catalog records. |
| `catalog.update` | Change future Product, price, tax, and availability configuration. |
| `catalog.archive` | Archive a Product or supported catalog record. |
| `catalog.price.manage` | Create and end effective price definitions. |
| `catalog.tax.manage` | Create and end tax profile and tax-rate definitions. |

Catalog permissions never allow mutation of a completed Sale snapshot.

---

# Sales and Payment Permissions

| Permission | Allows | Restriction |
|---|---|---|
| `sale.read` | View authorized Sales. | Branch scope applies. |
| `sale.create` | Open a Sale. | Active sellable Products only. |
| `sale.update` | Amend an Open Sale. | Completed Sales cannot be changed. |
| `sale.cancel` | Cancel an eligible Sale. | Cancellation retains history. |
| `sale.complete` | Request eligible completion. | Requires permitted payment outcome. |
| `payment.read` | View Payments and Refunds. | Branch scope applies. |
| `payment.record` | Record an eligible payment. | Cannot create duplicate Payment. |
| `payment.refund` | Issue an eligible Refund. | Cannot exceed refundable amount. |
| `receipt.read` | View or reprint a receipt. | Does not modify the Sale. |

---

# Purchasing and Inventory Permissions

| Permission | Allows | Restriction |
|---|---|---|
| `supplier.read` | View Suppliers. | Organization scope applies. |
| `supplier.manage` | Create, update, or archive Suppliers. | Historical purchase references remain. |
| `purchase.read` | View Purchases and Goods Receipts. | Branch scope applies. |
| `purchase.create` | Create or update eligible Purchase drafts. | Does not increase stock. |
| `purchase.order` | Mark Purchase as ordered. | Supplier and item policy apply. |
| `purchase.receive` | Confirm Goods Receipt. | Creates accountable inbound stock. |
| `inventory.read` | View Stock Movements and availability. | Availability remains a projection. |
| `inventory.adjust` | Create reasoned Stock Adjustment. | Never edits a balance. |
| `inventory.count` | Submit Stock Count. | Approval policy may be separate. |
| `inventory.count.approve` | Approve count reconciliation. | Creates immutable movement. |
| `inventory.transfer` | Create and receive Stock Transfer. | Origin and destination must share Organization. |

---

# Reporting Permissions

| Permission | Allows |
|---|---|
| `report.sales.view` | View authorized sales and revenue reports. |
| `report.payments.view` | View authorized payment and refund reports. |
| `report.inventory.view` | View authorized stock and movement reports. |
| `report.export` | Generate tenant-scoped report exports. |

Report permissions do not grant access to underlying records outside permitted Organization and Branch scope.

---

# Default Role Matrix

| Permission Group | Owner | Manager | Cashier | Inventory Staff |
|---|:---:|:---:|:---:|:---:|
| Organization, Branch, Users, Roles | Yes | Read; limited by policy | No | No |
| Capability and Audit | Yes | Read | No | No |
| Catalog | Yes | Yes | Read | Read |
| Sales | Yes | Yes | Create, update, complete | Read |
| Payments | Yes | Record, refund | Record | Read |
| Suppliers and Purchasing | Yes | Yes | No | Create, order, receive |
| Inventory | Yes | Yes | Read | Read, adjust, count, transfer |
| Reports and Exports | Yes | Yes | Limited sales view | Inventory view |

The matrix is a starting grant set. Organizations may create custom roles, but custom roles cannot create new permission codes or weaken the listed business restrictions.

---

# Architecture Rules

- Authorization is evaluated by public Application Services, not UI route visibility.
- Roles never cross Organizations.
- A Branch-scoped grant cannot operate in another Branch.
- Permission decisions and sensitive denials are auditable.
- New capability features must add their permission codes to this catalog before implementation.

---

# Related Documents

- 06-permission-system.md
- 10-multi-tenancy-architecture.md
- ../implementation/02-authentication-and-tenant-guide.md
- ../data/commerce-platform-mvp.dbml
