import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createRole,
  getRole,
  listRoles,
  updateRolePermissions,
  type CreateRoleInput,
} from "~/features/settings/data/roles-store";
import { settingsKeys } from "~/features/settings/api/settings-mutations";

export const rolesKeys = {
  all: [...settingsKeys.all, "roles"] as const,
  list: () => [...rolesKeys.all, "list"] as const,
  detail: (id: string) => [...rolesKeys.all, id] as const,
};

export function useRolesQuery() {
  return useQuery({ queryKey: rolesKeys.list(), queryFn: listRoles });
}

export function useRoleQuery(id: string) {
  return useQuery({
    queryKey: rolesKeys.detail(id),
    queryFn: () => getRole(id),
    enabled: Boolean(id),
  });
}

export function useCreateRoleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRoleInput) => createRole(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: rolesKeys.all });
      toast.success("Role created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateRolePermissionsMutation(roleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (permissions: string[]) =>
      updateRolePermissions(roleId, permissions),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: rolesKeys.all });
      toast.success("Role permissions saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
