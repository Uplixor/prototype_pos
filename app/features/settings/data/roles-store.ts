/**
 * Roles & permission grants for the MVP settings screen.
 * Codes follow the app colon vocabulary used by route guards / role presets.
 * Docs: architecture/15-permission-catalog.md (mapped to app permission strings).
 */

export type PermissionDef = {
  code: string;
  label: string;
  description?: string;
};

export type PermissionModule = {
  id: string;
  label: string;
  description?: string;
  permissions: PermissionDef[];
};

export type OrgRole = {
  id: string;
  label: string;
  description: string;
  system: boolean;
  permissions: string[];
};

export type CreateRoleInput = {
  label: string;
  description: string;
  /** Optional role to copy grants from */
  copyFromId?: string;
};

export const PERMISSION_MODULES: PermissionModule[] = [
  {
    id: "foundation",
    label: "Organization & Settings",
    description: "Dashboard access and tenant configuration",
    permissions: [
      { code: "dashboard:read", label: "View dashboard" },
      { code: "settings:read", label: "View settings" },
      { code: "settings:write", label: "Manage settings, users & roles" },
    ],
  },
  {
    id: "catalog",
    label: "Catalog",
    description: "Products, categories, units, prices, and tax profiles",
    permissions: [
      { code: "catalog:read", label: "View products & catalog" },
      { code: "catalog:write", label: "Create & update catalog" },
    ],
  },
  {
    id: "sales",
    label: "Sales & Payments",
    description: "POS, sales history, refunds, and customers",
    permissions: [
      { code: "sales:read", label: "View sales history" },
      { code: "sales:write", label: "Create sales & record payments" },
      { code: "sales:refund", label: "Issue refunds" },
      { code: "customers:read", label: "View customers" },
    ],
  },
  {
    id: "inventory",
    label: "Purchasing & Inventory",
    description: "Stock, purchases, receipts, counts, and transfers",
    permissions: [
      { code: "inventory:read", label: "View stock & movements" },
      { code: "inventory:write", label: "Adjust, count & transfer stock" },
      { code: "purchasing:read", label: "View purchases & receipts" },
      { code: "purchasing:write", label: "Create purchases & receive goods" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    description: "Operational reports and exports",
    permissions: [
      { code: "reports:read", label: "View reports hub" },
      { code: "reports:sales", label: "Sales reports" },
      { code: "reports:payments", label: "Payment reports" },
      { code: "reports:inventory", label: "Inventory reports" },
      { code: "reports:export", label: "Export reports" },
    ],
  },
];

const OWNER_GRANTS = PERMISSION_MODULES.flatMap((m) =>
  m.permissions.map((p) => p.code),
);

const MANAGER_GRANTS = OWNER_GRANTS.filter((c) => c !== "settings:write");

const CASHIER_GRANTS = [
  "dashboard:read",
  "catalog:read",
  "sales:read",
  "sales:write",
  "customers:read",
  "reports:sales",
  "inventory:read",
];

const INVENTORY_GRANTS = [
  "dashboard:read",
  "catalog:read",
  "inventory:read",
  "inventory:write",
  "purchasing:read",
  "purchasing:write",
  "sales:read",
  "reports:inventory",
];

let roles: OrgRole[] = [
  {
    id: "owner",
    label: "Owner",
    description: "Full Organization access including settings and roles",
    system: true,
    permissions: [...OWNER_GRANTS],
  },
  {
    id: "manager",
    label: "Manager",
    description: "Branch operations, refunds, and reporting without role admin",
    system: true,
    permissions: [...MANAGER_GRANTS],
  },
  {
    id: "cashier",
    label: "Cashier",
    description: "POS sales, payments, and limited sales reporting",
    system: true,
    permissions: [...CASHIER_GRANTS],
  },
  {
    id: "inventory",
    label: "Inventory Staff",
    description: "Receiving, counts, transfers, and inventory reports",
    system: true,
    permissions: [...INVENTORY_GRANTS],
  },
];

let roleSeq = 1;

function delay(ms = 80) {
  return new Promise((r) => setTimeout(r, ms));
}

function slugify(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export async function listRoles(): Promise<OrgRole[]> {
  await delay();
  return roles.map((r) => ({ ...r, permissions: [...r.permissions] }));
}

export async function getRole(id: string): Promise<OrgRole> {
  await delay();
  const role = roles.find((r) => r.id === id);
  if (!role) throw new Error("Role not found");
  return { ...role, permissions: [...role.permissions] };
}

export async function createRole(input: CreateRoleInput): Promise<OrgRole> {
  await delay(120);
  const label = input.label.trim();
  if (!label) throw new Error("Role name is required");

  const base = slugify(label) || `role-${roleSeq}`;
  let id = base;
  if (roles.some((r) => r.id === id)) {
    id = `${base}-${roleSeq}`;
  }
  roleSeq += 1;

  const source = input.copyFromId
    ? roles.find((r) => r.id === input.copyFromId)
    : undefined;

  const next: OrgRole = {
    id,
    label,
    description: input.description.trim() || "Custom organization role",
    system: false,
    permissions: source ? [...source.permissions] : [...CASHIER_GRANTS],
  };
  roles = [...roles, next];
  return { ...next, permissions: [...next.permissions] };
}

export async function updateRolePermissions(
  id: string,
  permissions: string[],
): Promise<OrgRole> {
  await delay(120);
  const idx = roles.findIndex((r) => r.id === id);
  if (idx < 0) throw new Error("Role not found");
  const next = {
    ...roles[idx]!,
    permissions: [...new Set(permissions)].sort(),
  };
  roles = roles.map((r, i) => (i === idx ? next : r));
  return { ...next, permissions: [...next.permissions] };
}

export function allPermissionCodes(): string[] {
  return PERMISSION_MODULES.flatMap((m) => m.permissions.map((p) => p.code));
}
