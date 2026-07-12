import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { catalogKeys } from "~/features/catalog/api/query-keys";
import {
  archiveProducts,
  createProduct,
  getProduct,
  listCategories,
  listProducts,
  updateProduct,
} from "~/features/catalog/data/catalog-store";
import type { ProductFormValues } from "~/features/catalog/schema";
import type { Product } from "~/features/catalog/types";

export function useProductsQuery() {
  return useQuery({
    queryKey: catalogKeys.products(),
    queryFn: listProducts,
  });
}

export function useProductQuery(id: string | undefined) {
  return useQuery({
    queryKey: catalogKeys.product(id ?? ""),
    queryFn: () => getProduct(id!),
    enabled: Boolean(id),
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: catalogKeys.categories(),
    queryFn: listCategories,
    staleTime: 60_000,
  });
}

function toProductPayload(values: ProductFormValues) {
  return {
    name: values.name,
    sku: values.sku,
    description: values.description,
    categoryId: values.categoryId,
    productType: values.productType,
    status: values.status,
    baseUnit: values.baseUnit,
    price: values.price,
    cost: values.cost,
    taxProfile: values.taxProfile,
    trackInventory: values.trackInventory,
    branchIds: values.branchIds,
  };
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ProductFormValues) =>
      createProduct(toProductPayload(values)),
    onSuccess: (product) => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.products() });
      toast.success(`Created ${product.name}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not create product");
    },
  });
}

export function useUpdateProductMutation(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ProductFormValues) =>
      updateProduct(productId, toProductPayload(values)),
    onSuccess: (product) => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.products() });
      void queryClient.invalidateQueries({
        queryKey: catalogKeys.product(productId),
      });
      toast.success(`Updated ${product.name}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not update product");
    },
  });
}

export function useArchiveProductsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => archiveProducts(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: catalogKeys.products() });
      const previous = queryClient.getQueryData<Product[]>(
        catalogKeys.products(),
      );
      if (previous) {
        const idSet = new Set(ids);
        queryClient.setQueryData<Product[]>(
          catalogKeys.products(),
          previous.map((product) =>
            idSet.has(product.id)
              ? { ...product, status: "archived" }
              : product,
          ),
        );
      }
      return { previous };
    },
    onError: (_error, _ids, context) => {
      if (context?.previous) {
        queryClient.setQueryData(catalogKeys.products(), context.previous);
      }
      toast.error("Could not archive products");
    },
    onSuccess: (_data, ids) => {
      toast.success(
        ids.length === 1
          ? "Product archived"
          : `${ids.length} products archived`,
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.products() });
    },
  });
}
