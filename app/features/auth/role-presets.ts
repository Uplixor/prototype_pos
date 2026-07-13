import type { AppUser, UserRole } from "~/shared/types";

/**
 * Demo role presets mapped to app permission codes.
 * Aligns with docs/architecture/15-permission-catalog.md role matrix
 * using the app's colon-style permission vocabulary.
 */

export type DemoRoleId =
  | "owner"
  | "manager"
  | "cashier"
  | "inventory"
  | "platform";

export type RolePreset = {
  id: DemoRoleId;
  label: string;
  description: string;
  homePath: string;
  user: AppUser;
  permissions: readonly string[];
};

const OWNER_PERMISSIONS = [
  "dashboard:read",
  "catalog:read",
  "catalog:write",
  "inventory:read",
  "inventory:write",
  "sales:read",
  "sales:write",
  "sales:refund",
  "purchasing:read",
  "purchasing:write",
  "customers:read",
  "reports:read",
  "reports:sales",
  "reports:payments",
  "reports:inventory",
  "reports:export",
  "settings:read",
  "settings:write",
] as const;

const MANAGER_PERMISSIONS = [
  "dashboard:read",
  "catalog:read",
  "catalog:write",
  "inventory:read",
  "inventory:write",
  "sales:read",
  "sales:write",
  "sales:refund",
  "purchasing:read",
  "purchasing:write",
  "customers:read",
  "reports:read",
  "reports:sales",
  "reports:payments",
  "reports:inventory",
  "reports:export",
  "settings:read",
] as const;

const CASHIER_PERMISSIONS = [
  "dashboard:read",
  "catalog:read",
  "sales:read",
  "sales:write",
  "customers:read",
  "reports:sales",
  "inventory:read",
] as const;

const INVENTORY_PERMISSIONS = [
  "dashboard:read",
  "catalog:read",
  "inventory:read",
  "inventory:write",
  "purchasing:read",
  "purchasing:write",
  "sales:read",
  "reports:inventory",
] as const;

const PLATFORM_PERMISSIONS = [
  "platform:read",
  "platform:tenants",
  "platform:plans",
  "platform:audit",
  "platform:write",
] as const;

export const ROLE_PRESETS: Record<DemoRoleId, RolePreset> = {
  owner: {
    id: "owner",
    label: "Owner",
    description: "Configure the business and review all branch operations",
    homePath: "/dashboard",
    user: {
      id: "usr_owner",
      name: "Sam Okonkwo",
      email: "sam@northwind.example",
      role: "owner",
    },
    permissions: OWNER_PERMISSIONS,
  },
  manager: {
    id: "manager",
    label: "Manager",
    description: "Run branch ops, approve corrections, and view reports",
    homePath: "/dashboard",
    user: {
      id: "usr_manager",
      name: "Jordan Lee",
      email: "jordan@northwind.example",
      role: "manager",
    },
    permissions: MANAGER_PERMISSIONS,
  },
  cashier: {
    id: "cashier",
    label: "Cashier",
    description: "Sell products, take payments, and reprint receipts",
    homePath: "/pos",
    user: {
      id: "usr_cashier",
      name: "Casey Nguyen",
      email: "casey@northwind.example",
      role: "cashier",
    },
    permissions: CASHIER_PERMISSIONS,
  },
  inventory: {
    id: "inventory",
    label: "Inventory Staff",
    description: "Receive goods, count stock, transfer, and adjust",
    homePath: "/inventory",
    user: {
      id: "usr_inventory",
      name: "Riley Chen",
      email: "riley@northwind.example",
      role: "inventory",
    },
    permissions: INVENTORY_PERMISSIONS,
  },
  platform: {
    id: "platform",
    label: "SaaS Owner",
    description: "Platform admin — tenants, plans, and system operations",
    homePath: "/platform",
    user: {
      id: "usr_platform",
      name: "Morgan Platt",
      email: "morgan@commerce-os.example",
      role: "platform",
    },
    permissions: PLATFORM_PERMISSIONS,
  },
};

/** Tenant workspace roles shown in the main grid */
export const DEMO_ROLE_ORDER: DemoRoleId[] = [
  "owner",
  "manager",
  "cashier",
  "inventory",
];

export function roleLabel(role: UserRole): string {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "cashier":
      return "Cashier";
    case "inventory":
      return "Inventory Staff";
    case "viewer":
      return "Viewer";
    case "platform":
      return "SaaS Owner";
    default:
      return role;
  }
}

export function presetFromRole(role: UserRole): RolePreset {
  if (role === "owner") return ROLE_PRESETS.owner;
  if (role === "manager") return ROLE_PRESETS.manager;
  if (role === "cashier") return ROLE_PRESETS.cashier;
  if (role === "inventory") return ROLE_PRESETS.inventory;
  if (role === "platform") return ROLE_PRESETS.platform;
  return ROLE_PRESETS.owner;
}

const STORAGE_KEY = "commerce-os.demo-role";

export function loadStoredRoleId(): DemoRoleId | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY);
    if (value && value in ROLE_PRESETS) {
      return value as DemoRoleId;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function storeRoleId(roleId: DemoRoleId | null) {
  if (typeof window === "undefined") return;
  try {
    if (roleId == null) {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(STORAGE_KEY, roleId);
    }
  } catch {
    /* ignore */
  }
}
