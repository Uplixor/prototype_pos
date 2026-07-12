import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { useProductDrawer } from "~/features/catalog/hooks/use-product-drawer";
import { useInventoryDrawer } from "~/features/inventory/hooks/use-inventory-drawer";
import { usePurchasingDrawer } from "~/features/purchasing/hooks/use-purchasing-drawer";
import { useSaleDrawer } from "~/features/sales/hooks/use-sale-drawer";
import { COMMAND_ACTIONS } from "~/features/navigation/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/shared/components/ui/dialog";
import { useCommandPalette } from "~/shared/providers/command-palette-provider";
import { useWorkspace } from "~/shared/providers/workspace-provider";
import { cn } from "~/shared/utils/cn";

function CommandPalette() {
  const navigate = useNavigate();
  const { open, setOpen } = useCommandPalette();
  const { openCreateProduct } = useProductDrawer();
  const { openCreateSale } = useSaleDrawer();
  const { openAdjustment } = useInventoryDrawer();
  const { openCreatePurchase } = usePurchasingDrawer();
  const { permissions, enabledCapabilities } = useWorkspace();

  const actions = useMemo(() => {
    return COMMAND_ACTIONS.filter((action) => {
      if (
        action.permissions &&
        !action.permissions.every((p) => permissions.includes(p))
      ) {
        return false;
      }
      if (
        action.capabilities &&
        !action.capabilities.some((c) => enabledCapabilities.includes(c))
      ) {
        return false;
      }
      return true;
    });
  }, [permissions, enabledCapabilities]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof actions>();
    for (const action of actions) {
      const list = map.get(action.group) ?? [];
      list.push(action);
      map.set(action.group, list);
    }
    return Array.from(map.entries());
  }, [actions]);

  function runAction(id: string) {
    const action = actions.find((item) => item.id === id);
    if (!action) return;

    setOpen(false);

    if (action.href) {
      void navigate(action.href);
      return;
    }

    if (id === "create-product") {
      openCreateProduct();
      return;
    }

    if (id === "create-sale") {
      openCreateSale();
      return;
    }

    if (id === "adjust-stock") {
      openAdjustment();
      return;
    }

    if (id === "create-purchase") {
      openCreatePurchase();
      return;
    }

    action.action?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showClose={false}
        className="top-[20%] max-w-lg translate-y-0 gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search navigation and actions
        </DialogDescription>
        <Command
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase"
          shouldFilter
        >
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <Command.Input
              placeholder="Type a command or search…"
              className="flex h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Command.List className="max-h-72 overflow-y-auto p-1">
            <Command.Empty className="py-8 text-center text-xs text-muted-foreground">
              No results found.
            </Command.Empty>
            {groups.map(([group, items]) => (
              <Command.Group key={group} heading={group}>
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Command.Item
                      key={item.id}
                      value={`${item.label} ${item.description ?? ""}`}
                      onSelect={() => runAction(item.id)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground",
                      )}
                    >
                      {Icon ? (
                        <Icon className="size-4 shrink-0 text-muted-foreground" />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{item.label}</p>
                        {item.description ? (
                          <p className="truncate text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                      {item.shortcut ? (
                        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {item.shortcut}
                        </kbd>
                      ) : null}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export { CommandPalette };
