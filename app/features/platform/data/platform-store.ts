/**
 * Platform (SaaS) tenant registry — outside Organization roles.
 * Docs: platform administration permissions are outside tenant roles.
 */

export type TenantStatus = "active" | "trial" | "suspended" | "churned";

export type TenantPlan = "starter" | "growth" | "enterprise";

export type PlatformTenant = {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  status: TenantStatus;
  branches: number;
  users: number;
  mrr: number;
  createdAt: string;
  region: string;
};

export type PlatformPlan = {
  id: TenantPlan;
  label: string;
  monthlyPrice: number;
  tenants: number;
  capabilities: string[];
};

export type PlatformAuditEntry = {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
  detail: string;
};

let tenants: PlatformTenant[] = [
  {
    id: "ten_northwind",
    name: "Northwind Commerce",
    slug: "northwind",
    plan: "growth",
    status: "active",
    branches: 3,
    users: 18,
    mrr: 249,
    createdAt: "2025-11-02",
    region: "us-east",
  },
  {
    id: "ten_harbor",
    name: "Harbor Bakery Group",
    slug: "harbor-bakery",
    plan: "starter",
    status: "trial",
    branches: 1,
    users: 4,
    mrr: 0,
    createdAt: "2026-06-28",
    region: "us-west",
  },
  {
    id: "ten_lotus",
    name: "Lotus Pharmacy",
    slug: "lotus-rx",
    plan: "enterprise",
    status: "active",
    branches: 12,
    users: 64,
    mrr: 1890,
    createdAt: "2024-03-14",
    region: "eu-central",
  },
  {
    id: "ten_metro",
    name: "Metro Cafe Co",
    slug: "metro-cafe",
    plan: "growth",
    status: "suspended",
    branches: 5,
    users: 22,
    mrr: 0,
    createdAt: "2025-01-19",
    region: "us-east",
  },
  {
    id: "ten_oak",
    name: "Oak & Grain Retail",
    slug: "oak-grain",
    plan: "starter",
    status: "churned",
    branches: 2,
    users: 6,
    mrr: 0,
    createdAt: "2024-08-01",
    region: "ap-south",
  },
];

const plans: PlatformPlan[] = [
  {
    id: "starter",
    label: "Starter",
    monthlyPrice: 79,
    tenants: 1,
    capabilities: ["core", "retail"],
  },
  {
    id: "growth",
    label: "Growth",
    monthlyPrice: 249,
    tenants: 1,
    capabilities: ["core", "retail", "cafe", "delivery"],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    monthlyPrice: 0,
    tenants: 1,
    capabilities: ["core", "retail", "cafe", "delivery", "pharmacy"],
  },
];

let audit: PlatformAuditEntry[] = [
  {
    id: "pa1",
    at: "2026-07-12T08:14:00Z",
    actor: "Morgan Platt",
    action: "tenant.suspend",
    target: "Metro Cafe Co",
    detail: "Payment failure — auto-suspend after 14 days",
  },
  {
    id: "pa2",
    at: "2026-07-11T16:02:00Z",
    actor: "Morgan Platt",
    action: "plan.change",
    target: "Lotus Pharmacy",
    detail: "Upgraded Growth → Enterprise",
  },
  {
    id: "pa3",
    at: "2026-07-10T11:40:00Z",
    actor: "system",
    action: "tenant.provision",
    target: "Harbor Bakery Group",
    detail: "Trial org created from self-serve signup",
  },
  {
    id: "pa4",
    at: "2026-07-09T09:18:00Z",
    actor: "Morgan Platt",
    action: "capability.enable",
    target: "Northwind Commerce",
    detail: "Enabled delivery capability pack",
  },
];

function delay(ms = 80) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function listTenants(): Promise<PlatformTenant[]> {
  await delay();
  return tenants.map((t) => ({ ...t }));
}

export async function setTenantStatus(
  id: string,
  status: TenantStatus,
): Promise<PlatformTenant> {
  await delay(100);
  const idx = tenants.findIndex((t) => t.id === id);
  if (idx < 0) throw new Error("Tenant not found");
  const next = { ...tenants[idx]!, status, mrr: status === "active" ? tenants[idx]!.mrr || 249 : 0 };
  tenants = tenants.map((t, i) => (i === idx ? next : t));
  audit = [
    {
      id: `pa_${Date.now()}`,
      at: new Date().toISOString(),
      actor: "Morgan Platt",
      action: `tenant.${status}`,
      target: next.name,
      detail: `Status set to ${status}`,
    },
    ...audit,
  ];
  return { ...next };
}

export async function listPlans(): Promise<PlatformPlan[]> {
  await delay();
  return plans.map((p) => ({
    ...p,
    tenants: tenants.filter((t) => t.plan === p.id && t.status !== "churned")
      .length,
    capabilities: [...p.capabilities],
  }));
}

export async function listPlatformAudit(): Promise<PlatformAuditEntry[]> {
  await delay();
  return audit.map((a) => ({ ...a }));
}

export async function getPlatformMetrics() {
  await delay();
  const active = tenants.filter((t) => t.status === "active");
  const trial = tenants.filter((t) => t.status === "trial");
  const suspended = tenants.filter((t) => t.status === "suspended");
  return {
    tenants: tenants.length,
    active: active.length,
    trial: trial.length,
    suspended: suspended.length,
    mrr: active.reduce((s, t) => s + t.mrr, 0),
    users: tenants.reduce((s, t) => s + t.users, 0),
  };
}
