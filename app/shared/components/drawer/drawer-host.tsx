import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/shared/components/ui/sheet";
import { useDrawer } from "~/shared/providers/drawer-provider";

function DrawerHost() {
  const { stack, closeDrawer } = useDrawer();
  const active = stack[stack.length - 1];

  return (
    <Sheet
      open={Boolean(active)}
      onOpenChange={(open) => {
        if (!open) {
          closeDrawer(active?.id);
        }
      }}
    >
      {active ? (
        <SheetContent side="right" size={active.size ?? "md"}>
          <SheetHeader>
            <SheetTitle>{active.title}</SheetTitle>
            {active.description ? (
              <SheetDescription>{active.description}</SheetDescription>
            ) : null}
          </SheetHeader>
          <SheetBody>{active.content}</SheetBody>
        </SheetContent>
      ) : null}
    </Sheet>
  );
}

export { DrawerHost };
