import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { layout } from "~/theme/tokens";

type ShellContextValue = {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  sidebarWidth: number;
};

const ShellContext = createContext<ShellContextValue | null>(null);

export type ShellProviderProps = {
  children: ReactNode;
};

function ShellProvider({ children }: ShellProviderProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar,
      sidebarWidth: sidebarCollapsed
        ? layout.sidebarCollapsedWidth
        : layout.sidebarWidth,
    }),
    [sidebarCollapsed, toggleSidebar],
  );

  return (
    <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
  );
}

function useShell(): ShellContextValue {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within ShellProvider");
  }
  return context;
}

export { ShellProvider, useShell };
