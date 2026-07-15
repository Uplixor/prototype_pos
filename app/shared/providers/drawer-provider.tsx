import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DrawerSize = "sm" | "md" | "lg";

export type DrawerState = {
  id: string;
  title: string;
  description?: string;
  size?: DrawerSize;
  /** When true, title/description chrome is hidden — content owns the header */
  hideHeader?: boolean;
  content: ReactNode;
};

type DrawerContextValue = {
  stack: DrawerState[];
  openDrawer: (drawer: DrawerState) => void;
  closeDrawer: (id?: string) => void;
  closeAll: () => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

export type DrawerProviderProps = {
  children: ReactNode;
};

function DrawerProvider({ children }: DrawerProviderProps) {
  const [stack, setStack] = useState<DrawerState[]>([]);

  const openDrawer = useCallback((drawer: DrawerState) => {
    setStack((prev) => {
      const without = prev.filter((item) => item.id !== drawer.id);
      return [...without, drawer];
    });
  }, []);

  const closeDrawer = useCallback((id?: string) => {
    setStack((prev) => {
      if (!id) {
        return prev.slice(0, -1);
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const closeAll = useCallback(() => {
    setStack([]);
  }, []);

  const value = useMemo(
    () => ({ stack, openDrawer, closeDrawer, closeAll }),
    [stack, openDrawer, closeDrawer, closeAll],
  );

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
}

function useDrawer(): DrawerContextValue {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within DrawerProvider");
  }
  return context;
}

export { DrawerProvider, useDrawer };
