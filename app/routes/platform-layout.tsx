import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { PlatformShell } from "~/features/platform/components/platform-shell";
import { useWorkspace } from "~/shared/providers/workspace-provider";

/**
 * SaaS platform console — only the platform demo role may enter.
 */
export default function PlatformLayout() {
  const { isAuthenticated, homePath, user } = useWorkspace();
  const location = useLocation();
  const navigate = useNavigate();
  const redirecting = useRef(false);

  const isPlatform = user.role === "platform";

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
    if (!isPlatform) {
      void navigate(homePath === "/platform" ? "/dashboard" : homePath, {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    isPlatform,
    homePath,
    location.pathname,
    navigate,
  ]);

  if (!isAuthenticated || !isPlatform) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return <PlatformShell />;
}
