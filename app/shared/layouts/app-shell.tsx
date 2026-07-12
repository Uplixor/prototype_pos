import { Outlet } from "react-router";
import { CommandPalette } from "~/shared/components/command-palette/command-palette";
import { DrawerHost } from "~/shared/components/drawer/drawer-host";
import { Sidebar } from "~/shared/layouts/sidebar";
import { Topbar } from "~/shared/layouts/topbar";

function AppShell() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-h-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
      <DrawerHost />
    </div>
  );
}

export { AppShell };
