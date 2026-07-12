import type { ReactNode } from "react";
import { useWorkspace } from "~/shared/providers/workspace-provider";

export type PermissionGuardProps = {
  /** All listed permissions required */
  permissions?: string[];
  /** Any listed permission sufficient when requireAll is false */
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
};

function PermissionGuard({
  permissions = [],
  requireAll = true,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { permissions: granted } = useWorkspace();

  if (permissions.length === 0) {
    return <>{children}</>;
  }

  const allowed = requireAll
    ? permissions.every((p) => granted.includes(p))
    : permissions.some((p) => granted.includes(p));

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export { PermissionGuard };
