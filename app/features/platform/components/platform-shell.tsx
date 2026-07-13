import { Link, NavLink, Outlet, useNavigate } from "react-router";
import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Layers,
  Shield,
} from "lucide-react";
import { EntityAvatar } from "~/shared/components/entity-avatar";
import { Button } from "~/shared/components/ui/button";
import { useWorkspace } from "~/shared/providers/workspace-provider";
import { cn } from "~/shared/utils/cn";

const NAV = [
  {
    id: "overview",
    label: "Overview",
    href: "/platform",
    icon: LayoutDashboard,
    end: true,
  },
  {
    id: "tenants",
    label: "Tenants",
    href: "/platform/tenants",
    icon: Building2,
  },
  {
    id: "plans",
    label: "Plans & Capabilities",
    href: "/platform/plans",
    icon: Layers,
  },
  {
    id: "audit",
    label: "Platform Audit",
    href: "/platform/audit",
    icon: ClipboardList,
  },
] as const;

/**
 * Same design system as tenant app, with persistent Platform context cues:
 * left accent rail, console badge, and topbar status — not a separate theme.
 */
function PlatformShell() {
  const navigate = useNavigate();
  const { user, signOut } = useWorkspace();

  function handleSignOut() {
    signOut();
    void navigate("/login");
  }

  return (
    <div className="relative flex h-dvh w-full overflow-hidden bg-background">
      {/* Context rail — always visible: you are in the control plane */}
      <div
        className="absolute inset-y-0 left-0 z-50 w-1 bg-primary"
        aria-hidden
      />

      <aside className="ml-1 flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="border-b border-sidebar-border px-4 py-4">
          <Link to="/platform" className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded bg-primary text-[12px] font-bold text-primary-foreground">
              CO
            </span>
            <span className="min-w-0">
              <span className="inline-flex items-center gap-1 rounded bg-primary-muted px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
                <Shield className="size-3" strokeWidth={2} aria-hidden />
                Platform
              </span>
              <span className="mt-1 block truncate text-[14px] font-semibold text-heading">
                Commerce OS Admin
              </span>
            </span>
          </Link>
        </div>

        <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          System
        </p>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.href}
                end={"end" in item ? item.end : false}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-[12px] font-medium transition-colors",
                    isActive
                      ? "border-r-4 border-primary bg-card font-semibold text-primary"
                      : "text-body hover:bg-card",
                  )
                }
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="mb-2 flex items-center gap-2 px-1">
            <EntityAvatar name={user.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium text-heading">
                {user.name}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                SaaS Owner
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-start gap-2 text-muted-foreground hover:text-heading"
            onClick={handleSignOut}
          >
            <LogOut className="size-3.5" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 rounded border border-primary/20 bg-primary-muted px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
              Platform console
            </span>
            <span className="hidden truncate text-[12px] text-muted-foreground sm:inline">
              Managing Organizations across the platform — not a tenant workspace
            </span>
          </div>
          <span className="hidden shrink-0 text-[11px] text-muted-foreground md:inline">
            {user.email}
          </span>
        </header>
        <main className="min-h-0 flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { PlatformShell };
