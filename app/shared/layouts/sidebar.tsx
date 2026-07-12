import { NavLink } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NAVIGATION_SECTIONS } from "~/features/navigation/config";
import { filterNavigation } from "~/features/navigation/filter-navigation";
import { Button } from "~/shared/components/ui/button";
import { ScrollArea } from "~/shared/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/shared/components/ui/tooltip";
import { useShell } from "~/shared/providers/shell-provider";
import { useWorkspace } from "~/shared/providers/workspace-provider";
import { cn } from "~/shared/utils/cn";

function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useShell();
  const { enabledCapabilities, permissions, organization } = useWorkspace();

  const sections = filterNavigation(
    NAVIGATION_SECTIONS,
    enabledCapabilities,
    permissions,
  );

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-motion ease-motion",
        sidebarCollapsed ? "w-14" : "w-60",
      )}
      aria-label="Primary"
    >
      <div
        className={cn(
          "flex h-12 items-center border-b border-sidebar-border px-3",
          sidebarCollapsed ? "justify-center" : "justify-between gap-2",
        )}
      >
        {!sidebarCollapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              Commerce OS
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              {organization.name}
            </p>
          </div>
        ) : (
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            C
          </span>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="shrink-0"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-4 px-2">
          {sections.map((section) => (
            <div key={section.id}>
              {!sidebarCollapsed ? (
                <p className="mb-1 px-2 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {section.label}
                </p>
              ) : null}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const link = (
                    <NavLink
                      to={item.href}
                      end={item.href === "/"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-motion",
                          sidebarCollapsed && "justify-center px-0",
                          isActive
                            ? "bg-primary-muted text-primary font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )
                      }
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                      {!sidebarCollapsed ? (
                        <span className="truncate">{item.label}</span>
                      ) : (
                        <span className="sr-only">{item.label}</span>
                      )}
                      {!sidebarCollapsed && item.badge != null ? (
                        <span className="ml-auto rounded bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                          {item.badge}
                        </span>
                      ) : null}
                    </NavLink>
                  );

                  if (!sidebarCollapsed) {
                    return <li key={item.id}>{link}</li>;
                  }

                  return (
                    <li key={item.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}

export { Sidebar };
