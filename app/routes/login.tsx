import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";

export function meta() {
  return [{ title: "Sign in · Commerce OS" }];
}

export default function LoginRoute() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const denied = params.get("denied") === "1";
  const [email, setEmail] = useState("alex@northwind.example");
  const [password, setPassword] = useState("demo");

  if (denied) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-md border border-border bg-card p-6 text-center">
          <h1 className="text-base font-semibold text-danger">Access denied</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Your membership is suspended or revoked for this Organization.
          </p>
          <Button
            type="button"
            className="mt-4"
            variant="outline"
            onClick={() => navigate("/login")}
          >
            Back to sign in
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-md border border-border bg-card p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            Commerce OS
          </p>
          <h1 className="mt-1 text-base font-semibold">Sign in</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Demo: any credentials continue to the workspace
          </p>
        </div>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void navigate("/");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </main>
  );
}
