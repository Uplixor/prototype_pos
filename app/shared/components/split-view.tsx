import { cn } from "~/shared/utils/cn";

export type SplitViewProps = {
  master: React.ReactNode;
  detail: React.ReactNode;
  /** Master pane width class — default 360px */
  masterWidthClassName?: string;
  className?: string;
  /** When true, show only detail on narrow viewports */
  detailOnly?: boolean;
};

/**
 * Master–detail layout for list + inspector workflows.
 */
function SplitView({
  master,
  detail,
  masterWidthClassName = "w-full max-w-md",
  className,
  detailOnly = false,
}: SplitViewProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 overflow-hidden", className)}>
      <div
        className={cn(
          "min-h-0 overflow-auto border-r border-border bg-card",
          masterWidthClassName,
          detailOnly && "hidden lg:block",
        )}
      >
        {master}
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-background">
        {detail}
      </div>
    </div>
  );
}

export type DetailsPanelProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function DetailsPanel({
  title,
  description,
  actions,
  children,
  className,
}: DetailsPanelProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-start justify-between gap-3 border-b border-border bg-card px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">{title}</h2>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-4 py-4">{children}</div>
    </div>
  );
}

export { DetailsPanel, SplitView };
