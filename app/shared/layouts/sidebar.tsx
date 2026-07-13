import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Headset,
  LogOut,
  X,
  type LucideIcon,
} from "lucide-react";
import { NAVIGATION_SECTIONS } from "~/features/navigation/config";
import { filterNavigation } from "~/features/navigation/filter-navigation";
import { Button } from "~/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/shared/components/ui/tooltip";
import { useShellLayout } from "~/shared/providers/shell-layout-provider";
import { useWorkspace } from "~/shared/providers/workspace-provider";
import type { NavItem, NavSection } from "~/shared/types";
import { cn } from "~/shared/utils/cn";

function orgInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Exact path match — avoids parent hubs lighting up every child route. */
function isExactActive(pathname: string, href: string): boolean {
  return pathname === href;
}

function sectionContainsPath(section: NavSection, pathname: string): boolean {
  return section.items.some((item) => isExactActive(pathname, item.href));
}

function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    desktopExpanded,
    toggleDesktop,
    mobileOpen,
    setMobileOpen,
  } = useShellLayout();
  const {
    enabledCapabilities,
    permissions,
    organization,
    branch,
    signOut,
  } = useWorkspace();

  const sections = filterNavigation(
    NAVIGATION_SECTIONS,
    enabledCapabilities,
    permissions,
  );

  const showLabels = mobileOpen || desktopExpanded;
  const initials = orgInitials(organization.name);

  const activeSectionId = useMemo(
    () => sections.find((s) => sectionContainsPath(s, pathname))?.id ?? null,
    [sections, pathname],
  );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!activeSectionId) return;
    setOpenGroups((prev) =>
      prev[activeSectionId] ? prev : { ...prev, [activeSectionId]: true },
    );
  }, [activeSectionId]);

  function toggleGroup(id: string) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSignOut() {
    signOut();
    void navigate("/login");
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar transition-[width,transform] duration-200",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        "w-64 lg:translate-x-0",
        desktopExpanded ? "lg:w-64" : "lg:w-14",
      )}
      aria-label="Primary"
    >
      <button
        type="button"
        onClick={toggleDesktop}
        aria-label={desktopExpanded ? "Collapse sidebar" : "Expand sidebar"}
        className="absolute top-14 -right-3 z-50 hidden size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary hover:text-primary lg:flex"
      >
        {desktopExpanded ? (
          <ChevronLeft className="size-3.5" strokeWidth={2.25} />
        ) : (
          <ChevronRight className="size-3.5" strokeWidth={2.25} />
        )}
      </button>

      <div
        className={cn(
          "flex items-center border-b border-sidebar-border",
          showLabels ? "gap-3 px-4 py-4" : "justify-center px-0 py-4",
        )}
      >
        {showLabels ? (
          <>
            <span className="flex size-10 shrink-0 items-center justify-center rounded bg-muted text-[13px] font-semibold tracking-wide text-heading">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-heading">
                {organization.name}
              </p>
              <p className="truncate text-[12px] text-muted-foreground">
                {branch.name}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 lg:hidden"
              aria-label="Close navigation"
              onClick={closeMobile}
            >
              <X className="size-4" />
            </Button>
          </>
        ) : (
          <span
            className="text-[11px] font-semibold tracking-wide text-muted-foreground"
            aria-label={organization.name}
          >
            {initials}
          </span>
        )}
      </div>

      <TooltipProvider delayDuration={0}>
        <nav
          className={cn(
            "flex flex-1 flex-col overflow-y-auto",
            showLabels ? "gap-1 px-2 py-3" : "items-center gap-1 px-0 py-2",
          )}
        >
          {sections.map((section) =>
            showLabels ? (
              <ExpandedSection
                key={section.id}
                section={section}
                pathname={pathname}
                open={Boolean(openGroups[section.id])}
                onToggle={() => toggleGroup(section.id)}
                onNavigate={closeMobile}
              />
            ) : (
              <CollapsedSection
                key={section.id}
                section={section}
                pathname={pathname}
                onNavigate={closeMobile}
              />
            ),
          )}
        </nav>
      </TooltipProvider>

      <div
        className={cn(
          "mt-auto flex flex-col border-t border-sidebar-border",
          showLabels ? "gap-0.5 px-2 py-3" : "items-center gap-0.5 px-0 py-3",
        )}
      >
        <a
          href="#support"
          className={cn(
            "flex items-center text-[12px] font-medium text-muted-foreground transition-colors hover:text-heading",
            showLabels
              ? "gap-3 rounded-md px-3 py-2 hover:bg-card"
              : "size-10 justify-center rounded-md hover:bg-card",
          )}
          aria-label="Support"
        >
          <Headset
            className="size-[18px] shrink-0"
            strokeWidth={1.75}
            aria-hidden
          />
          {showLabels ? <span>Support</span> : null}
        </a>
        <button
          type="button"
          onClick={handleSignOut}
          className={cn(
            "flex items-center text-left text-[12px] font-medium text-muted-foreground transition-colors hover:text-heading",
            showLabels
              ? "gap-3 rounded-md px-3 py-2 hover:bg-card"
              : "size-10 justify-center rounded-md hover:bg-card",
          )}
          aria-label="Sign Out"
        >
          <LogOut
            className="size-[18px] shrink-0"
            strokeWidth={1.75}
            aria-hidden
          />
          {showLabels ? <span>Sign Out</span> : null}
        </button>
      </div>
    </aside>
  );
}

function ExpandedSection({
  section,
  pathname,
  open,
  onToggle,
  onNavigate,
}: {
  section: NavSection;
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const SectionIcon = section.icon;
  const isGroup = section.items.length > 1;
  const sectionActive = sectionContainsPath(section, pathname);

  if (!isGroup) {
    const item = section.items[0]!;
    return (
      <div className="mb-1">
        <p className="mb-1 px-3 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          {section.label}
        </p>
        <NavLeaf item={item} pathname={pathname} onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-[12px] font-semibold transition-colors",
          sectionActive
            ? "bg-primary-muted text-primary"
            : "text-body hover:bg-card",
        )}
      >
        <SectionIcon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
        <span className="min-w-0 flex-1 truncate text-left">{section.label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <ul className="mt-0.5 space-y-0.5 border-l border-border ml-4 pl-2">
          {section.items.map((item) => (
            <li key={item.id}>
              <NavLeaf
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
                nested
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function CollapsedSection({
  section,
  pathname,
  onNavigate,
}: {
  section: NavSection;
  pathname: string;
  onNavigate: () => void;
}) {
  const SectionIcon = section.icon;
  const isGroup = section.items.length > 1;
  const sectionActive = sectionContainsPath(section, pathname);

  if (!isGroup) {
    const item = section.items[0]!;
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <IconLink
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isExactActive(pathname, item.href)}
              onNavigate={onNavigate}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  // Overview keeps Dashboard + POS as separate rail icons (frequent actions)
  if (section.id === "overview") {
    return (
      <>
        {section.items.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <div>
                <IconLink
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={isExactActive(pathname, item.href)}
                  onNavigate={onNavigate}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </>
    );
  }

  return (
    <HoverFlyout
      label={section.label}
      icon={SectionIcon}
      active={sectionActive}
    >
      <ul className="space-y-0.5">
        {section.items.map((item) => {
          const Icon = item.icon;
          const active = isExactActive(pathname, item.href);
          return (
            <li key={item.id}>
              <NavLink
                to={item.href}
                end
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2 py-2 text-[12px] font-medium transition-colors",
                  active
                    ? "bg-primary-muted font-semibold text-primary"
                    : "text-body hover:bg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="truncate">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </HoverFlyout>
  );
}

function HoverFlyout({
  label,
  icon: Icon,
  active,
  children,
}: {
  label: string;
  icon: LucideIcon;
  active: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  function clearClose() {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function place() {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      top: rect.top,
      left: rect.right + 8,
    });
  }

  function show() {
    clearClose();
    place();
    setOpen(true);
  }

  function hideSoon() {
    clearClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  }

  useEffect(() => () => clearClose(), []);

  useEffect(() => {
    if (!open) return;
    function onReposition() {
      place();
    }
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [open]);

  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          hideSoon();
        }
      }}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "flex size-10 items-center justify-center rounded-md transition-colors",
          active || open
            ? "bg-primary-muted text-primary"
            : "text-muted-foreground hover:bg-card hover:text-heading",
        )}
      >
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </button>
      {open
        ? createPortal(
            <div
              role="menu"
              className="fixed z-[60] w-56 rounded-md border border-border bg-popover p-1.5 text-popover-foreground shadow-md"
              style={{ top: coords.top, left: coords.left }}
              onMouseEnter={show}
              onMouseLeave={hideSoon}
            >
              <p className="px-2 py-1.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                {label}
              </p>
              {children}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function NavLeaf({
  item,
  pathname,
  onNavigate,
  nested,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
  nested?: boolean;
}) {
  const Icon = item.icon;
  const active = isExactActive(pathname, item.href);

  return (
    <NavLink
      to={item.href}
      end
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-md text-[12px] font-medium transition-colors",
        nested ? "px-2.5 py-1.5" : "px-3 py-2",
        active
          ? "bg-primary-muted font-semibold text-primary"
          : "text-body hover:bg-card",
      )}
    >
      <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
}

function IconLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <NavLink
      to={href}
      end
      aria-label={label}
      onClick={onNavigate}
      className={cn(
        "flex size-10 items-center justify-center rounded-md transition-colors",
        active
          ? "bg-primary-muted text-primary"
          : "text-muted-foreground hover:bg-card hover:text-heading",
      )}
    >
      <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
    </NavLink>
  );
}

export { Sidebar };
