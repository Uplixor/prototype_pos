import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useWorkspace } from "~/shared/providers/workspace-provider";

export function meta() {
  return [{ title: "Reports · Commerce OS" }];
}

/** Reports hub — forward once to the first permitted report. */
export default function ReportsRoute() {
  const navigate = useNavigate();
  const { hasPermission } = useWorkspace();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;
    redirected.current = true;

    if (hasPermission("reports:sales")) {
      void navigate("/reports/sales", { replace: true });
      return;
    }
    if (hasPermission("reports:payments")) {
      void navigate("/reports/payments", { replace: true });
      return;
    }
    if (hasPermission("reports:inventory")) {
      void navigate("/reports/inventory", { replace: true });
      return;
    }
    void navigate("/dashboard", { replace: true });
  }, [hasPermission, navigate]);

  return (
    <div className="flex min-h-full items-center justify-center py-16">
      <div className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  );
}
