import type { ReactNode } from "react";
import { cn } from "~/shared/utils/cn";

/** Dense Stitch-style section card — tight padding, subtle border, no shadow. */
export function EditorSection({
  id,
  title,
  description,
  actions,
  children,
  className,
}: {
  id: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={`product-section-${id}`}
      className={cn(
        "scroll-mt-20 rounded-lg border border-border/80 bg-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border/60 px-4 py-2.5">
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold text-heading">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
      <div className="space-y-3 px-4 py-3">{children}</div>
    </section>
  );
}

export function FieldLabel({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-[11px] font-medium text-muted-foreground"
    >
      {children}
    </label>
  );
}
