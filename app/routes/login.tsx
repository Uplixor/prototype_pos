import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  DEMO_ROLE_ORDER,
  ROLE_PRESETS,
  type DemoRoleId,
} from "~/features/auth/role-presets";
import { Button } from "~/shared/components/ui/button";
import { useWorkspace } from "~/shared/providers/workspace-provider";
import { cn } from "~/shared/utils/cn";

export function meta() {
  return [{ title: "Sign in · Commerce OS" }];
}

export default function LoginRoute() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const denied = params.get("denied") === "1";
  const { assumeRole, isAuthenticated, homePath, organization } = useWorkspace();
  const redirecting = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || denied) {
      redirecting.current = false;
      return;
    }
    if (redirecting.current) return;
    redirecting.current = true;
    void navigate(homePath, { replace: true });
  }, [isAuthenticated, homePath, denied, navigate]);

  if (denied) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 text-center shadow-sm">
          <h1 className="text-[16px] font-semibold text-danger">Access denied</h1>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Your membership is suspended or revoked for this Organization.
          </p>
          <Button
            type="button"
            className="mt-4"
            variant="outline"
            onClick={() => void navigate("/login")}
          >
            Back to sign in
          </Button>
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background">
        <div className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      </main>
    );
  }

  function enterAs(roleId: DemoRoleId) {
    assumeRole(roleId);
    void navigate(ROLE_PRESETS[roleId].homePath, { replace: true });
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-lg rounded-lg border border-border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded bg-primary text-sm font-bold text-primary-foreground">
            C
          </div>
          <h1 className="mt-4 text-[20px] font-semibold tracking-tight text-heading">
            Commerce OS
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Demo access · tenant workspace or platform console
          </p>
        </div>

        <p className="mb-3 text-[12px] font-medium text-heading">
          Tenant roles · {organization.name}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {DEMO_ROLE_ORDER.map((id) => {
            const preset = ROLE_PRESETS[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => enterAs(id)}
                className={cn(
                  "rounded border border-border-strong bg-card p-3 text-left transition-colors",
                  "hover:border-primary hover:bg-primary-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
                )}
              >
                <p className="text-[13px] font-semibold text-heading">
                  {preset.label}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {preset.user.name}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="my-6 border-t border-border" />

        <p className="mb-3 text-[12px] font-medium text-heading">
          System administration
        </p>
        <button
          type="button"
          onClick={() => enterAs("platform")}
          className={cn(
            "w-full rounded border border-border-strong bg-card p-3 text-left transition-colors",
            "hover:border-primary hover:bg-primary-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
          )}
        >
          <span className="inline-flex items-center rounded bg-primary-muted px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
            Platform
          </span>
          <p className="mt-1.5 text-[13px] font-semibold text-heading">
            {ROLE_PRESETS.platform.label}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {ROLE_PRESETS.platform.user.name} · platform console
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {ROLE_PRESETS.platform.description}
          </p>
        </button>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Select a role to enter. Platform admin is outside tenant memberships.
        </p>
      </div>
    </main>
  );
}
