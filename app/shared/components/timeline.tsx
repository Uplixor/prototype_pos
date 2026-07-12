import type { LucideIcon } from "lucide-react";
import { cn } from "~/shared/utils/cn";

export type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
};

export type TimelineProps = {
  items: TimelineItem[];
  className?: string;
};

const toneClass = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  danger: "bg-danger-muted text-danger",
} as const;

function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn("relative space-y-0", className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const tone = item.tone ?? "default";
        return (
          <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
            {index < items.length - 1 ? (
              <span
                className="absolute top-8 bottom-0 left-[15px] w-px bg-border"
                aria-hidden
              />
            ) : null}
            <div
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-md border border-border",
                toneClass[tone],
              )}
            >
              {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
            </div>
            <div className="min-w-0 pt-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium">{item.title}</p>
                <time className="text-[11px] text-muted-foreground">
                  {item.timestamp}
                </time>
              </div>
              {item.description ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export type ActivityFeedProps = TimelineProps;

function ActivityFeed(props: ActivityFeedProps) {
  return <Timeline {...props} />;
}

export { ActivityFeed, Timeline };
