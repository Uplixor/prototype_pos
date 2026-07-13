import { Link } from "react-router";
import { Button } from "~/shared/components/ui/button";

export function meta() {
  return [{ title: "Commerce OS" }];
}

/**
 * Public root — reserved for tenant-facing marketing / storefront later.
 * Authenticated product UI lives under /dashboard and sibling app routes.
 */
export default function LandingRoute() {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded bg-primary text-[12px] font-bold text-primary-foreground">
            C
          </span>
          <span className="text-[14px] font-semibold text-heading">
            Commerce OS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/login">Open workspace</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16 text-center sm:px-8">
        <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
          Public site
        </p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight text-heading sm:text-[36px]">
          Your storefront starts here
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
          This root URL will host each tenant&apos;s public presence — menus,
          hours, and brand. The operating system for staff lives at{" "}
          <span className="font-mono text-[13px] text-heading">/dashboard</span>
          .
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="sm">
            <Link to="/login">Sign in to Commerce OS</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-4 text-center text-[11px] text-muted-foreground sm:px-8">
        Tenant public pages will resolve by domain or slug in a later release.
      </footer>
    </main>
  );
}
