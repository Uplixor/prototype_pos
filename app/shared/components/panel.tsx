import type { ReactNode } from "react";
import { cn } from "~/shared/utils/cn";

export type PanelProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

/** Stitch content surface — white card, 1px border, no heavy shadow. */
function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: PanelProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card shadow-none",
        className,
      )}
    >
      {title || description || actions ? (
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-[16px] font-semibold text-heading">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </header>
      ) : null}
      <div className={cn(bodyClassName)}>{children}</div>
    </section>
  );
}

export { Panel };
