import type { CapabilityId } from "./capability";

export type Organization = {
  id: string;
  name: string;
  slug: string;
};

export type Branch = {
  id: string;
  organizationId: string;
  name: string;
  code: string;
};

export type Workspace = {
  id: string;
  name: string;
  organizationId: string;
};

export type UserRole =
  | "owner"
  | "admin"
  | "manager"
  | "cashier"
  | "inventory"
  | "viewer"
  | "platform";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
};

export type WorkspaceContextValue = {
  organization: Organization;
  branch: Branch;
  workspace: Workspace;
  user: AppUser;
  enabledCapabilities: CapabilityId[];
  permissions: readonly string[];
  isOnline: boolean;
  isAuthenticated: boolean;
  homePath: string;
  setOrganization: (organization: Organization) => void;
  setBranch: (branch: Branch) => void;
  setWorkspace: (workspace: Workspace) => void;
  /** Apply a demo role preset (tenant roles or SaaS platform owner). */
  assumeRole: (
    roleId: "owner" | "manager" | "cashier" | "inventory" | "platform",
  ) => void;
  signOut: () => void;
  hasPermission: (permission: string) => boolean;
};
