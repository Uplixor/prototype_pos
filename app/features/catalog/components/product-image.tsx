import { Package } from "lucide-react";
import { cn } from "~/shared/utils/cn";

export type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  /** Thumbnail sizes for table vs POS tile */
  size?: "sm" | "md" | "lg" | "fill";
};

/**
 * Product thumbnail — shows real image when present, neutral placeholder otherwise.
 */
function ProductImage({
  src,
  alt,
  className,
  size = "md",
}: ProductImageProps) {
  const sizeClass =
    size === "sm"
      ? "size-8"
      : size === "md"
        ? "size-10"
        : size === "lg"
          ? "size-16"
          : "size-full";

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          "object-cover bg-muted",
          size === "fill" ? "h-full w-full" : "rounded",
          sizeClass,
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        size === "fill" ? "h-full w-full" : "rounded",
        sizeClass,
        className,
      )}
      aria-hidden
    >
      <Package
        className={cn(
          size === "sm" ? "size-3.5" : size === "lg" || size === "fill" ? "size-6" : "size-4",
        )}
      />
    </div>
  );
}

export { ProductImage };
