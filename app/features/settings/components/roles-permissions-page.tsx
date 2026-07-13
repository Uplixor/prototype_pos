import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import {
  useCreateRoleMutation,
  useRoleQuery,
  useRolesQuery,
  useUpdateRolePermissionsMutation,
} from "~/features/settings/api/roles-mutations";
import { PERMISSION_MODULES } from "~/features/settings/data/roles-store";
import { LoadingState, PageHeader } from "~/shared/components/page-primitives";
import { PermissionGuard } from "~/shared/components/permission-guard";
import { Button } from "~/shared/components/ui/button";
import { Checkbox } from "~/shared/components/ui/checkbox";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/shared/components/ui/sheet";
import { useWorkspace } from "~/shared/providers/workspace-provider";
import { cn } from "~/shared/utils/cn";

function RolesPermissionsPage() {
  const { hasPermission } = useWorkspace();
  const canManage = hasPermission("settings:write");
  const rolesQuery = useRolesQuery();
  const [roleId, setRoleId] = useState("manager");
  const roleQuery = useRoleQuery(roleId);
  const save = useUpdateRolePermissionsMutation(roleId);
  const create = useCreateRoleMutation();

  const [draft, setDraft] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [copyFromId, setCopyFromId] = useState<string>("cashier");

  useEffect(() => {
    if (!roleQuery.data) return;
    setDraft(new Set(roleQuery.data.permissions));
    setDirty(false);
  }, [roleQuery.data]);

  const grantedCount = draft.size;
  const totalCount = useMemo(
    () => PERMISSION_MODULES.reduce((n, m) => n + m.permissions.length, 0),
    [],
  );

  function toggle(code: string, checked: boolean) {
    if (!canManage) return;
    setDraft((prev) => {
      const next = new Set(prev);
      if (checked) next.add(code);
      else next.delete(code);
      return next;
    });
    setDirty(true);
  }

  function toggleModule(moduleId: string, checked: boolean) {
    if (!canManage) return;
    const mod = PERMISSION_MODULES.find((m) => m.id === moduleId);
    if (!mod) return;
    setDraft((prev) => {
      const next = new Set(prev);
      for (const p of mod.permissions) {
        if (checked) next.add(p.code);
        else next.delete(p.code);
      }
      return next;
    });
    setDirty(true);
  }

  function reset() {
    if (!roleQuery.data) return;
    setDraft(new Set(roleQuery.data.permissions));
    setDirty(false);
  }

  async function handleCreate() {
    const created = await create.mutateAsync({
      label: newLabel,
      description: newDescription,
      copyFromId: copyFromId || undefined,
    });
    setCreateOpen(false);
    setNewLabel("");
    setNewDescription("");
    setRoleId(created.id);
  }

  if (rolesQuery.isLoading) return <LoadingState />;

  const role = roleQuery.data;
  const roles = rolesQuery.data ?? [];

  return (
    <div className="flex min-h-full flex-col bg-background">
      <PageHeader
        title="Roles & Permissions"
        description="Configure authorization grants for each role. Permissions enforce access — not role names."
        actions={
          <PermissionGuard permissions={["settings:write"]}>
            <div className="flex items-center gap-2">
              {dirty ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={save.isPending}
                    onClick={reset}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={save.isPending}
                    onClick={() => save.mutate([...draft])}
                  >
                    Save changes
                  </Button>
                </>
              ) : null}
              <Button
                type="button"
                size="sm"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="size-3.5" />
                Add role
              </Button>
            </div>
          </PermissionGuard>
        }
      />

      <div className="mx-page my-6 grid min-h-0 flex-1 gap-6 lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        {/* Role list — soft fill + chevron, no heavy outline */}
        <aside className="h-fit rounded border border-border bg-card">
          <p className="border-b border-border px-3 py-2.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
            Roles
          </p>
          <ul className="p-1.5">
            {roles.map((r) => {
              const selected = r.id === roleId;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setRoleId(r.id)}
                    className={cn(
                      "flex w-full items-start gap-2 rounded px-2.5 py-2.5 text-left transition-colors",
                      selected
                        ? "bg-muted"
                        : "hover:bg-muted/60",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-[13px] font-semibold",
                          selected ? "text-heading" : "text-body",
                        )}
                      >
                        {r.label}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[11px] leading-snug text-muted-foreground">
                        {r.description}
                      </span>
                      {r.system ? (
                        <span className="mt-1 inline-block text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                          System
                        </span>
                      ) : (
                        <span className="mt-1 inline-block text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                          Custom
                        </span>
                      )}
                    </span>
                    {selected ? (
                      <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Card stack for permission modules */}
        <div className="flex min-w-0 flex-col gap-4">
          <div className="rounded border border-border bg-card px-4 py-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-[16px] font-semibold text-heading">
                  {role?.label ?? "Role"}
                </h2>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {role?.description}
                </p>
              </div>
              <span className="text-[12px] text-muted-foreground">
                <span className="font-semibold text-heading">{grantedCount}</span>
                {" / "}
                {totalCount} permissions granted
              </span>
            </div>
          </div>

          {roleQuery.isLoading ? (
            <LoadingState />
          ) : (
            PERMISSION_MODULES.map((mod) => {
              const moduleCodes = mod.permissions.map((p) => p.code);
              const grantedInMod = moduleCodes.filter((c) =>
                draft.has(c),
              ).length;
              const allOn = grantedInMod === moduleCodes.length;
              const someOn = grantedInMod > 0 && !allOn;

              return (
                <section
                  key={mod.id}
                  className="rounded border border-border bg-card"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-semibold text-heading">
                        {mod.label}
                      </h3>
                      {mod.description ? (
                        <p className="mt-0.5 text-[12px] text-muted-foreground">
                          {mod.description}
                        </p>
                      ) : null}
                    </div>
                    <label className="flex shrink-0 cursor-pointer items-center gap-2 text-[12px] text-muted-foreground">
                      <Checkbox
                        checked={allOn ? true : someOn ? "indeterminate" : false}
                        disabled={!canManage}
                        onCheckedChange={(v) =>
                          toggleModule(mod.id, v === true)
                        }
                        aria-label={`Toggle all ${mod.label}`}
                      />
                      <span>All</span>
                    </label>
                  </div>
                  <ul className="divide-y divide-border">
                    {mod.permissions.map((p) => (
                      <li
                        key={p.code}
                        className="flex items-center justify-between gap-3 px-4 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-heading">
                            {p.label}
                          </p>
                          <p className="font-mono text-[11px] text-muted-foreground">
                            {p.code}
                          </p>
                        </div>
                        <Checkbox
                          checked={draft.has(p.code)}
                          disabled={!canManage}
                          onCheckedChange={(v) =>
                            toggle(p.code, v === true)
                          }
                          aria-label={p.label}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })
          )}

          {!canManage ? (
            <p className="text-[12px] text-muted-foreground">
              You can view role grants. Managing permissions requires settings
              write access.
            </p>
          ) : null}
        </div>
      </div>

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent size="md">
          <SheetHeader>
            <SheetTitle>Add role</SheetTitle>
          </SheetHeader>
          <SheetBody className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="role-name">Name</Label>
              <Input
                id="role-name"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Shift Lead"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role-desc">Description</Label>
              <Input
                id="role-desc"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="What this role is for"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Copy permissions from</Label>
              <Select value={copyFromId} onValueChange={setCopyFromId}>
                <SelectTrigger>
                  <SelectValue placeholder="Start from…" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                New roles start from a template; adjust grants after creating.
              </p>
            </div>
          </SheetBody>
          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!newLabel.trim() || create.isPending}
              onClick={() => void handleCreate()}
            >
              Create role
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export { RolesPermissionsPage };
