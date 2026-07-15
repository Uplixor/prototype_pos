import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  useArchiveBranchMutation,
  useBranchesQuery,
  useCreateBranchMutation,
  useInviteUserMutation,
  useOrgSettingsQuery,
  useRevokeUserMutation,
  useUpdateOrgMutation,
  useUsersQuery,
  type MembershipUser,
} from "~/features/settings/api/settings-mutations";
import { LoadingState, PageBody, PageHeader } from "~/shared/components/page-primitives";
import { PermissionGuard } from "~/shared/components/permission-guard";
import { StatusBadge } from "~/shared/components/status-badge";
import { Button } from "~/shared/components/ui/button";
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

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function OrganizationPage() {
  const query = useOrgSettingsQuery();
  const update = useUpdateOrgMutation();
  const [name, setName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [currency, setCurrency] = useState("");
  const [taxId, setTaxId] = useState("");

  useEffect(() => {
    if (!query.data) return;
    setName(query.data.name);
    setLegalName(query.data.legalName);
    setTimezone(query.data.timezone);
    setCurrency(query.data.currency);
    setTaxId(query.data.taxId);
  }, [query.data]);

  if (query.isLoading) return <LoadingState />;

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Organization"
        description="Tenant profile and commercial defaults"
        actions={
          <PermissionGuard permissions={["settings:write"]}>
            <Button
              type="button"
              size="sm"
              disabled={update.isPending}
              onClick={() =>
                update.mutate({ name, legalName, timezone, currency, taxId })
              }
            >
              Save
            </Button>
          </PermissionGuard>
        }
      />
      <PageBody className="grid max-w-xl gap-3 rounded-md border border-border bg-card p-4">
        <Field label="Display name" value={name} onChange={setName} />
        <Field label="Legal name" value={legalName} onChange={setLegalName} />
        <Field label="Timezone" value={timezone} onChange={setTimezone} />
        <Field label="Currency" value={currency} onChange={setCurrency} />
        <Field label="Tax ID" value={taxId} onChange={setTaxId} />
      </PageBody>
    </div>
  );
}

export function BranchesSettingsPage() {
  const query = useBranchesQuery();
  const create = useCreateBranchMutation();
  const archive = useArchiveBranchMutation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Branches"
        description="Operating locations owned by this Organization"
        actions={
          <PermissionGuard permissions={["settings:write"]}>
            <Button type="button" size="sm" onClick={() => setOpen(true)}>
              <Plus className="size-3.5" />
              New branch
            </Button>
          </PermissionGuard>
        }
      />
      <PageBody className="overflow-x-auto rounded-md border border-border p-0">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-muted/80 text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-medium">Name</th>
              <th className="px-3 py-2 text-left font-medium">Code</th>
              <th className="px-3 py-2 text-left font-medium">Address</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(query.data ?? []).map((b) => (
              <tr key={b.id} className="border-b border-border">
                <td className="px-3 py-2 font-medium">{b.name}</td>
                <td className="px-3 py-2">{b.code}</td>
                <td className="px-3 py-2 text-muted-foreground">{b.address}</td>
                <td className="px-3 py-2">
                  <StatusBadge
                    status={b.status === "active" ? "active" : "inactive"}
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  {b.status === "active" ? (
                    <PermissionGuard permissions={["settings:write"]}>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => archive.mutate(b.id)}
                      >
                        Archive
                      </Button>
                    </PermissionGuard>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageBody>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent size="md">
          <SheetHeader>
            <SheetTitle>New branch</SheetTitle>
          </SheetHeader>
          <SheetBody className="space-y-3">
            <Field label="Name" value={name} onChange={setName} />
            <Field label="Code" value={code} onChange={setCode} />
            <Field label="Address" value={address} onChange={setAddress} />
          </SheetBody>
          <SheetFooter>
            <Button
              type="button"
              size="sm"
              disabled={!name || !code || create.isPending}
              onClick={() =>
                void create
                  .mutateAsync({ name, code, address })
                  .then(() => setOpen(false))
              }
            >
              Create
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function UsersSettingsPage() {
  const query = useUsersQuery();
  const invite = useInviteUserMutation();
  const revoke = useRevokeUserMutation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MembershipUser["role"]>("cashier");

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Users"
        description="Organization memberships — assign a role; permissions come from the role grant matrix"
        actions={
          <PermissionGuard permissions={["settings:write"]}>
            <Button type="button" size="sm" onClick={() => setOpen(true)}>
              <Plus className="size-3.5" />
              Invite user
            </Button>
          </PermissionGuard>
        }
      />
      <PageBody className="overflow-x-auto rounded-md border border-border p-0">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-muted/80 text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-medium">User</th>
              <th className="px-3 py-2 text-left font-medium">Role</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(query.data ?? []).map((u) => (
              <tr key={u.id} className="border-b border-border">
                <td className="px-3 py-2">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-[11px] text-muted-foreground">{u.email}</p>
                </td>
                <td className="px-3 py-2 capitalize">{u.role}</td>
                <td className="px-3 py-2">
                  <StatusBadge
                    status={
                      u.status === "active"
                        ? "active"
                        : u.status === "invited"
                          ? "pending"
                          : "cancelled"
                    }
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  {u.status !== "revoked" ? (
                    <PermissionGuard permissions={["settings:write"]}>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => revoke.mutate(u.id)}
                      >
                        Revoke
                      </Button>
                    </PermissionGuard>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageBody>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent size="md">
          <SheetHeader>
            <SheetTitle>Invite user</SheetTitle>
          </SheetHeader>
          <SheetBody className="space-y-3">
            <Field label="Name" value={name} onChange={setName} />
            <Field label="Email" value={email} onChange={setEmail} />
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as MembershipUser["role"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    [
                      "owner",
                      "admin",
                      "manager",
                      "cashier",
                      "inventory",
                    ] as const
                  ).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SheetBody>
          <SheetFooter>
            <Button
              type="button"
              size="sm"
              disabled={!name || !email || invite.isPending}
              onClick={() =>
                void invite
                  .mutateAsync({ name, email, role })
                  .then(() => setOpen(false))
              }
            >
              Send invite
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
