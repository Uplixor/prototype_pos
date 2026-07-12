import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppUser,
  Branch,
  CapabilityId,
  Organization,
  Workspace,
  WorkspaceContextValue,
} from "~/shared/types";

const DEFAULT_ORG: Organization = {
  id: "org_demo",
  name: "Northwind Commerce",
  slug: "northwind",
};

const DEFAULT_BRANCH: Branch = {
  id: "br_hq",
  organizationId: DEFAULT_ORG.id,
  name: "Headquarters",
  code: "HQ",
};

const DEFAULT_WORKSPACE: Workspace = {
  id: "ws_ops",
  name: "Operations",
  organizationId: DEFAULT_ORG.id,
};

const DEFAULT_USER: AppUser = {
  id: "usr_admin",
  name: "Alex Morgan",
  email: "alex@northwind.example",
  role: "admin",
};

const DEFAULT_CAPABILITIES: CapabilityId[] = [
  "core",
  "retail",
  "cafe",
  "delivery",
];

const DEFAULT_PERMISSIONS = [
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
  "settings:read",
  "settings:write",
] as const;

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export type WorkspaceProviderProps = {
  children: ReactNode;
};

function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [organization, setOrganization] = useState(DEFAULT_ORG);
  const [branch, setBranch] = useState(DEFAULT_BRANCH);
  const [workspace, setWorkspace] = useState(DEFAULT_WORKSPACE);
  const [isOnline] = useState(true);

  const handleSetOrganization = useCallback((next: Organization) => {
    setOrganization(next);
  }, []);

  const handleSetBranch = useCallback((next: Branch) => {
    setBranch(next);
  }, []);

  const handleSetWorkspace = useCallback((next: Workspace) => {
    setWorkspace(next);
  }, []);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      organization,
      branch,
      workspace,
      user: DEFAULT_USER,
      enabledCapabilities: DEFAULT_CAPABILITIES,
      permissions: DEFAULT_PERMISSIONS,
      isOnline,
      setOrganization: handleSetOrganization,
      setBranch: handleSetBranch,
      setWorkspace: handleSetWorkspace,
    }),
    [
      organization,
      branch,
      workspace,
      isOnline,
      handleSetOrganization,
      handleSetBranch,
      handleSetWorkspace,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
}

export { WorkspaceProvider, useWorkspace };
