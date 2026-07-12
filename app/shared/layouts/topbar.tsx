import { Building2, ChevronsUpDown, Menu, Wifi, WifiOff } from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/shared/components/ui/dropdown-menu";
import { EntityAvatar } from "~/shared/components/entity-avatar";
import { StatusBadge } from "~/shared/components/status-badge";
import { useCommandPalette } from "~/shared/providers/command-palette-provider";
import { useShell } from "~/shared/providers/shell-provider";
import { useWorkspace } from "~/shared/providers/workspace-provider";
import { cn } from "~/shared/utils/cn";

const DEMO_BRANCHES = [
  { id: "br_hq", organizationId: "org_demo", name: "Headquarters", code: "HQ" },
  { id: "br_dt", organizationId: "org_demo", name: "Downtown", code: "DT" },
  { id: "br_ml", organizationId: "org_demo", name: "Mall Kiosk", code: "ML" },
];

function Topbar() {
  const { toggleSidebar } = useShell();
  const { setOpen } = useCommandPalette();
  const { organization, branch, user, workspace, isOnline, setBranch } =
    useWorkspace();

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-card px-3">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <Menu className="size-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="max-w-[220px] gap-1.5"
          >
            <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">
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
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Workspace</DropdownMenuLabel>
          <DropdownMenuItem disabled>{workspace.name}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-1 hidden h-8 min-w-[220px] items-center gap-2 rounded-md border border-border bg-background px-2.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent md:inline-flex"
      >
        <span className="flex-1">Search or jump to…</span>
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <StatusBadge
          status={isOnline ? "online" : "offline"}
          size="sm"
          className="hidden sm:inline-flex"
        />
        <span className="sm:hidden" aria-label={isOnline ? "Online" : "Offline"}>
          {isOnline ? (
            <Wifi className="size-4 text-success" />
          ) : (
            <WifiOff className="size-4 text-warning" />
          )}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="gap-2 px-1.5">
              <EntityAvatar name={user.name} imageUrl={user.avatarUrl} size="sm" />
              <span className="hidden max-w-[120px] truncate text-xs font-medium md:inline">
                {user.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-0.5">
                <span>{user.name}</span>
                <span className="font-normal text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Account</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export { Topbar };
