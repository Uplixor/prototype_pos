import { useMemo, useState } from "react";
import type { Control, FieldErrors, UseFormWatch } from "react-hook-form";
import {
  collectValidationIssues,
  EDITOR_SECTIONS,
  scrollToSection,
  type EditorSectionId,
} from "~/features/catalog/components/product-editor/editor-sections";
import type { Category } from "~/features/catalog/types";
import { formatMoney, productStatusToBadge } from "~/features/catalog/types";
import {
  PRODUCT_STATUS_LABELS,
  PRODUCT_TYPE_LABELS,
  type ProductFormValues,
} from "~/features/catalog/schema";
import { flattenCategoryOptions } from "~/features/catalog/utils/category-tree";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/shared/components/form/form";
import { StatusBadge } from "~/shared/components/status-badge";
import { Input } from "~/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select";
import { cn } from "~/shared/utils/cn";

type Props = {
  control: Control<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  categories: Category[];
  showValidation: boolean;
  createdAt?: string;
  updatedAt?: string;
  onJump: (sectionId: EditorSectionId) => void;
};

function SideCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/80 bg-card">
      <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
        <h3 className="text-[12px] font-semibold text-heading">{title}</h3>
        {action}
      </div>
      <div className="space-y-2.5 px-3 py-2.5">{children}</div>
    </div>
  );
}

function ChipInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const value = draft.trim();
    if (!value) return;
    if (values.some((v) => v.toLowerCase() === value.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...values, value]);
    setDraft("");
  }

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[11px]"
            onClick={() => onChange(values.filter((v) => v !== value))}
          >
            {value} ×
          </button>
        ))}
      </div>
      <Input
        className="h-8 text-xs"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
      />
    </div>
  );
}

export function ProductEditorSidebar({
  control,
  watch,
  errors,
  categories,
  showValidation,
  createdAt,
  updatedAt,
  onJump,
}: Props) {
  const values = watch();
  const categoryOptions = flattenCategoryOptions(categories);
  const issues = useMemo(
    () => (showValidation ? collectValidationIssues(errors) : []),
    [errors, showValidation],
  );

  const margin =
    values.price > 0
      ? Math.round(((values.price - values.cost) / values.price) * 10) / 10
      : null;

  return (
    <aside className="flex w-full flex-col gap-3">
      <nav className="shrink-0 rounded-lg border border-border/80 bg-card p-2">
        <p className="px-1.5 py-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          Jump to
        </p>
        <ul className="space-y-0.5">
          {EDITOR_SECTIONS.map((section) => {
            const count = issues.filter(
              (i) => i.sectionId === section.id,
            ).length;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-1.5 py-1 text-left text-[11px] hover:bg-muted",
                    count > 0 && "text-destructive",
                  )}
                  onClick={() => {
                    onJump(section.id);
                    scrollToSection(section.id);
                  }}
                >
                  <span>{section.label}</span>
                  {count > 0 ? (
                    <span className="rounded-full bg-destructive/10 px-1.5 text-[10px]">
                      {count}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {issues.length > 0 ? (
        <div className="shrink-0 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
          <p className="text-[12px] font-semibold text-destructive">
            Fix {issues.length} issue{issues.length === 1 ? "" : "s"}
          </p>
          <ul className="mt-1.5 space-y-1">
            {issues.slice(0, 5).map((issue) => (
              <li key={`${issue.path}-${issue.message}`}>
                <button
                  type="button"
                  className="text-left text-[11px] text-destructive hover:underline"
                  onClick={() => onJump(issue.sectionId)}
                >
                  {issue.sectionLabel}: {issue.message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <SideCard title="Status">
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <StatusBadge status={productStatusToBadge(field.value)} />
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-8 w-[7.5rem] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(
                      Object.keys(PRODUCT_STATUS_LABELS) as Array<
                        keyof typeof PRODUCT_STATUS_LABELS
                      >
                    ).map((status) => (
                      <SelectItem key={status} value={status}>
                        {PRODUCT_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {field.value === "draft"
                  ? "Not sellable until published"
                  : field.value === "active"
                    ? "Available for new sales"
                    : "Hidden from new sales"}
              </p>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="productType"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground">
                Type
              </label>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(
                    Object.keys(PRODUCT_TYPE_LABELS) as Array<
                      keyof typeof PRODUCT_TYPE_LABELS
                    >
                  ).map((type) => (
                    <SelectItem key={type} value={type}>
                      {PRODUCT_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </SideCard>

      <SideCard title="Organization">
        <FormField
          control={control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground">
                Category
              </label>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="brand"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground">
                Brand
              </label>
              <FormControl>
                <Input className="h-8 text-xs" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="supplier"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground">
                Supplier
              </label>
              <FormControl>
                <Input className="h-8 text-xs" placeholder="Optional" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="collections"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground">
                Collections
              </label>
              <ChipInput
                values={field.value}
                onChange={field.onChange}
                placeholder="Add to collection…"
              />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="tags"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground">
                Tags
              </label>
              <ChipInput
                values={field.value}
                onChange={field.onChange}
                placeholder="Add tag…"
              />
            </FormItem>
          )}
        />
      </SideCard>

      <SideCard title="Pricing snapshot">
        <Row label="Base" value={formatMoney(values.price)} />
        <Row label="Cost" value={formatMoney(values.cost)} />
        <Row label="Margin" value={margin === null ? "—" : `${margin}%`} />
        <Row label="Tax" value={values.taxProfile} />
        <p className="text-[10px] text-muted-foreground">
          Edit pricing in the main column
        </p>
      </SideCard>

      <SideCard title="Shipping">
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={control}
            name="weightOz"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <label className="text-[10px] font-medium text-muted-foreground">
                  Weight (oz)
                </label>
                <FormControl>
                  <Input
                    className="h-8 text-xs"
                    type="number"
                    min={0}
                    step="0.1"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="hsCode"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <label className="text-[10px] font-medium text-muted-foreground">
                  HS code
                </label>
                <FormControl>
                  <Input className="h-8 text-xs" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              ["dimL", "L"],
              ["dimW", "W"],
              ["dimH", "H"],
            ] as const
          ).map(([name, label]) => (
            <FormField
              key={name}
              control={control}
              name={name}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <label className="text-[10px] font-medium text-muted-foreground">
                    {label}
                  </label>
                  <FormControl>
                    <Input
                      className="h-8 text-xs"
                      type="number"
                      min={0}
                      step="0.1"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
      </SideCard>

      <SideCard title="Audit">
        <Row
          label="Created"
          value={createdAt ? new Date(createdAt).toLocaleString() : "—"}
        />
        <Row
          label="Updated"
          value={updatedAt ? new Date(updatedAt).toLocaleString() : "—"}
        />
        <Row label="Variants" value={String(values.variants.length)} />
        <Row label="Media" value={String(values.mediaUrls.length)} />
      </SideCard>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 text-[11px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[60%] text-right font-medium">{value}</span>
    </div>
  );
}
