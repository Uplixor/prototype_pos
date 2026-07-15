import type { Control } from "react-hook-form";
import { EditorSection } from "~/features/catalog/components/product-editor/editor-section";
import type { ProductFormValues } from "~/features/catalog/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/shared/components/form/form";
import { RichTextEditor } from "~/shared/components/rich-text-editor";
import { Input } from "~/shared/components/ui/input";

type Props = {
  control: Control<ProductFormValues>;
};

export function GeneralInformationSection({ control }: Props) {
  return (
    <EditorSection id="general" title="General information">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              Product name
            </label>
            <FormControl>
              <Input
                className="h-9"
                placeholder="Product name"
                autoFocus
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          control={control}
          name="sku"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                SKU
              </label>
              <FormControl>
                <Input
                  className="h-9 font-mono"
                  placeholder="SKU-001"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="brand"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Brand
              </label>
              <FormControl>
                <Input className="h-9" placeholder="Brand" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              Description
            </label>
            <FormControl>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Describe the product…"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorSection>
  );
}
