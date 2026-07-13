import { useNavigate } from "react-router";
import {
  Bell,
  Bolt,
  ChevronsUpDown,
  CircleHelp,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import {
  DEMO_ROLE_ORDER,
  ROLE_PRESETS,
  roleLabel,
  type DemoRoleId,
} from "~/features/auth/role-presets";
import { EntityAvatar } from "~/shared/components/entity-avatar";
import { Button } from "~/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/shared/components/ui/dropdown-menu";
import { useCommandPalette } from "~/shared/providers/command-palette-provider";
import { useShellLayout } from "~/shared/providers/shell-layout-provider";
import {
  DEMO_BRANCHES,
  useWorkspace,
} from "~/shared/providers/workspace-provider";
import { cn } from "~/shared/utils/cn";

function Topbar() {
  const navigate = useNavigate();
  const { setOpen } = useCommandPalette();
  const { mobileOpen, toggleMobile, isMobile } = useShellLayout();
  const {
    organization,
    branch,
    user,
    setBranch,
    assumeRole,
    signOut,
    homePath,
    hasPermission,
  } = useWorkspace();

  function switchRole(roleId: DemoRoleId) {
    assumeRole(roleId);
    void navigate(ROLE_PRESETS[roleId].homePath);
  }

  function handleSignOut() {
    signOut();
    void navigate("/login");
  }

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-3 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        {isMobile ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={toggleMobile}
          >
            <Menu className="size-4" />
          </Button>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="max-w-[220px] gap-1.5 border-border-strong"
            >
              <span className="truncate text-[12px]">
                {organization.name} · {branch.code}
              </span>
              <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Branch</DropdownMenuLabel>
            {DEMO_BRANCHES.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onSelect={() => setBranch(item)}
                className={cn(item.id === branch.id && "bg-accent")}
              >
                <span className="font-medium">{item.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {item.code}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative hidden h-8 min-w-[240px] flex-1 items-center gap-2 rounded border border-border bg-muted px-2.5 text-left text-[13px] text-muted-foreground transition-colors hover:border-primary md:inline-flex md:max-w-md"
        >
          <Search className="size-3.5 shrink-0" aria-hidden />
          <span className="flex-1">Search (Ctrl+K)</span>
          <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px]">
            Ctrl+K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="sm"
              className="hidden h-8 gap-1 text-[12px] font-medium sm:inline-flex"
            >
              <Bolt className="size-3.5" />
              Quick Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {hasPermission("sales:write") ? (
              <DropdownMenuItem onSelect={() => void navigate("/pos")}>
                New Order (POS)
              </DropdownMenuItem>
            ) : null}
            {hasPermission("sales:read") ? (
              <DropdownMenuItem onSelect={() => void navigate("/sales")}>
                Sales History
              </DropdownMenuItem>
            ) : null}
            {hasPermission("catalog:read") ? (
              <DropdownMenuItem onSelect={() => void navigate("/catalog")}>
                Products
              </DropdownMenuItem>
            ) : null}
            {hasPermission("purchasing:write") ? (
              <DropdownMenuItem onSelect={() => void navigate("/purchasing")}>
                New Purchase
              </DropdownMenuItem>
            ) : null}
            {hasPermission("inventory:write") ? (
              <DropdownMenuItem
                onSelect={() => void navigate("/inventory/adjustments")}
              >
                Adjust Stock
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
        >
          <Bell className="size-4 text-muted-foreground" />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Help">
          <CircleHelp className="size-4 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Settings"
          onClick={() => void navigate("/settings")}
        >
          <Settings className="size-4 text-muted-foreground" />
        </Button>

        <span className="hidden rounded bg-primary-muted px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase sm:inline">
          {roleLabel(user.role)}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2 px-1.5"
            >
              <EntityAvatar
                name={user.name}
                imageUrl={user.avatarUrl}
                size="sm"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-0.5">
                <span>{user.name}</span>
                <span className="font-normal text-muted-foreground">
                  {user.email}
                </span>
                <span className="mt-1 font-normal text-primary">
                  {roleLabel(user.role)}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Switch demo role</DropdownMenuLabel>
            {DEMO_ROLE_ORDER.map((id) => (
              <DropdownMenuItem
                key={id}
                onSelect={() => switchRole(id)}
                className={cn(
                  ROLE_PRESETS[id].user.role === user.role && "bg-accent",
                )}
              >
                {ROLE_PRESETS[id].label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => switchRole("platform")}
              className={cn(user.role === "platform" && "bg-accent")}
            >
              SaaS Owner (Platform)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => void navigate(homePath)}>
              Role home
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export { Topbar };
