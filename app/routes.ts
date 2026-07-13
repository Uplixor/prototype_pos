import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("login", "routes/login.tsx"),
  layout("routes/platform-layout.tsx", [
    route("platform", "routes/platform._index.tsx"),
    route("platform/tenants", "routes/platform.tenants.tsx"),
    route("platform/plans", "routes/platform.plans.tsx"),
    route("platform/audit", "routes/platform.audit.tsx"),
  ]),
  layout("routes/app-layout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("pos", "routes/pos.tsx"),
    route("catalog", "routes/catalog.tsx"),
    route("catalog/categories", "routes/catalog.categories.tsx"),
    route("catalog/units", "routes/catalog.units.tsx"),
    route("catalog/pricing", "routes/catalog.pricing.tsx"),
    route("sales", "routes/sales.tsx"),
    route("inventory", "routes/inventory.tsx"),
    route("inventory/adjustments", "routes/inventory.adjustments.tsx"),
    route("inventory/counts", "routes/inventory.counts.tsx"),
    route("inventory/movements", "routes/inventory.movements.tsx"),
    route("purchasing", "routes/purchasing.tsx"),
    route("purchasing/receipts", "routes/purchasing.receipts.tsx"),
    route("transfers", "routes/transfers.tsx"),
    route("reports", "routes/reports.tsx"),
    route("reports/sales", "routes/reports.sales.tsx"),
    route("reports/payments", "routes/reports.payments.tsx"),
    route("reports/inventory", "routes/reports.inventory.tsx"),
    route("settings", "routes/settings.tsx"),
    route("settings/branches", "routes/settings.branches.tsx"),
    route("settings/users", "routes/settings.users.tsx"),
    route("settings/roles", "routes/settings.roles.tsx"),
  ]),
] satisfies RouteConfig;
