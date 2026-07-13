import { Outlet } from "react-router";
import { CommandPalette } from "~/shared/components/command-palette/command-palette";
import { DrawerHost } from "~/shared/components/drawer/drawer-host";
import { Sidebar } from "~/shared/layouts/sidebar";
import { Topbar } from "~/shared/layouts/topbar";
import {
  ShellLayoutProvider,
  useShellLayout,
} from "~/shared/providers/shell-layout-provider";
import { cn } from "~/shared/utils/cn";

function ManagementShell() {
  const { desktopExpanded, mobileOpen, setMobileOpen } = useShellLayout();

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <Sidebar />
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-[margin] duration-200",
          desktopExpanded ? "lg:ml-64" : "lg:ml-14",
        )}
      >
        <Topbar />
        <main className="min-h-0 flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
      <DrawerHost />
    </div>
  );
}

function AppShell() {
  return (
    <ShellLayoutProvider>
      <ManagementShell />
    </ShellLayoutProvider>
  );
}

export { AppShell };
