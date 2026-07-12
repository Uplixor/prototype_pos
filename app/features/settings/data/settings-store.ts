export type OrgSettings = {
  id: string;
  name: string;
  legalName: string;
  timezone: string;
  currency: string;
  taxId: string;
};

export type BranchRecord = {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  status: "active" | "archived";
  address: string;
};

export type MembershipUser = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "manager" | "cashier" | "inventory";
  status: "active" | "invited" | "revoked";
  branchScope: "all" | string[];
};

let org: OrgSettings = {
  id: "org_demo",
  name: "Northwind Commerce",
  legalName: "Northwind Commerce LLC",
  timezone: "America/New_York",
  currency: "USD",
  taxId: "12-3456789",
};

let branches: BranchRecord[] = [
  {
    id: "br_hq",
    organizationId: "org_demo",
    name: "Headquarters",
    code: "HQ",
    status: "active",
    address: "100 Market St",
  },
  {
    id: "br_dt",
    organizationId: "org_demo",
    name: "Downtown",
    code: "DT",
    status: "active",
    address: "22 Center Ave",
  },
  {
    id: "br_ml",
    organizationId: "org_demo",
    name: "Mall Kiosk",
    code: "ML",
    status: "active",
    address: "Level 2 Food Court",
  },
];

let users: MembershipUser[] = [
  {
    id: "u1",
    name: "Alex Morgan",
    email: "alex@northwind.example",
    role: "admin",
    status: "active",
    branchScope: "all",
  },
  {
    id: "u2",
    name: "Sam Rivera",
    email: "sam@northwind.example",
    role: "manager",
    status: "active",
    branchScope: ["br_hq", "br_dt"],
  },
  {
    id: "u3",
    name: "Jamie Chen",
    email: "jamie@northwind.example",
    role: "cashier",
    status: "active",
    branchScope: ["br_dt"],
  },
  {
    id: "u4",
    name: "Taylor Brooks",
    email: "taylor@northwind.example",
    role: "inventory",
    status: "invited",
    branchScope: ["br_hq"],
  },
];

const delay = (ms = 160) => new Promise((r) => setTimeout(r, ms));

export async function getOrgSettings() {
  await delay(80);
  return { ...org };
}

export async function updateOrgSettings(input: Partial<OrgSettings>) {
  await delay();
  org = { ...org, ...input };
  return { ...org };
}

export async function listBranches() {
  await delay();
  return branches.map((b) => ({ ...b }));
}

export async function createBranch(
  input: Omit<BranchRecord, "id" | "status" | "organizationId"> & {
    organizationId?: string;
  },
) {
  await delay();
  const branch: BranchRecord = {
    id: `br_${Date.now()}`,
    organizationId: input.organizationId ?? "org_demo",
    name: input.name,
    code: input.code,
    address: input.address,
    status: "active",
  };
  branches = [branch, ...branches];
  return { ...branch };
}

export async function archiveBranch(id: string) {
  await delay(100);
  branches = branches.map((b) =>
    b.id === id ? { ...b, status: "archived" as const } : b,
  );
}

export async function listUsers() {
  await delay();
  return users.map((u) => ({ ...u }));
}

export async function inviteUser(input: {
  name: string;
  email: string;
  role: MembershipUser["role"];
}) {
  await delay();
  const user: MembershipUser = {
    id: `u_${Date.now()}`,
    name: input.name,
    email: input.email,
    role: input.role,
    status: "invited",
    branchScope: "all",
  };
  users = [user, ...users];
  return { ...user };
}

export async function revokeUser(id: string) {
  await delay(100);
  users = users.map((u) =>
    u.id === id ? { ...u, status: "revoked" as const } : u,
  );
}
