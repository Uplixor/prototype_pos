import type { LucideIcon } from "lucide-react";
import { cn } from "~/shared/utils/cn";
import { Button } from "~/shared/components/ui/button";

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
};

function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-2 border-b border-border bg-card px-page py-4",
        className,
      )}
    >
      {breadcrumbs ? (
        <div className="text-[12px] text-muted-foreground">{breadcrumbs}</div>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h1 className="truncate text-[18px] font-semibold leading-6 tracking-tight text-heading">
            {title}
          </h1>
          {description ? (
            <p className="text-[12px] leading-[18px] text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}

/** Standard content region under PageHeader / FilterBar — keeps table vs headline spacing consistent. */
export type PageBodyProps = {
  children: React.ReactNode;
  className?: string;
};

function PageBody({ children, className }: PageBodyProps) {
  return (
    <div className={cn("mx-page mt-4 mb-6", className)}>{children}</div>
  );
}

export type ToolbarProps = {
  children: React.ReactNode;
  className?: string;
};

function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-b border-border bg-card px-page py-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type FilterBarProps = {
  children: React.ReactNode;
  className?: string;
};

function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 px-page pt-3 pb-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type StatCardProps = {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  className?: string;
};

function StatCard({
  label,
  value,
  delta,
  deltaTone = "neutral",
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card px-4 py-3 shadow-none",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] font-medium tracking-wider text-muted-foreground uppercase">
          {label}
        </p>
        {Icon ? (
          <Icon className="size-4 text-muted-foreground" aria-hidden />
        ) : null}
      </div>
      <p className="mt-1 font-money text-[18px] font-semibold tracking-tight text-heading">
        {value}
      </p>
      {delta ? (
        <p
          className={cn(
            "mt-1 text-[11px] font-semibold tabular-nums",
            deltaTone === "positive" && "text-success",
            deltaTone === "negative" && "text-danger",
            deltaTone === "neutral" && "text-muted-foreground",
          )}
        >
          {delta}
        </p>
      ) : null}
    </div>
  );
}

export type MetricCardProps = StatCardProps & {
  description?: string;
};

function MetricCard({ description, ...props }: MetricCardProps) {
  return (
    <div className="space-y-1">
      <StatCard {...props} />
      {description ? (
        <p className="px-1 text-[12px] text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-16 text-center",
        className,
      )}
      role="status"
    >
      {Icon ? (
        <div className="flex size-10 items-center justify-center rounded border border-border bg-muted">
          <Icon className="size-5 text-muted-foreground" aria-hidden />
        </div>
      ) : null}
      <div className="space-y-1">
        <h3 className="text-[14px] font-semibold text-heading">{title}</h3>
        {description ? (
          <p className="max-w-sm text-[12px] text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export type LoadingStateProps = {
  label?: string;
  className?: string;
};

function LoadingState({ label = "Loading…", className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-16",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      <p className="text-[12px] text-muted-foreground">{label}</p>
    </div>
  );
}

export type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

function ErrorState({
  title = "Something went wrong",
  description = "We could not load this view. Try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-16 text-center",
        className,
      )}
      role="alert"
    >
      <div className="space-y-1">
        <h3 className="text-[14px] font-semibold text-danger">{title}</h3>
        <p className="max-w-sm text-[12px] text-muted-foreground">{description}</p>
      </div>
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}

export {
  EmptyState,
  ErrorState,
  FilterBar,
  LoadingState,
  MetricCard,
  PageBody,
  PageHeader,
  StatCard,
  Toolbar,
};
