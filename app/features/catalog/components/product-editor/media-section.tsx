import { useState } from "react";
import { ImagePlus, Plus, Star, Trash2, Upload } from "lucide-react";
import type {
  Control,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { EditorSection } from "~/features/catalog/components/product-editor/editor-section";
import { ProductImage } from "~/features/catalog/components/product-image";
import type { ProductFormValues } from "~/features/catalog/schema";
import {
  FormField,
  FormItem,
  FormMessage,
} from "~/shared/components/form/form";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/shared/components/ui/popover";
import { cn } from "~/shared/utils/cn";

type Props = {
  control: Control<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
};

export function MediaSection({ control, watch, setValue }: Props) {
  const [urlDraft, setUrlDraft] = useState("");
  const mediaUrls = watch("mediaUrls") ?? [];
  const primary = watch("imageUrl") || mediaUrls[0] || "";

  function syncPrimary(next: string[]) {
    setValue("mediaUrls", next, { shouldDirty: true });
    setValue("imageUrl", next[0] ?? "", { shouldDirty: true });
  }

  function addUrl(raw: string) {
    const url = raw.trim();
    if (!url) return;
    if (mediaUrls.includes(url)) return;
    syncPrimary([...mediaUrls, url]);
    setUrlDraft("");
  }

  function removeAt(index: number) {
    syncPrimary(mediaUrls.filter((_, i) => i !== index));
  }

  function makePrimary(index: number) {
    if (index === 0) return;
    const next = [...mediaUrls];
    const [item] = next.splice(index, 1);
    if (!item) return;
    syncPrimary([item, ...next]);
  }

  return (
    <EditorSection
      id="media"
      title="Product media"
      actions={
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline"
            >
              <Plus className="size-3.5" />
              Add from URL
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 space-y-2">
            <p className="text-xs font-medium">Add image URL</p>
            <Input
              className="h-9"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="https://…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl(urlDraft);
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              className="w-full"
              onClick={() => addUrl(urlDraft)}
            >
              Add image
            </Button>
          </PopoverContent>
        </Popover>
      }
    >
      <FormField
        control={control}
        name="mediaUrls"
        render={() => (
          <FormItem>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <label className="flex size-[88px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Upload className="size-4" />
                <span className="text-[10px] font-medium">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const objectUrl = URL.createObjectURL(file);
                    addUrl(objectUrl);
                    event.target.value = "";
                  }}
                />
              </label>

              {mediaUrls.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className={cn(
                    "group relative size-[88px] shrink-0 overflow-hidden rounded-md border border-border",
                    index === 0 && "ring-2 ring-primary ring-offset-1",
                  )}
                >
                  <ProductImage
                    src={url}
                    alt={`Media ${index + 1}`}
                    size="fill"
                    className="size-full"
                  />
                  <div className="absolute inset-0 flex items-end justify-between gap-1 bg-gradient-to-t from-foreground/50 to-transparent p-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      className="rounded bg-background/90 p-1 text-heading"
                      title="Set as primary"
                      onClick={() => makePrimary(index)}
                    >
                      <Star
                        className={cn(
                          "size-3",
                          index === 0 && "fill-primary text-primary",
                        )}
                      />
                    </button>
                    <button
                      type="button"
                      className="rounded bg-background/90 p-1 text-destructive"
                      title="Remove"
                      onClick={() => removeAt(index)}
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                  {index === 0 ? (
                    <span className="absolute top-1 left-1 rounded bg-primary px-1 py-px text-[9px] font-semibold text-primary-foreground">
                      Primary
                    </span>
                  ) : null}
                </div>
              ))}

              {mediaUrls.length === 0 ? (
                <div className="flex size-[88px] shrink-0 items-center justify-center rounded-md border border-border bg-muted/30 text-muted-foreground">
                  <ImagePlus className="size-5" />
                </div>
              ) : null}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              First image is primary
              {primary ? " · used on catalog & POS" : ""}. Upload uses a local
              preview until API upload exists.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorSection>
  );
}
