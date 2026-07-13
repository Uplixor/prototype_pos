import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { AppShell } from "~/shared/layouts/app-shell";
import { useWorkspace } from "~/shared/providers/workspace-provider";

/**
 * Authenticated application layout — one shell for all capability screens.
 * Redirects to sign-in when no demo role session is active.
 */
export default function AppLayout() {
  const { isAuthenticated, user, homePath } = useWorkspace();
  const location = useLocation();
  const navigate = useNavigate();
  const redirecting = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      if (redirecting.current) return;
      redirecting.current = true;
      void navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }
    redirecting.current = false;
    // SaaS owner belongs in the platform console, not tenant app
    if (user.role === "platform") {
      void navigate("/platform", { replace: true });
    }
  }, [
    isAuthenticated,
    user.role,
    location.pathname,
    navigate,
    homePath,
  ]);

  if (!isAuthenticated || user.role === "platform") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return <AppShell />;
}
