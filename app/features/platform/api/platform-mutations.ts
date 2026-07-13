import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getPlatformMetrics,
  listPlatformAudit,
  listPlans,
  listTenants,
  setTenantStatus,
  type TenantStatus,
} from "~/features/platform/data/platform-store";

export const platformKeys = {
  all: ["platform"] as const,
  metrics: () => [...platformKeys.all, "metrics"] as const,
  tenants: () => [...platformKeys.all, "tenants"] as const,
  plans: () => [...platformKeys.all, "plans"] as const,
  audit: () => [...platformKeys.all, "audit"] as const,
};

export function usePlatformMetricsQuery() {
  return useQuery({
    queryKey: platformKeys.metrics(),
    queryFn: getPlatformMetrics,
  });
}

export function usePlatformTenantsQuery() {
  return useQuery({ queryKey: platformKeys.tenants(), queryFn: listTenants });
}

export function usePlatformPlansQuery() {
  return useQuery({ queryKey: platformKeys.plans(), queryFn: listPlans });
}

export function usePlatformAuditQuery() {
  return useQuery({
    queryKey: platformKeys.audit(),
    queryFn: listPlatformAudit,
  });
}

export function useSetTenantStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TenantStatus }) =>
      setTenantStatus(id, status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: platformKeys.all });
      toast.success("Tenant status updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
