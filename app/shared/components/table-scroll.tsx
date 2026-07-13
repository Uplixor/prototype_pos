import type { ReactNode } from "react";
import { cn } from "~/shared/utils/cn";

export type TableScrollProps = {
  children: ReactNode;
  className?: string;
  /** Minimum table width so columns remain usable on narrow screens */
  minWidthClassName?: string;
};

/**
 * Horizontal scroll container for wide tables on mobile/tablet.
 * Prefer this over overflow-hidden wrappers that clip content.
 */
function TableScroll({
  children,
  className,
  minWidthClassName = "min-w-[40rem]",
}: TableScrollProps) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]",
        className,
      )}
    >
      <div className={cn(minWidthClassName)}>{children}</div>
    </div>
  );
}

export { TableScroll };
