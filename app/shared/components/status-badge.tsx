import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/shared/utils/cn";
import { Badge } from "~/shared/components/ui/badge";

const statusMap = {
  active: { label: "Active", variant: "success" as const },
  inactive: { label: "Inactive", variant: "muted" as const },
  draft: { label: "Draft", variant: "secondary" as const },
  pending: { label: "Pending", variant: "warning" as const },
  completed: { label: "Completed", variant: "success" as const },
  cancelled: { label: "Cancelled", variant: "danger" as const },
  failed: { label: "Failed", variant: "danger" as const },
  low_stock: { label: "Low stock", variant: "warning" as const },
  out_of_stock: { label: "Out of stock", variant: "danger" as const },
  paid: { label: "Paid", variant: "success" as const },
  unpaid: { label: "Unpaid", variant: "warning" as const },
  refunded: { label: "Refunded", variant: "info" as const },
  online: { label: "Online", variant: "success" as const },
  offline: { label: "Offline", variant: "warning" as const },
} as const;

export type StatusKey = keyof typeof statusMap;

const statusBadgeVariants = cva("gap-1.5", {
  variants: {
    size: {
      default: "",
      sm: "text-[10px] px-1 py-0",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type StatusBadgeProps = {
  status: StatusKey;
  label?: string;
  className?: string;
} & VariantProps<typeof statusBadgeVariants>;

function StatusBadge({ status, label, size, className }: StatusBadgeProps) {
  const config = statusMap[status];
  return (
    <Badge
      variant={config.variant}
      className={cn(statusBadgeVariants({ size }), className)}
    >
      <span
        className="size-1.5 rounded-full bg-current opacity-80"
        aria-hidden
      />
      {label ?? config.label}
    </Badge>
  );
}

export { StatusBadge, statusMap };
