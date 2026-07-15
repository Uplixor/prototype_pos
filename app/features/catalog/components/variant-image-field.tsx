import { ImagePlus, Upload } from "lucide-react";
import { ProductImage } from "~/features/catalog/components/product-image";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/shared/components/ui/popover";

type VariantImageFieldProps = {
  value?: string;
  fallbackUrl?: string;
  alt: string;
  onChange: (url: string) => void;
};

/** Thumbnail trigger + popover: upload file or paste URL. */
function VariantImageField({
  value,
  fallbackUrl,
  alt,
  onChange,
}: VariantImageFieldProps) {
  const display = value || fallbackUrl;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group relative rounded border border-border hover:border-primary"
          title="Set variant image"
          aria-label={`Set image for ${alt}`}
        >
          <ProductImage src={display} alt={alt} size="sm" className="rounded" />
          <span className="absolute inset-0 flex items-center justify-center rounded bg-foreground/0 opacity-0 transition-opacity group-hover:bg-foreground/40 group-hover:opacity-100">
            <ImagePlus className="size-3.5 text-background" />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 space-y-3">
        <div>
          <p className="text-sm font-medium">Variant image</p>
          <p className="text-[11px] text-muted-foreground">
            Upload a file or paste a URL. Empty uses the product primary image.
          </p>
        </div>
        <ProductImage
          src={display}
          alt={alt}
          size="lg"
          className="mx-auto size-24 rounded-md"
        />
        <label className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-muted/40 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
          <Upload className="size-3.5" />
          Upload image
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              onChange(URL.createObjectURL(file));
              event.target.value = "";
            }}
          />
        </label>
        <div className="relative">
          <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[10px] text-muted-foreground">
            or
          </span>
          <Input
            className="h-9 pl-8"
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://…/variant.jpg"
          />
        </div>
        <div className="flex justify-end gap-2">
          {value ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onChange("")}
            >
              Clear
            </Button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { VariantImageField };
