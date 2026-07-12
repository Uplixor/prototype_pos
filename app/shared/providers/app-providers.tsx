import { Toaster } from "sonner";
import { TooltipProvider } from "~/shared/components/ui/tooltip";
import { CommandPaletteProvider } from "~/shared/providers/command-palette-provider";
import { DrawerProvider } from "~/shared/providers/drawer-provider";
import { QueryProvider } from "~/shared/providers/query-provider";
import { ShellProvider } from "~/shared/providers/shell-provider";
import { WorkspaceProvider } from "~/shared/providers/workspace-provider";

export type AppProvidersProps = {
  children: React.ReactNode;
};

function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <WorkspaceProvider>
        <ShellProvider>
          <DrawerProvider>
            <CommandPaletteProvider>
              <TooltipProvider>
                {children}
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    className:
                      "border border-border bg-card text-card-foreground shadow-md text-sm",
                  }}
                />
              </TooltipProvider>
            </CommandPaletteProvider>
          </DrawerProvider>
        </ShellProvider>
      </WorkspaceProvider>
    </QueryProvider>
  );
}

export { AppProviders };
