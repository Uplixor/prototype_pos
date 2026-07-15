import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye } from "lucide-react";
import type { Resolver } from "react-hook-form";
import {
  useCategoriesQuery,
  useCreateProductMutation,
  useProductQuery,
  useUpdateProductMutation,
} from "~/features/catalog/api/catalog-mutations";
import { AvailabilitySection } from "~/features/catalog/components/product-editor/availability-section";
import {
  collectValidationIssues,
  firstFieldForSection,
  scrollToSection,
  type EditorSectionId,
} from "~/features/catalog/components/product-editor/editor-sections";
import { GeneralInformationSection } from "~/features/catalog/components/product-editor/general-information-section";
import { InventorySummarySection } from "~/features/catalog/components/product-editor/inventory-summary-section";
import { MediaSection } from "~/features/catalog/components/product-editor/media-section";
import { PricingSection } from "~/features/catalog/components/product-editor/pricing-section";
import { ProductEditorSidebar } from "~/features/catalog/components/product-editor/product-editor-sidebar";
import {
  ModifiersSection,
  VariantsSection,
} from "~/features/catalog/components/product-editor/variants-section";
import { useProductDrawer } from "~/features/catalog/hooks/use-product-drawer";
import { TAX_PROFILES } from "~/features/catalog/data/catalog-store";
import {
  productFormSchema,
  type ProductFormValues,
} from "~/features/catalog/schema";
import type { Category, Product } from "~/features/catalog/types";
import { productStatusToBadge } from "~/features/catalog/types";
import { flattenCategoryOptions } from "~/features/catalog/utils/category-tree";
import {
  clearFormDraft,
  useAppForm,
} from "~/shared/components/form/use-app-form";
import { Form } from "~/shared/components/form/form";
import { LoadingState } from "~/shared/components/page-primitives";
import { StatusBadge } from "~/shared/components/status-badge";
import { Button } from "~/shared/components/ui/button";

function emptyFormValues(): ProductFormValues {
  return {
    name: "",
    sku: "",
    barcode: "",
    brand: "",
    imageUrl: "",
    mediaUrls: [],
    description: "",
    categoryId: "",
    productType: "physical",
    status: "draft",
    baseUnit: "each",
    price: 0,
    compareAtPrice: undefined,
    cost: 0,
    taxProfile: TAX_PROFILES[0],
    trackInventory: true,
    branchIds: ["br_hq"],
    collections: [],
    tags: [],
    supplier: "",
    weightOz: undefined,
    dimL: undefined,
    dimW: undefined,
    dimH: undefined,
    hsCode: "",
    optionAxes: [],
    variants: [],
    modifiers: [],
  };
}

function toFormValues(product?: Product | null): ProductFormValues {
  if (!product) return emptyFormValues();
  const mediaUrls =
    product.mediaUrls && product.mediaUrls.length > 0
      ? product.mediaUrls
      : product.imageUrl
        ? [product.imageUrl]
        : [];
  return {
    name: product.name,
    sku: product.sku,
    barcode: product.barcode ?? "",
    brand: product.brand ?? "",
    imageUrl: product.imageUrl ?? mediaUrls[0] ?? "",
    mediaUrls,
    description: product.description,
    categoryId: product.categoryId,
    productType: product.productType,
    status: product.status,
    baseUnit: product.baseUnit,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    cost: product.cost,
    taxProfile: product.taxProfile,
    trackInventory: product.trackInventory,
    branchIds: product.branchIds,
    collections: product.collections ?? [],
    tags: product.tags ?? [],
    supplier: product.supplier ?? "",
    weightOz: product.weightOz,
    dimL: product.dimL,
    dimW: product.dimW,
    dimH: product.dimH,
    hsCode: product.hsCode ?? "",
    optionAxes: product.optionAxes,
    variants: product.variants.map((v) => ({
      ...v,
      barcode: v.barcode ?? "",
      imageUrl: v.imageUrl ?? "",
    })),
    modifiers: product.modifiers,
  };
}

export type ProductEditorPageProps = {
  productId?: string;
};

export function ProductEditorPage({ productId }: ProductEditorPageProps) {
  const navigate = useNavigate();
  const isCreate = !productId;
  const productQuery = useProductQuery(productId);
  const categoriesQuery = useCategoriesQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation(productId ?? "");

  const product = isCreate ? null : productQuery.data;
  const waitingForProduct = Boolean(productId) && productQuery.isLoading;

  if (waitingForProduct) {
    return <LoadingState label="Loading product…" />;
  }

  if (productId && !productQuery.isLoading && !product) {
    return (
      <div className="mx-page py-10 text-center">
        <p className="text-sm font-medium">Product not found</p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link to="/catalog">Back to catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <ProductEditorForm
      key={product?.id ?? "new"}
      product={product ?? null}
      categories={categoriesQuery.data ?? []}
      createMutation={createMutation}
      updateMutation={updateMutation}
      onDone={() => void navigate("/catalog")}
    />
  );
}

type FormProps = {
  product: Product | null;
  categories: Category[];
  createMutation: ReturnType<typeof useCreateProductMutation>;
  updateMutation: ReturnType<typeof useUpdateProductMutation>;
  onDone: () => void;
};

function ProductEditorForm({
  product,
  categories,
  createMutation,
  updateMutation,
  onDone,
}: FormProps) {
  const isEdit = Boolean(product);
  const draftKey = isEdit
    ? `catalog.product.draft.${product!.id}`
    : "catalog.product.draft.new";
  const [showValidation, setShowValidation] = useState(false);
  const { openViewProduct } = useProductDrawer();

  const form = useAppForm<ProductFormValues>({
    defaultValues: toFormValues(product),
    resolver: zodResolver(productFormSchema) as Resolver<ProductFormValues>,
    draftKey,
  });

  useEffect(() => {
    if (!product && !form.getValues("categoryId")) {
      const options = flattenCategoryOptions(categories);
      if (options[0]) form.setValue("categoryId", options[0].id);
    }
  }, [categories, form, product]);

  const pending = createMutation.isPending || updateMutation.isPending;
  const values = form.watch();

  function jumpToSection(sectionId: EditorSectionId) {
    scrollToSection(sectionId);
    const field = firstFieldForSection(sectionId);
    window.setTimeout(() => {
      void form.setFocus(field);
    }, 250);
  }

  async function persist(valuesToSave: ProductFormValues) {
    const mediaUrls = valuesToSave.mediaUrls.filter(Boolean);
    const payload = {
      ...valuesToSave,
      mediaUrls,
      imageUrl: valuesToSave.imageUrl || mediaUrls[0] || undefined,
    };
    if (isEdit && product) {
      await updateMutation.mutateAsync(payload);
    } else {
      await createMutation.mutateAsync(payload);
    }
    clearFormDraft(draftKey);
    onDone();
  }

  async function submitAs(status: ProductFormValues["status"]) {
    form.setValue("status", status, { shouldDirty: true });
    setShowValidation(true);
    await form.handleSubmit(
      async (vals) => {
        await persist({ ...vals, status });
      },
      (errors) => {
        const list = collectValidationIssues(errors);
        if (list[0]) jumpToSection(list[0].sectionId);
      },
    )();
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("textarea")) return;
      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        void submitAs("draft");
      }
      if (event.key === "Enter") {
        event.preventDefault();
        void submitAs("active");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function previewProduct() {
    const mediaUrls = values.mediaUrls.filter(Boolean);
    const preview: Product = {
      id: product?.id ?? "preview",
      organizationId: product?.organizationId ?? "org_demo",
      sku: values.sku || "SKU",
      barcode: values.barcode || undefined,
      name: values.name || "Untitled product",
      description: values.description,
      brand: values.brand || undefined,
      categoryId: values.categoryId,
      categoryName:
        categories.find((c) => c.id === values.categoryId)?.name ?? "",
      productType: values.productType,
      status: values.status,
      baseUnit: values.baseUnit,
      price: values.price,
      cost: values.cost,
      taxProfile: values.taxProfile,
      trackInventory: values.trackInventory,
      branchIds: values.branchIds,
      optionAxes: values.optionAxes,
      variants: values.variants.map((v) => ({
        ...v,
        barcode: v.barcode || undefined,
        imageUrl: v.imageUrl || undefined,
      })),
      modifiers: values.modifiers,
      imageUrl: values.imageUrl || mediaUrls[0],
      mediaUrls,
      createdAt: product?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    openViewProduct(preview);
  }

  return (
    <Form {...form}>
      <form
        className="bg-muted/20 pb-6"
        onSubmit={(event) => {
          event.preventDefault();
          void submitAs(
            form.getValues("status") === "active" ? "active" : "draft",
          );
        }}
      >
        <header className="sticky top-0 z-20 border-b border-border/80 bg-card/95 backdrop-blur">
          <div className="mx-page flex flex-col gap-2.5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Link to="/catalog" className="hover:text-foreground">
                  Catalog
                </Link>
                <span>/</span>
                <span>Products</span>
                <span>/</span>
                <span className="truncate text-heading">
                  {values.name.trim() ||
                    (isEdit ? product?.name : "New product")}
                </span>
              </div>
              <div className="mt-1 flex min-w-0 items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0"
                >
                  <Link to="/catalog" aria-label="Back to catalog">
                    <ArrowLeft className="size-4" />
                  </Link>
                </Button>
                <h1 className="truncate text-[15px] font-semibold tracking-tight text-heading">
                  {values.name.trim() ||
                    (isEdit ? product?.name : "Untitled product")}
                </h1>
                <StatusBadge status={productStatusToBadge(values.status)} />
              </div>
              <p className="mt-0.5 pl-9 text-[11px] text-muted-foreground">
                {form.isDirty
                  ? "Unsaved changes · local draft autosaves"
                  : form.isDraft
                    ? "Restored local draft"
                    : values.sku
                      ? values.sku
                      : "Define identity, media, pricing, and variants"}
                <span className="ml-2 hidden sm:inline">
                  · Ctrl+S draft · Ctrl+Enter publish
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                disabled={pending}
                onClick={previewProduct}
              >
                <Eye className="size-3.5" />
                Preview
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                disabled={pending}
                onClick={() => {
                  clearFormDraft(draftKey);
                  onDone();
                }}
              >
                Discard
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8"
                disabled={pending}
                onClick={() => void submitAs("draft")}
              >
                {pending ? "Saving…" : "Save draft"}
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-8"
                disabled={pending}
                onClick={() => void submitAs("active")}
              >
                {pending
                  ? "Saving…"
                  : values.status === "active"
                    ? "Save changes"
                    : "Publish"}
              </Button>
            </div>
          </div>
        </header>

        <div className="relative mx-page py-4">
          <div className="min-w-0 space-y-3.5 pb-2 lg:pr-[17.5rem] xl:pr-[19rem]">
            <GeneralInformationSection control={form.control} />
            <MediaSection
              control={form.control}
              watch={form.watch}
              setValue={form.setValue}
            />
            <PricingSection control={form.control} watch={form.watch} />
            <InventorySummarySection watch={form.watch} />
            <VariantsSection
              control={form.control}
              watch={form.watch}
              setValue={form.setValue}
            />
            <ModifiersSection control={form.control} />
            <AvailabilitySection control={form.control} />
          </div>

          {/*
            Desktop: absolute + sticky so sidebar never extends page scroll.
            Mobile: in-flow under the form.
          */}
          <aside className="mt-4 lg:absolute lg:top-4 lg:right-0 lg:bottom-4 lg:mt-0 lg:w-[16.5rem] xl:w-[18rem]">
            <div className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-5.5rem)] lg:overflow-y-auto lg:overscroll-contain">
              <ProductEditorSidebar
                control={form.control}
                watch={form.watch}
                errors={form.formState.errors}
                categories={categories}
                showValidation={showValidation || form.formState.isSubmitted}
                createdAt={product?.createdAt}
                updatedAt={product?.updatedAt}
                onJump={jumpToSection}
              />
            </div>
          </aside>
        </div>
      </form>
    </Form>
  );
}
