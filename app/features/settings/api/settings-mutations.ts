import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  archiveBranch,
  createBranch,
  getOrgSettings,
  inviteUser,
  listBranches,
  listUsers,
  revokeUser,
  updateOrgSettings,
} from "~/features/settings/data/settings-store";
import type { MembershipUser, OrgSettings } from "~/features/settings/data/settings-store";

export const settingsKeys = {
  all: ["settings"] as const,
  org: () => [...settingsKeys.all, "org"] as const,
  branches: () => [...settingsKeys.all, "branches"] as const,
  users: () => [...settingsKeys.all, "users"] as const,
};

export function useOrgSettingsQuery() {
  return useQuery({ queryKey: settingsKeys.org(), queryFn: getOrgSettings });
}

export function useUpdateOrgMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<OrgSettings>) => updateOrgSettings(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: settingsKeys.org() });
      toast.success("Organization updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useBranchesQuery() {
  return useQuery({ queryKey: settingsKeys.branches(), queryFn: listBranches });
}

export function useCreateBranchMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: settingsKeys.branches() });
      toast.success("Branch created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useArchiveBranchMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: archiveBranch,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: settingsKeys.branches() });
      toast.success("Branch archived");
    },
  });
}

export function useUsersQuery() {
  return useQuery({ queryKey: settingsKeys.users(), queryFn: listUsers });
}

export function useInviteUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: settingsKeys.users() });
      toast.success("Invite sent");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRevokeUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: revokeUser,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: settingsKeys.users() });
      toast.success("Membership revoked");
    },
  });
}

export type { MembershipUser, OrgSettings };
