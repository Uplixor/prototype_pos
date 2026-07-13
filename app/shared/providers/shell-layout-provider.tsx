import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router";

type ShellLayoutContextValue = {
  /** Desktop: full labels vs icon rail. */
  desktopExpanded: boolean;
  setDesktopExpanded: (expanded: boolean) => void;
  toggleDesktop: () => void;
  /** Mobile: overlay drawer. */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  isMobile: boolean;
};

const ShellLayoutContext = createContext<ShellLayoutContextValue | null>(null);

const STORAGE_KEY = "commerce_os_sidebar_expanded";

function readStoredExpanded(): boolean {
  if (typeof window === "undefined") return true;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return true;
  return raw === "1";
}

function ShellLayoutProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [desktopExpanded, setDesktopExpandedState] =
    useState(readStoredExpanded);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => {
      setIsMobile(mq.matches);
      if (!mq.matches) setMobileOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const setDesktopExpanded = useCallback((expanded: boolean) => {
    setDesktopExpandedState(expanded);
    window.localStorage.setItem(STORAGE_KEY, expanded ? "1" : "0");
  }, []);

  const toggleDesktop = useCallback(() => {
    setDesktopExpanded(!desktopExpanded);
  }, [desktopExpanded, setDesktopExpanded]);

  const toggleMobile = useCallback(() => {
    setMobileOpen((open) => !open);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const value = useMemo(
    () => ({
      desktopExpanded,
      setDesktopExpanded,
      toggleDesktop,
      mobileOpen,
      setMobileOpen,
      toggleMobile,
      isMobile,
    }),
    [
      desktopExpanded,
      setDesktopExpanded,
      toggleDesktop,
      mobileOpen,
      toggleMobile,
      isMobile,
    ],
  );

  return (
    <ShellLayoutContext.Provider value={value}>
      {children}
    </ShellLayoutContext.Provider>
  );
}

function useShellLayout() {
  const ctx = useContext(ShellLayoutContext);
  if (!ctx) {
    throw new Error("useShellLayout must be used within ShellLayoutProvider");
  }
  return ctx;
}

export { ShellLayoutProvider, useShellLayout };
