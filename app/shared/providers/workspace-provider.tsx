import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ROLE_PRESETS,
  loadStoredRoleId,
  storeRoleId,
  type DemoRoleId,
} from "~/features/auth/role-presets";
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

export const DEMO_BRANCHES: Branch[] = [
  {
    id: "br_hq",
    organizationId: DEFAULT_ORG.id,
    name: "Headquarters",
    code: "HQ",
  },
  {
    id: "br_dt",
    organizationId: DEFAULT_ORG.id,
    name: "Downtown",
    code: "DT",
  },
  {
    id: "br_ml",
    organizationId: DEFAULT_ORG.id,
    name: "Mall Kiosk",
    code: "ML",
  },
];

const DEFAULT_BRANCH = DEMO_BRANCHES[0]!;

const DEFAULT_WORKSPACE: Workspace = {
  id: "ws_ops",
  name: "Operations",
  organizationId: DEFAULT_ORG.id,
};

const DEFAULT_CAPABILITIES: CapabilityId[] = [
  "core",
  "retail",
  "cafe",
  "delivery",
];

const UNAUTH_USER: AppUser = {
  id: "usr_guest",
  name: "Guest",
  email: "",
  role: "viewer",
};

const EMPTY_PERMISSIONS: readonly string[] = [];

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export type WorkspaceProviderProps = {
  children: ReactNode;
};

/** Read session only in the browser; SSR stays logged out to avoid mismatches. */
function readClientRole(): DemoRoleId | null {
  if (typeof window === "undefined") return null;
  return loadStoredRoleId();
}

function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  // Lazy init runs once per mount on the client — no useEffect session gate.
  const [roleId, setRoleId] = useState<DemoRoleId | null>(readClientRole);
  const [organization, setOrganization] = useState(DEFAULT_ORG);
  const [branch, setBranch] = useState(DEFAULT_BRANCH);
  const [workspace, setWorkspace] = useState(DEFAULT_WORKSPACE);
  const [isOnline] = useState(true);

  const preset = roleId ? ROLE_PRESETS[roleId] : null;

  const handleSetOrganization = useCallback((next: Organization) => {
    setOrganization(next);
  }, []);

  const handleSetBranch = useCallback((next: Branch) => {
    setBranch(next);
  }, []);

  const handleSetWorkspace = useCallback((next: Workspace) => {
    setWorkspace(next);
  }, []);

  const assumeRole = useCallback((next: DemoRoleId) => {
    storeRoleId(next);
    setRoleId(next);
  }, []);

  const signOut = useCallback(() => {
    storeRoleId(null);
    setRoleId(null);
  }, []);

  const permissions = preset?.permissions ?? EMPTY_PERMISSIONS;
  const user = preset?.user ?? UNAUTH_USER;
  const homePath = preset?.homePath ?? "/login";
  const isAuthenticated = roleId != null;

  const hasPermission = useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions],
  );

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      organization,
      branch,
      workspace,
      user,
      enabledCapabilities: DEFAULT_CAPABILITIES,
      permissions,
      isOnline,
      isAuthenticated,
      homePath,
      setOrganization: handleSetOrganization,
      setBranch: handleSetBranch,
      setWorkspace: handleSetWorkspace,
      assumeRole,
      signOut,
      hasPermission,
    }),
    [
      organization,
      branch,
      workspace,
      user,
      permissions,
      isOnline,
      isAuthenticated,
      homePath,
      handleSetOrganization,
      handleSetBranch,
      handleSetWorkspace,
      assumeRole,
      signOut,
      hasPermission,
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

export { WorkspaceProvider, useWorkspace, DEFAULT_ORG };
